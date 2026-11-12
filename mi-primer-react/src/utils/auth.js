import { obtenerToken } from './tokenStorage';

export function decodificarPayload(token) {
  try {
    const partePayload = token.split('.')[1];
    const payloadBase64 = partePayload.replace(/-/g, '+').replace(/_/g, '/');
    // atob devuelve Latin-1 y rompería caracteres como la ñ de "Dueño":
    // se reconvierte a UTF-8 antes de parsear.
    const binario = atob(payloadBase64);
    const bytes = Uint8Array.from(binario, (c) => c.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return null;
  }
}

/**
 * Milisegundos que faltan para que venza el token.
 * null si no hay token, es inválido o no tiene exp.
 */
export function msHastaExpiracion(token = obtenerToken()) {
  if (!token) return null;
  const payload = decodificarPayload(token);
  if (!payload?.exp) return null;
  return payload.exp * 1000 - Date.now();
}

export function obtenerRol() {
  const token = obtenerToken();
  if (!token) return null;
  const payload = decodificarPayload(token);
  if (!payload) return null;
  // No borramos el token vencido acá: el módulo de sesión puede renovarlo
  // con el refresh token antes de decidir cerrar sesión.
  if (payload.exp && payload.exp * 1000 <= Date.now()) return null;
  return payload.rol ?? null;
}
