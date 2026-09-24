const API_URL = 'http://localhost:3000/api';

export const obtenerDatosMenuDueno = async (token) => {
    const response = await fetch(`${API_URL}/menues/dueno`,{
          method: "GET",
           headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` 
        }})
    if(!response) throw new Error("Error al cargar los datos")
  return await response.json();
}