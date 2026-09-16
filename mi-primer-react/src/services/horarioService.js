const API_URL = 'http://localhost:3000/api/complejos'; // Ajustá con la URL base de tu backend

export const crearHorario = async (idComplejo, datosHorario) => {
  const response = await fetch(`${API_URL}/${idComplejo}/horarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datosHorario),
  });
  if (!response.ok) throw new Error("Error al guardar el horario.");
  return await response.json();
};

export const modificarHorario = async (idComplejo, nroDia, datosHorario) => {
  const response = await fetch(`${API_URL}/${idComplejo}/horarios/${nroDia}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datosHorario),
  });
  if (!response.ok) throw new Error("Error al modificar el horario.");
  return await response.json();
};

export const borrarHorario = async (idComplejo, nroDia) => {
  const response = await fetch(`${API_URL}/${idComplejo}/horarios/${nroDia}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Error al eliminar el horario.");
  return await response.json();
};