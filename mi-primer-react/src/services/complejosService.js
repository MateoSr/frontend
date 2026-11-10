import { api } from './apiClient.js';

export const obtenerComplejos = async (queryString, signal) => {
  try {
    const payload = await api.get(`/complejos/busqueda?${queryString}`, {
      signal,
      skipAuth: true,
    });

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
  } catch (error) {
    if (error.status === 404) {
      return { data: [], total: 0, page: 1, limit: 12, totalPages: 0 };
    }
    throw error;
  }
};

export const crearComplejo = (complejoData) =>
  api.post('/complejos', complejoData);

export const crearOpinion = (complejoId, descripcion) =>
  api.post(`/complejos/${complejoId}/opiniones`, { descripcion }, { skipAuth: true });

export const obtenerDetalleComplejo = async (id, signal) => {
  try {
    return await api.get(`/complejos/${id}`, { signal, skipAuth: true });
  } catch (error) {
    if (error.status === 404) {
      throw new Error('No se encontro el complejo.', { cause: error });
    }
    throw error;
  }
};

export const obtenerDisponibilidad = (complejoId, fecha, signal) => {
  const parametros = new URLSearchParams({ fecha });
  return api.get(
    `/complejos/${complejoId}/disponibilidad?${parametros.toString()}`,
    { signal, skipAuth: true }
  );
};

export const obtenerComplejoDelEncargado = (signal) =>
  api.get('/complejos/encargado', { signal });

export const obtenerTodosLosComplejos = async () => {
  const data = await api.get('/complejos');
  return Array.isArray(data) ? data : data.data ?? [];
};

export const darDeBajaComplejo = (id) => api.patch(`/complejos/${id}/baja`);

export const modificarComplejo = (id, datosActualizados) =>
  api.put(`/complejos/${id}`, datosActualizados);

export const busquedaComplejoDueno = async () => {
  const data = await api.get('/complejos/dueno');
  if (!Array.isArray(data)) {
    throw new Error('Respuesta inesperada del servidor.');
  }
  return data;
};
