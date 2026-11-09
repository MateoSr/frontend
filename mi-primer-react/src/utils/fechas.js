export const ZONA_COMPLEJO = 'America/Argentina/Buenos_Aires';

const zonaValida = (zona) => zona || ZONA_COMPLEJO;

export function zonaNavegador() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || ZONA_COMPLEJO;
}

const aFecha = (instante) => {
  if (!instante) return null;
  const fecha = instante instanceof Date ? instante : new Date(instante);
  return Number.isNaN(fecha.getTime()) ? null : fecha;
};

export function formatearHoraUTC(instanteUTC, zona = zonaNavegador()) {
  const fecha = aFecha(instanteUTC);
  if (!fecha) return '';
  return new Intl.DateTimeFormat('es-AR', {
    timeZone: zonaValida(zona),
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(fecha);
}

export function formatearFechaUTC(instanteUTC, zona = zonaNavegador()) {
  const fecha = aFecha(instanteUTC);
  if (!fecha) return '';
  return new Intl.DateTimeFormat('es-AR', {
    timeZone: zonaValida(zona),
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(fecha);
}

export function fechaEnZona(instante, zona = ZONA_COMPLEJO) {
  const fecha = aFecha(instante);
  if (!fecha) return '';
  const partes = new Intl.DateTimeFormat('en-CA', {
    timeZone: zonaValida(zona),
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(fecha);
  const valor = (tipo) => partes.find((parte) => parte.type === tipo)?.value;
  return `${valor('year')}-${valor('month')}-${valor('day')}`;
}

export function offsetDias(instanteUTC, fechaBase, zona = zonaNavegador()) {
  if (!instanteUTC || !fechaBase) return 0;
  const diaInstante = fechaEnZona(instanteUTC, zona);
  if (!diaInstante) return 0;
  const msInstante = Date.parse(`${diaInstante}T00:00:00Z`);
  const msBase = Date.parse(`${fechaBase}T00:00:00Z`);
  if (Number.isNaN(msInstante) || Number.isNaN(msBase)) return 0;
  return Math.round((msInstante - msBase) / (24 * 60 * 60 * 1000));
}

export function nombreZona(zona = zonaNavegador()) {
  try {
    const partes = new Intl.DateTimeFormat('es-AR', {
      timeZone: zonaValida(zona),
      timeZoneName: 'long'
    }).formatToParts(new Date());
    return partes.find((parte) => parte.type === 'timeZoneName')?.value || zona;
  } catch {
    return zona;
  }
}

export function fechaArgentinaHoyISO() {
  return fechaEnZona(new Date(), ZONA_COMPLEJO);
}

export function fechaHoraAUTC(fecha, hora) {
  if (!fecha || !hora) return null;
  return new Date(`${fecha}T${hora}:00-03:00`);
}
