const API_URL = 'http://localhost:3000/api';

const obtenerJson = async (url, options = {}) => {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error('No se pudo completar la solicitud de la reserva.');
  }

  return response.json();
};

export const obtenerDatosReserva = async ({ complejoId, canchaNro, token, signal }) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };

  const [perfil, complejo, cancha] = await Promise.all([
    obtenerJson(`${API_URL}/users/perfil`, { headers, signal }),
    obtenerJson(`${API_URL}/complejos/${complejoId}`, { signal }),
    obtenerJson(`${API_URL}/complejos/${complejoId}/canchas/${canchaNro}`, { signal })
  ]);

  return { perfil, complejo, cancha };
};

export const crearReserva = async (turno, token) => obtenerJson(`${API_URL}/turnos`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  },
  body: JSON.stringify(turno)
});

export const obtenerClientes = async (token, signal) => obtenerJson(`${API_URL}/users/clientes`, {
  signal,
  headers: { Authorization: `Bearer ${token}` }
});

export const crearReservaEncargado = async (turno, cliente, token) => obtenerJson(`${API_URL}/turnos/encargado`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  },
  body: JSON.stringify({ turno, cliente })
});