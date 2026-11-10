import axios from 'axios';
import { API_URL } from '../config/api.js';
import { obtenerToken } from '../utils/tokenStorage.js';

export const api = axios.create({ baseURL: API_URL });

// Antes de cada request: agrega el token si existe.
// Los endpoints públicos pueden pasar { skipAuth: true } para no enviarlo.
api.interceptors.request.use((config) => {
  const token = obtenerToken();
  if (token && !config.skipAuth) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Después de cada response: devuelve directamente los datos y
// normaliza los errores para que todos tengan status y message.
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
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
