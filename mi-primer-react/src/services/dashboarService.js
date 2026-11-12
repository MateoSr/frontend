import { api } from './apiClient.js';

export const obtenerDatosMenuDueno = () => api.get('/menues/dueno');
