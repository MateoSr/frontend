import { API_URL } from '../config/api.js';

export const obtenerComplejos = async (queryString, signal) => {
  const response = await fetch(`${API_URL}/complejos/busqueda?${queryString}`, { signal });

  if (response.status === 404) {
    return { data: [], total: 0, page: 1, limit: 12, totalPages: 0 };
  }

  if (!response.ok) {
    throw new Error('No se pudieron cargar los complejos.');
  }

  const payload = await response.json();

  if (Array.isArray(payload)) {
    return {
      data: payload,
      total: payload.length,
      page: 1,
      limit: payload.length || 12,
      totalPages: payload.length > 0 ? 1 : 0,
    };
  }

  const data = payload.data ?? [];
  return {
    data,
    total: payload.total ?? data.length,
    page: payload.page ?? 1,
    limit: payload.limit ?? 12,
    totalPages: payload.totalPages ?? (data.length > 0 ? 1 : 0),
  };
};

export const crearComplejo = async (complejoData, /*token*/) => {
  const token = localStorage.getItem('gestor_token');
  const response = await fetch(`${API_URL}/complejos`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(complejoData),
  });

  if (!response.ok) {
    throw new Error('No se pudo crear el complejo.');
  }

  const data = await response.json();
  return data;
};

export const crearOpinion = async (complejoId, descripcion) => {
  const response = await fetch(`${API_URL}/complejos/${complejoId}/opiniones`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ descripcion }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || 'No se pudo publicar la opinión.');
  }

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

export const obtenerDisponibilidad = async (complejoId, fecha, signal) => {
  const parametros = new URLSearchParams({ fecha });
  const response = await fetch(
    `${API_URL}/complejos/${complejoId}/disponibilidad?${parametros.toString()}`,
    { signal }
  );

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || data.error || 'No se pudo cargar la disponibilidad.');
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
  const token = localStorage.getItem('gestor_token');
  const response = await fetch(`${API_URL}/complejos`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error('No se pudieron cargar los complejos.');
  }

  const data = await response.json();
  return Array.isArray(data) ? data : data.data ?? [];
};

export const darDeBajaComplejo = async (id) => {
  const token = localStorage.getItem('gestor_token');
  const response = await fetch(`${API_URL}/complejos/${id}/baja`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error('No se pudo dar de baja el complejo.');
  }

  return await response.json();
};

export const modificarComplejo = async (id,datosActualizados) => {
  const token = localStorage.getItem('gestor_token');
  const response = await fetch(`${API_URL}/complejos/${id}`,{
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
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
