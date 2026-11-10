import { api } from './apiClient.js';

export const obtenerUsuarioPorId = (id) => api.get(`/users/${id}`);

export const crearUsuario = (usuarioData) => api.post('/users', usuarioData);

export const eliminarUsuario = (id) => api.delete(`/users/${id}`);

export const obtenerTodosLosUsuarios = async () => {
  const data = await api.get('/users');
  return Array.isArray(data) ? data : data.users ?? data.data ?? [];
};
