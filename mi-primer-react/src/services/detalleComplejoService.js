const API_URL = 'http://localhost:3000/api';

export const obtenerDetalleComplejo = async (id, signal) => {
  const response = await fetch(`${API_URL}/complejos/${id}`, { signal });

  if (response.status === 404) {
    throw new Error('No se encontro el complejo.');
  }

  if (!response.ok) {
    throw new Error('No se pudo cargar el complejo.');
  }

  return response.json();
};