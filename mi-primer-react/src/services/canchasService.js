const API_URL = 'http://localhost:3000/api/complejos'; // Ajustá con tu URL base

export const crearCancha = async (idComplejo, datosCancha) => {
  const response = await fetch(`${API_URL}/${idComplejo}/canchas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datosCancha),
  });
  if (!response.ok) throw new Error("Error al crear la cancha.");
  return await response.json();
};

export const modificarCancha = async (idComplejo, nroCancha, datosCancha) => {
  const response = await fetch(`${API_URL}/${idComplejo}/canchas/${nroCancha}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datosCancha),
  });
  if (!response.ok) throw new Error("Error al modificar la cancha.");
  return await response.json();
};

export const borrarCancha = async (idComplejo, nroCancha) => {
  const response = await fetch(`${API_URL}/${idComplejo}/canchas/${nroCancha}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Error al eliminar la cancha.");
  return await response.json();
};

export const crearPrecioCancha = async (idComplejo, nroCancha, datosPrecio) => {
  const response = await fetch(`${API_URL}/${idComplejo}/canchas/${nroCancha}/precios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datosPrecio),
  });
  if (!response.ok) throw new Error("Error al guardar los precios.");
  return await response.json();
};