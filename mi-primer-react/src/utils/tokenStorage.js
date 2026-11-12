const TOKEN_KEY = 'gestor_token';
const REFRESH_TOKEN_KEY = 'gestor_refresh_token';
const ULTIMA_ACTIVIDAD_KEY = 'gestor_ultima_actividad';

export { TOKEN_KEY, REFRESH_TOKEN_KEY, ULTIMA_ACTIVIDAD_KEY };

export function obtenerToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function guardarToken(token) {
  if (!token) return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function eliminarToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function obtenerRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function guardarRefreshToken(refreshToken) {
  if (!refreshToken) return;
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function guardarTokens({ token, refreshToken } = {}) {
  if (token) guardarToken(token);
  if (refreshToken) guardarRefreshToken(refreshToken);
}

export function hayToken() {
  return Boolean(obtenerToken());
}

export function guardarUltimaActividad(instante = Date.now()) {
  localStorage.setItem(ULTIMA_ACTIVIDAD_KEY, String(instante));
}

export function obtenerUltimaActividad() {
  const valor = Number(localStorage.getItem(ULTIMA_ACTIVIDAD_KEY));
  return Number.isFinite(valor) && valor > 0 ? valor : null;
}

// Limpia todo lo que compone la sesión: access, refresh e inactividad.
export function limpiarSesion() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(ULTIMA_ACTIVIDAD_KEY);
}
