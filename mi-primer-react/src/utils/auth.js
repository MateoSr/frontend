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

export function obtenerRol() {
  const token = localStorage.getItem('gestor_token');
  if (!token) return null;
  const payload = decodificarPayload(token);
  if (!payload) {
    localStorage.removeItem('gestor_token');
    return null;
  }
  if (payload.exp && payload.exp * 1000 < Date.now()) {
    localStorage.removeItem('gestor_token');
    return null;
  }
  return payload.rol ?? null;
}
