import axios from 'axios';
import { API_URL } from '../config/api.js';
import { guardarTokens, obtenerRefreshToken, obtenerToken } from '../utils/tokenStorage.js';
import { cerrarSesionPorExpiracion } from '../utils/sesion.js';

export const api = axios.create({ baseURL: API_URL });

// Instancia aparte para el refresh: así no entra en el interceptor de 401
// y no se puede producir un loop de reintentos.
const refreshClient = axios.create({ baseURL: API_URL });

let refrescoEnCurso = null;

/**
 * Renueva el access token usando el refresh token.
 * Single-flight: si varias requests reciben 401 a la vez, comparten la
 * misma promesa y se hace un solo POST /refresh.
 */
export function refrescarSesion() {
  if (refrescoEnCurso) return refrescoEnCurso;

  const refreshToken = obtenerRefreshToken();
  if (!refreshToken) {
    return Promise.reject(new Error('No hay refresh token'));
  }

  refrescoEnCurso = refreshClient
    .post('/refresh', { refreshToken })
    .then(({ data }) => {
      const token = data?.token?.token;
      const nuevoRefreshToken = data?.token?.refreshToken;
      if (!token) throw new Error('Respuesta de refresh inválida');
      guardarTokens({ token, refreshToken: nuevoRefreshToken });
      return token;
    })
    .finally(() => {
      refrescoEnCurso = null;
    });

  return refrescoEnCurso;
}

// Antes de cada request: agrega el token si existe.
// Los endpoints públicos pueden pasar { skipAuth: true } para no enviarlo.
api.interceptors.request.use((config) => {
  const token = obtenerToken();
  if (token && !config.skipAuth) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Después de cada response: devuelve directamente los datos,
// renueva la sesión ante un 401 y normaliza los errores.
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const status = error.response?.status;
    const config = error.config;
    const esRefresh = typeof config?.url === 'string' && config.url.includes('/refresh');

    if (status === 401 && config && !config.skipAuth && !config._reintento && !esRefresh) {
      try {
        await refrescarSesion();
        config._reintento = true;
        // El interceptor de request vuelve a leer el token ya renovado.
        return api.request(config);
      } catch {
        // El refresh venció por inactividad o es inválido: cerramos sesión.
        cerrarSesionPorExpiracion();
      }
    }

    const data = error.response?.data;
    const mensaje =
      data?.message ||
      data?.error ||
      (status ? `Error ${status}` : 'Error de conexión con el servidor');

    const apiError = new Error(mensaje);
    apiError.name = 'ApiError';
    apiError.status = status;
    apiError.data = data;
    return Promise.reject(apiError);
  }
);
