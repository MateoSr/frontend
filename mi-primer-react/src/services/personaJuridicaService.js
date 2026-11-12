import { api } from './apiClient.js';

export const crearPersonaJuridica = (personaJuridicaData) =>
  api.post('/personaJuridica', personaJuridicaData);
