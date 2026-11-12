import { limpiarSesion } from './tokenStorage';

export const EVENTO_SESION_EXPIRADA = 'sesion-expirada';

// El cierre por expiración se dispara desde varios lugares (timers, 401,
// bootstrap). Este flag asegura que el aviso se muestre una sola vez.
let sesionExpiradaNotificada = false;

export function cerrarSesionPorExpiracion() {
  limpiarSesion();
  if (sesionExpiradaNotificada) return;
  sesionExpiradaNotificada = true;
  window.dispatchEvent(new CustomEvent(EVENTO_SESION_EXPIRADA));
}

export function reiniciarAvisoExpiracion() {
  sesionExpiradaNotificada = false;
}
