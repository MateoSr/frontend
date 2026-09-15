export const obtenerUsuarioPorId = async (id) => {
  const response = await fetch(`http://localhost:3000/api/users/${id}`);
  if (!response.ok) {
    throw new Error(`Usuario con ID ${id} no encontrado`);
  }
  return await response.json();
};