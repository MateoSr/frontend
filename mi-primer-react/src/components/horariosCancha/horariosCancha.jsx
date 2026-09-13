import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import './horariosCancha.css';

function extraerMinutos(valor) {
  if (typeof valor !== 'string') return null;

  const hora = valor.match(/(?:T|^)(\d{1,2}):(\d{2})/);
  return hora ? Number(hora[1]) * 60 + Number(hora[2]) : null;
}

function formatearHora(minutos) {
  const hora = Math.floor(minutos / 60);
  const minutosRestantes = minutos % 60;
  return `${String(hora).padStart(2, '0')}:${String(minutosRestantes).padStart(2, '0')}`;
}

function obtenerDuracion(cancha) {
  const duracion = Number(cancha.tipoCancha?.duracionMinutos);
  return Number.isFinite(duracion) && duracion > 0 ? duracion : 60;
}

export const HorariosCancha = ({ complejo, fechaActual }) => {
  const navigate = useNavigate();
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const [posicionModal, setPosicionModal] = useState(null);
  const modalRef = useRef(null);

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

  const horario = complejo.horarios?.[0];
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
      fecha: fechaActual,
      canchaNro: cancha.nro,
      complejoId: complejo.id,
      horarioInicio: horaString
    });
  };

  const confirmarYPagar = () => {
    const parametros = new URLSearchParams(reservaSeleccionada);
    navigate(`/confirmar-reserva?${parametros.toString()}`);
  };

  return (
    <>
      <div className="contenedor-horarios-cancha">
      <div className="fila-cabecera">
        <div className="columna-info-vacia"></div>
        <div className="contenedor-columnas-horas">
          {canchas[0] && Array.from(
            {
              length: Math.ceil(
                (cierreMinutos - aperturaMinutos)
                / obtenerDuracion(canchas[0])
              ),
            },
            (_, indice) => {
              const inicio = aperturaMinutos + indice * obtenerDuracion(canchas[0]);
              return (
                <div key={inicio} className="celda-cabecera-hora">
                  {formatearHora(inicio)}
                </div>
              );
            }
          )}
        </div>
      </div>

      {canchas.map((cancha) => (
        <div key={`${complejo.id}-${cancha.nro}`} className="fila-cancha">
          <div className="info-cancha">
            <h4>Cancha {cancha.nro}</h4>
            <p>{cancha.tipoCancha?.deporte ?? 'Deporte no especificado'}</p>
          </div>

          <div className="contenedor-celdas">
            {Array.from(
              {
                length: Math.ceil(
                  (cierreMinutos - aperturaMinutos)
                  / obtenerDuracion(cancha)
                ),
              },
              (_, indice) => {
              const duracionMinutos = obtenerDuracion(cancha);
              const inicioBloque = aperturaMinutos + indice * duracionMinutos;
              const finBloque = Math.min(inicioBloque + duracionMinutos, cierreMinutos);
              const hora = formatearHora(inicioBloque);
              
              const estaOcupado = (cancha.turnos ?? []).some(turno => {
                const estado = turno.estado?.toLowerCase();
                const turnoInicio = extraerMinutos(turno.horaInicio);
                const turnoFin = extraerMinutos(turno.horaFin);

                return estado !== 'cancelado'
                  && turnoInicio !== null
                  && turnoFin !== null
                  && inicioBloque < turnoFin
                  && finBloque > turnoInicio;
              });

              return (
                <div 
                  key={hora} 
                  className={`celda-turno ${estaOcupado ? 'ocupada' : 'libre'}`}
                  onClick={evento => !estaOcupado && abrirModal(cancha, hora, evento)}
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
          <h3>Confirmar reserva</h3>
          <p>Fecha: {reservaSeleccionada.fecha}</p>
          <p>Horario: {reservaSeleccionada.horarioInicio} hs</p>
          <p>Cancha: {reservaSeleccionada.canchaNro}</p>
          <div className="modal-botones">
            <button className="btn-pagar" onClick={confirmarYPagar}>Ir a pagar</button>
          </div>
        </aside>,
        document.body
      )}
    </>
  );
};

export default HorariosCancha;