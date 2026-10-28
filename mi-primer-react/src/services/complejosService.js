import { API_URL } from '../config/api.js';

export const obtenerComplejos = async (queryString, signal) => {
  const response = await fetch(`${API_URL}/complejos/busqueda?${queryString}`, { signal });

  if (response.status === 404) {
    return [];
  }

  if (!response.ok) {
    throw new Error('No se pudieron cargar los complejos.');
  }

  const data = await response.json();
  return Array.isArray(data) ? data : data.data ?? [];
};

export const crearComplejo = async (complejoData, /*token*/) => {
  const response = await fetch(`${API_URL}/complejos`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(complejoData),
  });

  if (!response.ok) {
    throw new Error('No se pudo crear el complejo.');
  }

  const data = await response.json();
  return data;
};

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

export const obtenerComplejoDelEncargado = async (signal) => {
  const token = localStorage.getItem('gestor_token');
  const response = await fetch(`${API_URL}/complejos/encargado`, {
    signal,
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || 'No se pudo cargar el complejo asignado.');
  }
  return await response.json();
};
  
  export const obtenerTodosLosComplejos = async () => {
  const response = await fetch(`${API_URL}/complejos`);

  if (!response.ok) {
    throw new Error('No se pudieron cargar los complejos.');
  }

  const data = await response.json();
  return Array.isArray(data) ? data : data.data ?? [];
};

export const eliminarComplejo = async (id) => {
  const response = await fetch(`${API_URL}/complejos/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('No se pudo eliminar el complejo.');
  }

  return response.json();
};

export const modificarComplejo = async (id,datosActualizados) => {
  const response = await fetch(`${API_URL}/complejos/${id}`,{
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datosActualizados),
  });
  if (!response.ok) throw new Error("Error al modificar el complejo");
  return await response.json();
}

export const busquedaComplejoDueno = async (token) => {
  const response = await fetch(`${API_URL}/complejos/dueno`,{
          method: "GET",
           headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` 
        }})
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || "No se pudieron cargar los complejos del dueño.");
  }
  const data = await response.json();
  if (!Array.isArray(data)) throw new Error("Respuesta inesperada del servidor.");
  return data;
}
