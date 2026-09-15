import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import './horariosCancha.css';

function extraerMinutos(valor, convertirHoraLocal = false) {
  if (typeof valor !== 'string') return null;

  if (convertirHoraLocal && valor.includes('T')) {
    const fecha = new Date(valor);
    if (!Number.isNaN(fecha.getTime())) {
      return fecha.getHours() * 60 + fecha.getMinutes();
    }
  }

  const hora = valor.match(/(?:T|^)(\d{1,2}):(\d{2})/);
  return hora ? Number(hora[1]) * 60 + Number(hora[2]) : null;
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

export const HorariosCancha = ({ complejo, fechaActual }) => {
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

  // Todas las filas deben compartir la misma escala para que cada celda quede
  // alineada con la hora que muestra la cabecera.
  const duracionGrilla = Math.min(...canchas.map(obtenerDuracion), 60);
  const totalBloques = Math.ceil((cierreMinutos - aperturaMinutos) / duracionGrilla);

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

  const confirmarYPagar = () => {
    const parametros = new URLSearchParams(reservaSeleccionada);
    navigate(`/confirmar-reserva?${parametros.toString()}`);
  };

  return (
    <>
      <div className="contenedor-horarios-cancha">
        
        {/* (Opcional visual) Puedes mostrar la fecha activa en la grilla si lo deseas */}
        <div className="info-fecha-grilla" style={{ marginBottom: '10px', fontWeight: 'bold' }}>
          Fecha: {fechaAUsar}
        </div>

        {/* CABECERA DE HORAS */}
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

        {/* FILAS DE CANCHAS */}
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
                  const estado = turno.estado?.toLowerCase();
                  
                  const fechaTurnoStr = turno.fecha ? turno.fecha.split('T')[0] : '';
                  const fechaActualStr = fechaAUsar.split('T')[0];
                  const esMismaFecha = fechaTurnoStr === fechaActualStr;

                  const turnoInicio = extraerMinutos(turno.horaInicio, true);
                  let turnoFin = extraerMinutos(turno.horaFin, true);

                  if (turnoInicio !== null && turnoFin !== null && turnoFin <= turnoInicio) {
                    turnoFin += 24 * 60;
                  }

                  return esMismaFecha 
                    && estado !== 'cancelado'
                    && turnoInicio !== null
                    && turnoFin !== null
                    && inicioBloque < turnoFin
                    && finBloque > turnoInicio;
                });

                return (
                  <div 
                    key={`celda-${cancha.nro}-${inicioBloque}`} 
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