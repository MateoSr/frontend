import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import './horariosCancha.css';
import { fechaArgentinaISO, minutosArgentina, ahoraArgentinaMinutos, fechaArgentinaHoyISO } from '../../utils/fechas';

function extraerMinutos(valor) {
  if (typeof valor !== 'string') return null;

  const hora = valor.match(/(?:T|^)(\d{1,2}):(\d{2})/);
  return hora ? Number(hora[1]) * 60 + Number(hora[2]) : null;
}

// Minutos desde medianoche en horario Argentina para un turno UTC.
function minutosTurnoAR(turno) {
  const inicio = minutosArgentina(turno.fechaInicio);
  return inicio;
}

function fechaTurnoAR(turno) {
  return fechaArgentinaISO(turno.fechaInicio);
}

// Determina si un turno (guardado en UTC) cae en el día y bloque indicados (hora Argentina).
function coincideTurno(turno, fechaAUsar, inicioBloque, finBloque) {
  const estado = turno.estado?.toLowerCase();
  if (estado === 'cancelado' || estado === 'cancelada') return false;

  const fechaActualStr = fechaAUsar.split('T')[0];
  if (fechaTurnoAR(turno) !== fechaActualStr) return false;

  const turnoInicio = minutosTurnoAR(turno);
  let turnoFin = minutosArgentina(turno.fechaFin);
  if (turnoInicio === null || turnoFin === null) return false;
  if (turnoFin <= turnoInicio) turnoFin += 24 * 60;

  return inicioBloque < turnoFin && finBloque > turnoInicio;
}

function formatearHora(minutos) {
  const hora = Math.floor(minutos / 60);
  const minutosRestantes = minutos % 60;
  return `${String(hora).padStart(2, '0')}:${String(minutosRestantes).padStart(2, '0')}`;
}

function obtenerDuracion(cancha) {
  const duracion = Number(cancha.tipoCancha?.duracion);
  return Number.isFinite(duracion) && duracion > 0 ? duracion : 60;
}

// Función auxiliar para obtener la fecha de hoy en formato YYYY-MM-DD (hora local)
function obtenerFechaHoy() {
  const hoy = new Date();
  const anio = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}

function formatearFecha(fecha) {
  const [anio, mes, dia] = fecha.split('-');
  return `${dia}/${mes}/${anio}`;
}

// Un bloque pasado no se puede agendar. Si tiene turno (pasado o vigente) y el
// panel es del encargado, se puede consultar quién se sacó el turno.
function obtenerTooltipCelda({ estaOcupado, esBloquePasado, esPanelEncargado }) {
  if (esBloquePasado) {
    if (esPanelEncargado && !estaOcupado) return 'Horario ya pasado';
    if (esPanelEncargado) return 'Ver turno';
    return 'Horario ya pasado';
  }
  if (esPanelEncargado && !estaOcupado) return 'Hacé clic para agendar un turno';
  return undefined;
}

export const HorariosCancha = ({ complejo, fechaActual, esPanelEncargado = false }) => {
  const navigate = useNavigate();
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const [posicionModal, setPosicionModal] = useState(null);
  const modalRef = useRef(null);

  // Si no se pasa 'fechaActual' o viene vacía, usamos la fecha de hoy por defecto
  const fechaAUsar = fechaActual ? fechaActual : obtenerFechaHoy();
  

  const cerrarModal = () => {
    setReservaSeleccionada(null);
    setPosicionModal(null);
  };

  useEffect(() => {
    if (!reservaSeleccionada) return undefined;

    const cerrarAlHacerClickAfuera = (evento) => {
      if (!modalRef.current?.contains(evento.target)) {
        cerrarModal();
      }
    };

    document.addEventListener('mousedown', cerrarAlHacerClickAfuera);
    return () => document.removeEventListener('mousedown', cerrarAlHacerClickAfuera);
  }, [reservaSeleccionada]);

  const fechaSeleccionada = new Date(`${fechaAUsar}T00:00:00Z`);
  const diaSeleccionado = fechaSeleccionada.getUTCDay() || 7;
  const horario = complejo.horarios?.find(item => item.nroDia === diaSeleccionado);
  const aperturaMinutos = extraerMinutos(horario?.horaApertura);
  const cierreHorario = extraerMinutos(horario?.horaCierre);
  
  const cierreMinutos = aperturaMinutos !== null
    && cierreHorario !== null
    && cierreHorario <= aperturaMinutos
    ? cierreHorario + 24 * 60
    : cierreHorario;

  const canchas = complejo.canchas ?? [];

  if (aperturaMinutos === null || cierreMinutos === null) {
    return <p>No hay un horario configurado para este complejo.</p>;
  }

  // Todas las filas deben compartir la misma escala para que cada celda quede
  // alineada con la hora que muestra la cabecera.
  const duracionGrilla = Math.min(...canchas.map(obtenerDuracion), 60);
  const totalBloques = Math.floor((cierreMinutos - aperturaMinutos) / duracionGrilla);

  const abrirModal = (cancha, horaString, evento) => {
    const celda = evento.currentTarget.getBoundingClientRect();
    const anchoModal = 360;
    const altoModal = 190;
    const margen = 16;
    const espacioAbajo = window.innerHeight - celda.bottom - margen;
    const top = espacioAbajo >= altoModal
      ? celda.bottom + 8
      : Math.max(margen, celda.top - altoModal - 8);
    const left = Math.min(
      Math.max(margen, celda.left),
      window.innerWidth - anchoModal - margen
    );

    setPosicionModal({ top, left });
    setReservaSeleccionada({
      fecha: fechaAUsar, // Usará la seleccionada o la de hoy por defecto
      canchaNro: cancha.nro,
      complejoId: complejo.id,
      horarioInicio: horaString
    });
  };

  const mostrarReserva = (cancha, turno, evento) => {
    const celda = evento.currentTarget.getBoundingClientRect();
    const margen = 16;
    const altoModal = 240;
    const anchoModal = 360;
    const espacioAbajo = window.innerHeight - celda.bottom - margen;
    const top = espacioAbajo >= altoModal
      ? celda.bottom + 8
      : Math.max(margen, celda.top - altoModal - 8);
    const left = Math.min(
      Math.max(margen, celda.left),
      window.innerWidth - anchoModal - margen
    );

    setPosicionModal({ top, left });
    setReservaSeleccionada({ cancha, turno });
  };

  const confirmarYPagar = () => {
    const parametros = new URLSearchParams(reservaSeleccionada);
    navigate(`/confirmar-reserva?${parametros.toString()}`);
  };

  const agendarComoEncargado = (cancha, horaString) => {
    const parametros = new URLSearchParams({
      complejoId: String(complejo.id),
      canchaNro: String(cancha.nro),
      fecha: fechaAUsar,
      horarioInicio: horaString,
      modo: 'encargado'
    });
    navigate(`/confirmar-reserva?${parametros.toString()}`);
  };

  return (
    <>
      <div className="contenedor-horarios-cancha">
        {!esPanelEncargado && (
          <div className="info-fecha-grilla" style={{ marginBottom: '10px', fontWeight: 'bold',fontSize: '2.2vh' }}>
            Fecha: {formatearFecha(fechaAUsar)}
          </div>
        )}
        <div className="fila-cabecera">
          <div className="columna-info-vacia"></div>
          <div className="contenedor-columnas-horas">
            {Array.from({ length: totalBloques }, (_, indice) => {
              const inicio = aperturaMinutos + indice * duracionGrilla;
              return (
                <div key={`cabecera-${inicio}`} className="celda-cabecera-hora">
                  {formatearHora(inicio)}
                </div>
              );
            })}
          </div>
        </div>
        {canchas.map((cancha) => (
          <div key={`${complejo.id}-${cancha.nro}`} className="fila-cancha">
            <div className="info-cancha">
              <h4>Cancha {cancha.nro}</h4>
              <p>{cancha.tipoCancha?.deporte ?? 'Deporte no especificado'}</p>
            </div>

            <div className="contenedor-celdas">
              {Array.from({ length: totalBloques }, (_, indice) => {
                const inicioBloque = aperturaMinutos + indice * duracionGrilla;
                const finBloque = Math.min(inicioBloque + duracionGrilla, cierreMinutos);
                const hora = formatearHora(inicioBloque);
                
                const estaOcupado = (cancha.turnos ?? []).some(turno => {
                  return coincideTurno(turno, fechaAUsar, inicioBloque, finBloque);
                });
                const turnoActivo = (cancha.turnos ?? []).find(turno => {
                  return coincideTurno(turno, fechaAUsar, inicioBloque, finBloque);
                });

                const fechaHoyAR = fechaArgentinaHoyISO();
                const minutosAhoraAR = ahoraArgentinaMinutos();
                const esBloquePasado = fechaAUsar < fechaHoyAR || (fechaAUsar === fechaHoyAR && inicioBloque < minutosAhoraAR);

                return (
                  <div 
                    key={`celda-${cancha.nro}-${inicioBloque}`} 
                    className={`celda-turno ${estaOcupado ? 'ocupada' : esBloquePasado ? 'pasado' : 'libre'}`}
                    title={obtenerTooltipCelda({ estaOcupado, esBloquePasado, esPanelEncargado })}
                    onClick={evento => {
                      if (estaOcupado) {
                        // Si ya hay un turno (pasado o vigente) y el panel es del encargado, se consulta el turno.
                        if (esPanelEncargado && turnoActivo) {
                          mostrarReserva(cancha, turnoActivo, evento);
                        }
                        return;
                      }
                      if (esBloquePasado) return;
                      if (esPanelEncargado) {
                        agendarComoEncargado(cancha, hora);
                      } else {
                        abrirModal(cancha, hora, evento);
                      }
                    }}
                  >
                  </div>
                );
              })}
            </div>
          </div>
        ))}

      </div>

      {reservaSeleccionada && createPortal(
        <aside
          ref={modalRef}
          className="modal-contenido"
          style={{ top: posicionModal.top, left: posicionModal.left }}
          aria-label="Confirmar reserva"
        >
          {reservaSeleccionada.turno ? (
            <>
              <h3>Detalle de la reserva</h3>
              <p>Cancha: {reservaSeleccionada.cancha.nro}</p>
              <p>Horario: {formatearHora(minutosTurnoAR(reservaSeleccionada.turno))} a {formatearHora(minutosArgentina(reservaSeleccionada.turno.fechaFin))}</p>
              <p>Estado: {reservaSeleccionada.turno.estado}</p>
              <p><strong>{reservaSeleccionada.turno.cliente
                ? `${reservaSeleccionada.turno.cliente.personaFisica
                    ? `${reservaSeleccionada.turno.cliente.personaFisica.nombre} ${reservaSeleccionada.turno.cliente.personaFisica.apellido}`
                    : reservaSeleccionada.turno.cliente.personaJuridica?.razonSocial || 'Cliente sin nombre'}`
                : `${reservaSeleccionada.turno.nombreSolicitante || ''} ${reservaSeleccionada.turno.apellidoSolicitante || ''}`.trim() || 'Solicitante sin nombre'}</strong></p>
              <p>{reservaSeleccionada.turno.cliente?.email}</p>
              <p>{reservaSeleccionada.turno.cliente?.telefono}</p>
            </>
          ) : (
            <>
              <h3>Confirmar reserva</h3>
              <p>Fecha: {reservaSeleccionada.fecha}</p>
              <p>Horario: {reservaSeleccionada.horarioInicio} hs</p>
              <p>Cancha: {reservaSeleccionada.canchaNro}</p>
              <div className="modal-botones">
                <button className="btn-pagar" onClick={confirmarYPagar}>Ir a pagar</button>
              </div>
            </>
          )}
        </aside>,
        document.body
      )}
    </>
  );
};

export default HorariosCancha;