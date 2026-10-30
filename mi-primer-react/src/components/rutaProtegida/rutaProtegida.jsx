import { Navigate, useLocation } from 'react-router-dom';
import { obtenerRol } from '../../utils/auth';

// Cada rol operativo vive encerrado en sus rutas: cualquier otra URL rebota a su menú.
const ZONAS_POR_ROL = {
  Encargado: { inicio: '/menuEncargado', permitidas: ['/menuEncargado', '/confirmar-reserva'] },
  'Dueño': { inicio: '/menuDueño', permitidas: ['/menuDueño', '/complejo/'] },
};

export function BloqueoPorRol({ children }) {
  const { pathname } = useLocation();
  // El navegador entrega el pathname con la ñ codificada (%C3%B1) mientras que
  // las rutas están escritas con ñ. Sin decodificar, nada coincide y el guard
  // rebotaría a la misma URL en loop, dejando la página en blanco.
  let ruta = pathname;
  try {
    ruta = decodeURIComponent(pathname);
  } catch {
    ruta = pathname;
  }
  const rol = obtenerRol();
  const zona = rol ? ZONAS_POR_ROL[rol] : null;
  if (!zona) return children;
  const permitida = zona.permitidas.some(
    (base) => ruta === base || ruta.startsWith(base) || pathname === base || pathname.startsWith(base)
  );
  if (!permitida) return <Navigate to={zona.inicio} replace />;
  return children;
}

export function RutaProtegida({ rol, children }) {
  const rolActual = obtenerRol();

  if (!rolActual) {
    return <Navigate to="/login" replace />;
  }

  if (rolActual !== rol) {
    return <Navigate to="/" replace />;
  }

  return children;
}
