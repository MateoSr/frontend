import { api } from './apiClient.js';

export const obtenerDatosReserva = async ({ complejoId, canchaNro, signal }) => {
  const [perfil, complejo, cancha] = await Promise.all([
    api.get('/users/perfil', { signal }),
    api.get(`/complejos/${complejoId}`, { signal, skipAuth: true }),
    api.get(`/complejos/${complejoId}/canchas/${canchaNro}`, { signal, skipAuth: true }),
  ]);

  return { perfil, complejo, cancha };
};

export const crearReservaEncargado = (turno, cliente) =>
  api.post('/turnos/encargado', { turno, cliente });
