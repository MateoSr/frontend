import { api } from './apiClient.js';

const HORARIO_API_URL = '/complejos';

export const crearHorario = (idComplejo, datosHorario) =>
  api.post(`${HORARIO_API_URL}/${idComplejo}/horarios`, datosHorario);

export const modificarHorario = (idComplejo, nroDia, datosHorario) =>
  api.put(`${HORARIO_API_URL}/${idComplejo}/horarios/${nroDia}`, datosHorario);

export const borrarHorario = (idComplejo, nroDia) =>
  api.delete(`${HORARIO_API_URL}/${idComplejo}/horarios/${nroDia}`);
