import { useCallback, useEffect, useRef, useState } from 'react';
import { useModal } from '../../context/modal/ModalContext.jsx';
import { msHastaExpiracion } from '../../utils/auth.js';
import {
  ULTIMA_ACTIVIDAD_KEY,
  guardarUltimaActividad,
  obtenerRefreshToken,
  obtenerToken,
  obtenerUltimaActividad,
} from '../../utils/tokenStorage.js';
import { refrescarSesion } from '../../services/apiClient.js';
import {
  EVENTO_SESION_EXPIRADA,
  cerrarSesionPorExpiracion,
  reiniciarAvisoExpiracion,
} from '../../utils/sesion.js';

const INACTIVIDAD_MS = 60 * 60 * 1000;
const MARGEN_REFRESCO_MS = 60 * 1000;
const THROTTLE_ACTIVIDAD_MS = 15 * 1000;
const CHEQUEO_MS = 30 * 1000;

const EVENTOS_ACTIVIDAD = ['mousemove', 'mousedown', 'keydown', 'scroll', 'wheel', 'touchstart'];

function SesionExpiracion({ children }) {
  const { mostrarModal } = useModal();
  const [listo, setListo] = useState(false);
  const temporizadorRef = useRef(null);
  const intervaloRef = useRef(null);
  const avisoMostradoRef = useRef(false);
  const programarRefrescoRef = useRef(null);

  const inactividadVencida = useCallback(() => {
    const ultima = obtenerUltimaActividad();
    return ultima !== null && Date.now() - ultima >= INACTIVIDAD_MS;
  }, []);

  const mostrarAvisoExpiracion = useCallback(async () => {
    if (avisoMostradoRef.current) return;
    avisoMostradoRef.current = true;

    await mostrarModal({
      titulo: 'Sesión expirada',
      mensaje: 'Tu sesión expiró por inactividad. Por seguridad, iniciá sesión nuevamente.',
      tipo: 'info',
    });

    window.location.href = '/';
  }, [mostrarModal]);

  // Aviso único ante cualquier cierre por expiración (timer, 401, bootstrap).
  useEffect(() => {
    const manejarExpiracion = () => {
      mostrarAvisoExpiracion();
    };

    window.addEventListener(EVENTO_SESION_EXPIRADA, manejarExpiracion);
    return () => window.removeEventListener(EVENTO_SESION_EXPIRADA, manejarExpiracion);
  }, [mostrarAvisoExpiracion]);

  const programarRefresco = useCallback(() => {
    if (temporizadorRef.current) {
      clearTimeout(temporizadorRef.current);
      temporizadorRef.current = null;
    }

    if (!obtenerToken()) return;

    const restante = msHastaExpiracion();
    if (restante === null) return;

    const tieneRefresh = Boolean(obtenerRefreshToken());
    // Renovamos un minuto antes del vencimiento. Si no hay refresh,
    // cerramos directamente cuando vence el access.
    const espera = Math.max(tieneRefresh ? restante - MARGEN_REFRESCO_MS : restante, 0);

    temporizadorRef.current = setTimeout(async () => {
      if (!obtenerToken()) return;

      if (inactividadVencida() || !tieneRefresh) {
        cerrarSesionPorExpiracion();
        return;
      }

      try {
        await refrescarSesion();
        reiniciarAvisoExpiracion();
        programarRefrescoRef.current?.();
      } catch {
        cerrarSesionPorExpiracion();
      }
    }, espera);
  }, [inactividadVencida]);

  useEffect(() => {
    programarRefrescoRef.current = programarRefresco;
  }, [programarRefresco]);

  const verificarSesion = useCallback(async () => {
    if (!obtenerToken()) return;

    if (inactividadVencida()) {
      cerrarSesionPorExpiracion();
      return;
    }

    const restante = msHastaExpiracion();
    if (restante !== null && restante <= MARGEN_REFRESCO_MS && obtenerRefreshToken()) {
      try {
        await refrescarSesion();
        reiniciarAvisoExpiracion();
        programarRefresco();
      } catch {
        cerrarSesionPorExpiracion();
      }
    }
  }, [inactividadVencida, programarRefresco]);

  // Bootstrap: si el access venció pero el refresh sigue vivo (usuario activo),
  // lo renovamos antes de renderizar las rutas protegidas.
  useEffect(() => {
    let cancelado = false;

    const iniciar = async () => {
      const token = obtenerToken();
      if (!token) {
        if (!cancelado) setListo(true);
        return;
      }

      if (obtenerUltimaActividad() === null) {
        guardarUltimaActividad();
      }

      const restante = msHastaExpiracion(token);
      if (restante !== null && restante > 0) {
        if (!cancelado) setListo(true);
        return;
      }

      if (!obtenerRefreshToken() || inactividadVencida()) {
        cerrarSesionPorExpiracion();
        return;
      }

      try {
        await refrescarSesion();
        if (!cancelado) {
          reiniciarAvisoExpiracion();
          setListo(true);
        }
      } catch {
        cerrarSesionPorExpiracion();
      }
    };

    iniciar();
    return () => {
      cancelado = true;
    };
  }, [inactividadVencida]);

  // Actividad del usuario + chequeo periódico + retorno a la pestaña.
  useEffect(() => {
    if (!listo || !obtenerToken()) return undefined;

    let ultimaActividadRegistrada = obtenerUltimaActividad() ?? Date.now();

    const registrarActividad = () => {
      const ahora = Date.now();
      if (ahora - ultimaActividadRegistrada < THROTTLE_ACTIVIDAD_MS) return;
      ultimaActividadRegistrada = ahora;
      guardarUltimaActividad(ahora);
    };

    const alVolverALaPestana = () => {
      if (document.visibilityState === 'visible') verificarSesion();
    };

    const sincronizarActividadEntrePestanas = (evento) => {
      if (evento.key === ULTIMA_ACTIVIDAD_KEY && evento.newValue) {
        const valor = Number(evento.newValue);
        if (Number.isFinite(valor)) ultimaActividadRegistrada = valor;
      }
    };

    EVENTOS_ACTIVIDAD.forEach((evento) =>
      window.addEventListener(evento, registrarActividad, { passive: true })
    );
    document.addEventListener('visibilitychange', alVolverALaPestana);
    window.addEventListener('focus', alVolverALaPestana);
    window.addEventListener('storage', sincronizarActividadEntrePestanas);

    programarRefresco();
    intervaloRef.current = setInterval(verificarSesion, CHEQUEO_MS);

    return () => {
      EVENTOS_ACTIVIDAD.forEach((evento) =>
        window.removeEventListener(evento, registrarActividad)
      );
      document.removeEventListener('visibilitychange', alVolverALaPestana);
      window.removeEventListener('focus', alVolverALaPestana);
      window.removeEventListener('storage', sincronizarActividadEntrePestanas);
      clearInterval(intervaloRef.current);
      clearTimeout(temporizadorRef.current);
    };
  }, [listo, programarRefresco, verificarSesion]);

  return listo ? children : null;
}

export default SesionExpiracion;
