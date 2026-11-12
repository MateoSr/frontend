import { api } from './apiClient.js';

const COMPLEJOS_API_URL = '/complejos';

export const crearCancha = (idComplejo, datosCancha) =>
  api.post(`${COMPLEJOS_API_URL}/${idComplejo}/canchas`, datosCancha);

export const modificarCancha = (idComplejo, nroCancha, datosCancha) =>
  api.put(`${COMPLEJOS_API_URL}/${idComplejo}/canchas/${nroCancha}`, datosCancha);

export const crearPrecioCancha = (idComplejo, nroCancha, datosPrecio) =>
  api.post(`${COMPLEJOS_API_URL}/${idComplejo}/canchas/${nroCancha}/precios`, datosPrecio);
