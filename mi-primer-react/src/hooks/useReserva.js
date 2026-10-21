import { useEffect, useState } from 'react';
import { crearReserva, crearReservaEncargado, obtenerDatosReserva } from '../services/reservaService';
import { useModal } from '../context/modal/ModalContext';
import { combinarFechaHoraUTC } from '../utils/fechas';

const calcularHoraFin = (horaInicio, duracionMinutos) => {
  if (!horaInicio) return '';

  const [horas, minutos] = horaInicio.split(':').map(Number);
  const fecha = new Date();
  fecha.setHours(horas, minutos + Number(duracionMinutos || 60), 0);

  return `${fecha.getHours().toString().padStart(2, '0')}:${fecha
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
};

export const useReserva = ({ complejo, canchaNro, fecha, horaInicio, modo }) => {
  const { mostrarModal: mostrarAviso } = useModal();
  const esEncargado = modo === 'encargado';
  const [reserva, setReserva] = useState({
    complejo,
    canchaNro,
    fecha,
    horaInicio,
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
          precioSenia: cancha.precioSenia || '',
          precioTotal: cancha.precioTotal || ''
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

    if (esEncargado && (!titular.nombre || !titular.apellido || !titular.telefono || !titular.email)) {
      mostrarAviso({
        titulo: 'Datos incompletos',
        mensaje: 'Completá todos los datos del cliente para agendar el turno.',
        tipo: 'info'
      });
      return;
    }

    const fechaInicioUTC = combinarFechaHoraUTC(fecha, horaInicio);
    if (fechaInicioUTC && fechaInicioUTC < new Date()) {
      mostrarAviso({
        titulo: 'Horario inválido',
        mensaje: 'No se pueden crear turnos para fechas u horarios pasados.',
        tipo: 'error'
      });
      return;
    }

    const horaFin = calcularHoraFin(horaInicio, reserva.duracion);
    const turno = {
      tipoTurnoId: 1,
      complejoId: parseInt(complejo, 10),
      canchaNro: parseInt(canchaNro, 10),
      fechaInicio: combinarFechaHoraUTC(fecha, horaInicio),
      fechaFin: combinarFechaHoraUTC(fecha, horaFin),
      estado: 'Reservado'
    };

    if (!esEncargado) {
      turno.clienteId = titular.id;
    }

    try {
      if (esEncargado) {
        await crearReservaEncargado(turno, {
          nombre: titular.nombre,
          apellido: titular.apellido,
          telefono: titular.telefono,
          email: titular.email
        }, token);
      } else {
        await crearReserva(turno, token);
      }
      setMostrarModal(true);
    } catch (error) {
      console.error(error);
      mostrarAviso({
        titulo: 'Error',
        mensaje: `Error creando la reserva: ${error.message}`,
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
    horaFin: calcularHoraFin(reserva.horaInicio, reserva.duracion),
    handleChange,
    handleConfirmar
  };
};