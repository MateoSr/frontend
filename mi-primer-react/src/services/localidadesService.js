import { api } from './apiClient.js';

export const obtenerLocalidades = async () => {
  const data = await api.get('/localidad', { skipAuth: true });
  return Array.isArray(data) ? data : data.data ?? [];
};
