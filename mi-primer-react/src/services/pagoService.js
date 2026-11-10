import { api } from './apiClient.js';

export const crearOrdenPago = (datos) => api.post('/pagos/crear-orden', datos);

export const consultarEstadoOrden = (externalReference) =>
  api.get(`/pagos/estado/${externalReference}`);
