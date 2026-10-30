import { API_URL } from '../config/api.js';
const COMPLEJOS_API_URL = `${API_URL}/complejos`;

export const crearCancha = async (idComplejo, datosCancha) => {
  const token = localStorage.getItem('gestor_token');
  const response = await fetch(`${COMPLEJOS_API_URL}/${idComplejo}/canchas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(datosCancha),
  });
  if (!response.ok) throw new Error("Error al crear la cancha.");
  return await response.json();
};

export const modificarCancha = async (idComplejo, nroCancha, datosCancha) => {
  const token = localStorage.getItem('gestor_token');
  const response = await fetch(`${COMPLEJOS_API_URL}/${idComplejo}/canchas/${nroCancha}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(datosCancha),
  });
  if (!response.ok) throw new Error("Error al modificar la cancha.");
  return await response.json();
};

export const borrarCancha = async (idComplejo, nroCancha) => {
  const token = localStorage.getItem('gestor_token');
  const response = await fetch(`${COMPLEJOS_API_URL}/${idComplejo}/canchas/${nroCancha}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Error al eliminar la cancha.");
  return await response.json();
};

export const crearPrecioCancha = async (idComplejo, nroCancha, datosPrecio) => {
  const token = localStorage.getItem('gestor_token');
  const response = await fetch(`${COMPLEJOS_API_URL}/${idComplejo}/canchas/${nroCancha}/precios`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(datosPrecio),
  });
  if (!response.ok) throw new Error("Error al guardar los precios.");
  return await response.json();
};