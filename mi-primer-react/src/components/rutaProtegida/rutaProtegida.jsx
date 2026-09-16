import { Navigate } from 'react-router-dom';

function obtenerPayload(token) {
  try {
    const partePayload = token.split('.')[1];
    const payloadBase64 = partePayload.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(payloadBase64));
  } catch {
    return null;
  }
}

export function RutaProtegida({ rol, children }) {
  const token = localStorage.getItem('gestor_token');
  const payload = token ? obtenerPayload(token) : null;

  if (!payload) {
    localStorage.removeItem('gestor_token');
    return <Navigate to="/login" replace />;
  }

  if (payload.rol !== rol) {
    return <Navigate to="/" replace />;
  }

  return children;
}
