const API_URL = 'http://localhost:3000/api';

export const crearPersonaJuridica = async (personaJuridicaData) => {
  const response = await fetch(`${API_URL}/personaJuridica`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(personaJuridicaData),
  });

  if (!response.ok) {
    throw new Error('No se pudo crear la Persona Jurídica.');
  }

  return await response.json();
};