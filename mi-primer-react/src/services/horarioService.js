import { API_URL } from '../config/api.js';
const HORARIO_API_URL = `${API_URL}/complejos`; // Ajustá con la URL base de tu backend

export const crearHorario = async (idComplejo, datosHorario) => {
  const token = localStorage.getItem('gestor_token');
  const response = await fetch(`${HORARIO_API_URL}/${idComplejo}/horarios`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(datosHorario),
  });
  if (!response.ok) throw new Error("Error al guardar el horario.");
  return await response.json();
};

export const modificarHorario = async (idComplejo, nroDia, datosHorario) => {
  const token = localStorage.getItem('gestor_token');
  const response = await fetch(`${HORARIO_API_URL}/${idComplejo}/horarios/${nroDia}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(datosHorario),
  });
  if (!response.ok) throw new Error("Error al modificar el horario.");
  return await response.json();
};

export const borrarHorario = async (idComplejo, nroDia) => {
  const token = localStorage.getItem('gestor_token');
  const response = await fetch(`${HORARIO_API_URL}/${idComplejo}/horarios/${nroDia}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Error al eliminar el horario.");
  return await response.json();
};