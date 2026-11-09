import { useEffect, useState } from 'react';
import { crearReservaEncargado, obtenerDatosReserva } from '../services/reservaService';
import { crearOrdenPago } from '../services/pagoService';
import { useModal } from '../context/modal/ModalContext';
import { formatearFechaUTC, formatearHoraUTC } from '../utils/fechas';

export const useReserva = ({ complejo, canchaNro, inicio, duracion, modo }) => {
  const { mostrarModal: mostrarAviso } = useModal();
  const esEncargado = modo === 'encargado';
  const inicioDate = inicio ? new Date(inicio) : null;
  const inicioValido = inicioDate && !Number.isNaN(inicioDate.getTime());
  const duracionMin = Number(duracion) || 60;
  const finDate = inicioValido
    ? new Date(inicioDate.getTime() + duracionMin * 60 * 1000)
    : null;

  const [reserva, setReserva] = useState({
    complejo,
    canchaNro,
    inicio,
    duracion: '',
    complejoNombre: '',
    complejoUbicacion: '',
    deporte: '',
    precioSenia: '',
    precioTotal: ''
  });
  const [titular, setTitular] = useState({
    id: '',
    nombre: '',
    apellido: '',
    telefono: '',
    email: ''
  });
  const [cargando, setCargando] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('gestor_token');
    if (!token) {
      mostrarAviso({
        titulo: 'Sesión requerida',
        mensaje: 'No estás logueado. Por favor, inicia sesión.',
        tipo: 'info'
      }).then(() => {
        window.location.href = '/login';
      });
      return undefined;
    }

    const controller = new AbortController();

    const cargarDatos = async () => {
      setCargando(true);

      try {
        const { perfil, complejo: datosComplejo, cancha } = await obtenerDatosReserva({
          complejoId: complejo,
          canchaNro,
          token,
          signal: controller.signal
        });

        if (!esEncargado) {
          setTitular({
            id: perfil.id,
            nombre: perfil.nombre || '',
            apellido: perfil.apellido || '',
            telefono: perfil.telefono || '',
            email: perfil.email || ''
          });
        }
        setReserva((reservaActual) => ({
          ...reservaActual,
          complejoNombre: datosComplejo.nombre || '',
          complejoUbicacion: datosComplejo.ubicacion || '',
          deporte: cancha.deporte || cancha.tipoCancha?.deporte || '',
          duracion: cancha.duracion || cancha.tipoCancha?.duracion || 60,
          precioSenia: cancha.precios[0].precioSena || 'a',
          precioTotal: cancha.precios[0].precioBase || 'a'
        }));

      } catch (error) {
        if (error.name !== 'AbortError') {
          mostrarAviso({
            titulo: 'Error',
            mensaje: `Error cargando información: ${error.message}`,
            tipo: 'error'
          });
        }
      } finally {
        if (!controller.signal.aborted) {
          setCargando(false);
        }
      }
    };

    cargarDatos();
    return () => controller.abort();
  }, [complejo, canchaNro, esEncargado, mostrarAviso]);

  const handleChange = (event) => {
    setTitular((titularActual) => ({
      ...titularActual,
      [event.target.name]: event.target.value
    }));
  };

  const handleConfirmar = async () => {
    const token = localStorage.getItem('gestor_token');
    if (!token) {
      mostrarAviso({
        titulo: 'Sesión expirada',
        mensaje: 'Sesión expirada. Por favor, inicia sesión nuevamente.',
        tipo: 'error'
      });
      return;
    }

    if (esEncargado && (!titular.nombre || !titular.apellido)) {
      mostrarAviso({
        titulo: 'Datos incompletos',
        mensaje: 'Completá todos los datos del cliente para agendar el turno.',
        tipo: 'info'
      });
      return;
    }

    if (!inicioValido || !finDate) {
      mostrarAviso({
        titulo: 'Horario inválido',
        mensaje: 'No se pudo interpretar el horario seleccionado.',
        tipo: 'error'
      });
      return;
    }

    if (inicioDate < new Date()) {
      mostrarAviso({
        titulo: 'Horario inválido',
        mensaje: 'No se pueden crear turnos para fechas u horarios pasados.',
        tipo: 'error'
      });
      return;
    }

    if (esEncargado) {
      const turno = {
        tipoTurnoId: 1,
        complejoId: parseInt(complejo, 10),
        canchaNro: parseInt(canchaNro, 10),
        fechaInicio: inicioDate.toISOString(),
        fechaFin: finDate.toISOString(),
        estado: 'Reservado',
        nombreSolicitante: titular.nombre,
        apellidoSolicitante: titular.apellido,
      };

      try {
        await crearReservaEncargado(turno, {
          nombre: titular.nombre,
          apellido: titular.apellido,
          telefono: titular.telefono,
          email: titular.email
        }, token);
        setMostrarModal(true);
      } catch (error) {
        console.error(error);
        mostrarAviso({
          titulo: 'Error',
          mensaje: `Error creando la reserva: ${error.message}`,
          tipo: 'error'
        });
      }
      return;
    }

    try {
      const resultado = await crearOrdenPago({
        complejoId: parseInt(complejo, 10),
        canchaNro: parseInt(canchaNro, 10),
        fechaInicio: inicioDate.toISOString(),
        duracion: duracionMin,
        tipoTurnoId: 1
      }, token);

      if (resultado?.checkoutUrl) {
        window.location.href = resultado.checkoutUrl;
        return;
      }
      throw new Error('No se obtuvo el link de pago');
    } catch (error) {
      console.error(error);
      mostrarAviso({
        titulo: 'Error',
        mensaje: `Error iniciando el pago: ${error.message}`,
        tipo: 'error'
      });
    }
  };

  return {
    reserva,
    titular,
    cargando,
    mostrarModal,
    esEncargado,
    fecha: inicioValido ? formatearFechaUTC(inicioDate) : '',
    horaInicio: inicioValido ? formatearHoraUTC(inicioDate) : '',
    horaFin: finDate ? formatearHoraUTC(finDate) : '',
    handleChange,
    handleConfirmar
  };
};
