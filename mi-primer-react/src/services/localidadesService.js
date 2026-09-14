const API_URL = 'http://localhost:3000/api';

export const obtenerLocalidades = async () => {
  const response = await fetch(`${API_URL}/localidad`);
  
  if (!response.ok) {
    throw new Error('Error al obtener las localidades');
  }

  const data = await response.json();
  return Array.isArray(data) ? data : data.data ?? [];
};