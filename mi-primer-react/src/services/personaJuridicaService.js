import { API_URL } from '../config/api.js';


export const crearPersonaJuridica = async (personaJuridicaData) => {
  const token = localStorage.getItem('gestor_token');
  const response = await fetch(`${API_URL}/personaJuridica`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(personaJuridicaData),
  });

  if (!response.ok) {
    throw new Error('No se pudo crear la Persona Jurídica.');
  }

  return await response.json();
};