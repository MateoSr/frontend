const TOKEN_KEY = 'gestor_token';

export function obtenerToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function guardarToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function eliminarToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function hayToken() {
  return Boolean(obtenerToken());
}
