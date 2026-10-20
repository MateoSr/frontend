const OFFSET_AR_MS = 3 * 60 * 60 * 1000;

export function fechaHoraAUTC(fecha, hora) {
  if (!fecha || !hora) return null;
  return new Date(`${fecha}T${hora}:00-03:00`);
}

export function combinarFechaHoraUTC(fechaISO, horaHHmm) {
  if (!fechaISO) return null;
  const fecha = String(fechaISO).split('T')[0];
  if (!horaHHmm) return new Date(`${fecha}T00:00:00-03:00`);
  return new Date(`${fecha}T${horaHHmm}:00-03:00`);
}

export function minutosArgentina(instanteUTC) {
  if (!instanteUTC) return null;
  const enAR = new Date(new Date(instanteUTC).getTime() - OFFSET_AR_MS);
  return enAR.getUTCHours() * 60 + enAR.getUTCMinutes();
}

export function fechaArgentinaISO(instanteUTC) {
  if (!instanteUTC) return '';
  const enAR = new Date(new Date(instanteUTC).getTime() - OFFSET_AR_MS);
  return enAR.toISOString().split('T')[0];
}

export function horaArgentinaHHmm(instanteUTC) {
  const minutos = minutosArgentina(instanteUTC);
  if (minutos === null) return '';
  return `${String(Math.floor(minutos / 60) % 24).padStart(2, '0')}:${String(
    minutos % 60
  ).padStart(2, '0')}`;
}

export function formatearFechaAR(instanteUTC) {
  const fecha = fechaArgentinaISO(instanteUTC);
  if (!fecha) return '';
  const [anio, mes, dia] = fecha.split('-');
  return `${dia}/${mes}/${anio}`;
}

export function ahoraArgentinaMinutos() {
  const ahora = new Date();
  const enAR = new Date(ahora.getTime() - OFFSET_AR_MS);
  return enAR.getUTCHours() * 60 + enAR.getUTCMinutes();
}

export function fechaArgentinaHoyISO() {
  const ahora = new Date();
  const enAR = new Date(ahora.getTime() - OFFSET_AR_MS);
  return enAR.toISOString().split('T')[0];
}
