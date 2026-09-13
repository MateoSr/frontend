import { useEffect, useState } from 'react';
import { crearReserva, obtenerDatosReserva } from '../services/reservaService';

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

export const useReserva = ({ complejo, canchaNro, fecha, horaInicio }) => {
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
      alert('No estás logueado. Por favor, inicia sesión.');
      window.location.href = '/login';
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

        setTitular({
          id: perfil.id,
          nombre: perfil.nombre || '',
          apellido: perfil.apellido || '',
          telefono: perfil.telefono || '',
          email: perfil.email || ''
        });
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
          alert(`Error cargando información: ${error.message}`);
        }
      } finally {
        if (!controller.signal.aborted) {
          setCargando(false);
        }
      }
    };

    cargarDatos();
    return () => controller.abort();
  }, [complejo, canchaNro]);

  const handleChange = (event) => {
    setTitular((titularActual) => ({
      ...titularActual,
      [event.target.name]: event.target.value
    }));
  };

  const handleConfirmar = async () => {
    const token = localStorage.getItem('gestor_token');
    if (!token) {
      alert('Sesión expirada. Por favor, inicia sesión nuevamente.');
      return;
    }

    const horaFin = calcularHoraFin(reserva.horaInicio, reserva.duracion);
    const turno = {
      clienteId: titular.id,
      tipoTurnoId: 1,
      complejoId: parseInt(complejo, 10),
      canchaNro: parseInt(canchaNro, 10),
      fecha,
      horaInicio,
      horaFin,
      estado: 'Reservado'
    };

    try {
      await crearReserva(turno, token);
      setMostrarModal(true);
    } catch (error) {
      console.error(error);
      alert(`Error creando la reserva: ${error.message}`);
    }
  };

  return {
    reserva,
    titular,
    cargando,
    mostrarModal,
    horaFin: calcularHoraFin(reserva.horaInicio, reserva.duracion),
    handleChange,
    handleConfirmar
  };
};