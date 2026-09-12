const API_URL = 'http://localhost:3000/api';

export const obtenerComplejos = async (queryString, signal) => {
  const response = await fetch(`${API_URL}/complejos/busqueda?${queryString}`, { signal });

  if (response.status === 404) {
    return [];
  }

  if (!response.ok) {
    throw new Error('No se pudieron cargar los complejos.');
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
};

