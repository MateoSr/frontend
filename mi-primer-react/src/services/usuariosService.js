const API_URL = 'http://localhost:3000/api';

export const obtenerUsuarioPorId = async (id) => {
  const response = await fetch(`http://localhost:3000/api/users/${id}`);
  if (!response.ok) {
    throw new Error(`Usuario con ID ${id} no encontrado`);
  }
  return await response.json();
};

export const crearUsuario = async (usuarioData, /*token*/) => {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(usuarioData),
  });

  if (!response.ok) {
    throw new Error('No se pudo crear el usuario.');
  }

  const data = await response.json();
  return data;
};

export const eliminarUsuario = async (id) => {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('No se pudo eliminar el usuario.');
  }

  return await response.json();
};

export const obtenerTodosLosUsuarios = async () => {
  const response = await fetch(`${API_URL}/users`);

  if (!response.ok) {
    throw new Error('No se pudieron obtener los usuarios.');
  }

  const data = await response.json();
  return Array.isArray(data) ? data : data.users ?? data.data ?? [];
};