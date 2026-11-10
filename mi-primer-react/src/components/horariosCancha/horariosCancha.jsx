import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import './horariosCancha.css';
import { obtenerDisponibilidad } from '../../services/complejosService';
import {
  ZONA_COMPLEJO,
  fechaEnZona,
  formatearFechaUTC,
  formatearHoraUTC,
  nombreZona,
  offsetDias,
  zonaNavegador
} from '../../utils/fechas';

function formatearFecha(fecha) {
  const [anio, mes, dia] = fecha.split('-');
  return `${dia}/${mes}/${anio}`;
}

function etiquetaDesfase(desfase) {
  if (desfase > 0) return ' +1';
  if (desfase < 0) return ' -1';
  return '';
}

function calcularPosicion(celda, altoModal) {
  const margen = 16;
  const anchoModal = 360;
  const espacioAbajo = window.innerHeight - celda.bottom - margen;
  const top = espacioAbajo >= altoModal
    ? celda.bottom + 8
    : Math.max(margen, celda.top - altoModal - 8);
  const left = Math.min(
    Math.max(margen, celda.left),
    window.innerWidth - anchoModal - margen
  );
  return { top, left };
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
  const [disponibilidad, setDisponibilidad] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [seleccion, setSeleccion] = useState(null);
  const [posicionModal, setPosicionModal] = useState(null);
  const modalRef = useRef(null);

  const fechaAUsar = fechaActual || fechaEnZona(new Date(), ZONA_COMPLEJO);
  const zona = zonaNavegador();

  useEffect(() => {
    const controller = new AbortController();

    const cargarDisponibilidad = async () => {
      setCargando(true);
      setError('');
      setDisponibilidad(null);

      try {
        const data = await obtenerDisponibilidad(complejo.id, fechaAUsar, controller.signal);
        if (!controller.signal.aborted) setDisponibilidad(data);
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message);
      } finally {
        if (!controller.signal.aborted) setCargando(false);
      }
    };

    cargarDisponibilidad();
    return () => controller.abort();
  }, [complejo.id, fechaAUsar]);

  const cerrarModal = () => {
    setSeleccion(null);
    setPosicionModal(null);
  };

  useEffect(() => {
    if (!seleccion) return undefined;

    const cerrarAlHacerClickAfuera = (evento) => {
      if (!modalRef.current?.contains(evento.target)) {
        cerrarModal();
      }
    };

    document.addEventListener('mousedown', cerrarAlHacerClickAfuera);
    return () => document.removeEventListener('mousedown', cerrarAlHacerClickAfuera);
  }, [seleccion]);

  if (cargando) return <p>Cargando horarios...</p>;
  if (error) return <p>{error}</p>;
  if (!disponibilidad) return null;

  if (!disponibilidad.abierto || disponibilidad.columnas.length === 0) {
    return <p>No hay un horario configurado para este complejo.</p>;
  }

  const canchasReales = complejo.canchas ?? [];

  const abrirConfirmacion = (cancha, columna, evento) => {
    const celda = evento.currentTarget.getBoundingClientRect();
    setPosicionModal(calcularPosicion(celda, 220));
    setSeleccion({
      tipo: 'confirmar',
      canchaNro: cancha.nro,
      duracion: cancha.duracion,
      inicio: columna.inicio,
      fin: columna.fin
    });
  };

  const mostrarDetalle = (cancha, turno, evento) => {
    const celda = evento.currentTarget.getBoundingClientRect();
    setPosicionModal(calcularPosicion(celda, 260));
    setSeleccion({ tipo: 'detalle', cancha, turno });
  };

  const agendarComoEncargado = (cancha, columna) => {
    const parametros = new URLSearchParams({
      complejoId: String(complejo.id),
      canchaNro: String(cancha.nro),
      inicio: columna.inicio,
      duracion: String(cancha.duracion),
      modo: 'encargado'
    });
    navigate(`/confirmar-reserva?${parametros.toString()}`);
  };

  const confirmarYPagar = () => {
    const parametros = new URLSearchParams({
      complejoId: String(complejo.id),
      canchaNro: String(seleccion.canchaNro),
      inicio: seleccion.inicio,
      duracion: String(seleccion.duracion)
    });
    navigate(`/confirmar-reserva?${parametros.toString()}`);
  };

  return (
    <>
      <div className="contenedor-horarios-cancha">
        {!esPanelEncargado && (
          <div className="info-fecha-grilla" style={{ marginBottom: '10px', fontWeight: 'bold', fontSize: '2.2vh' }}>
            Fecha: {formatearFecha(fechaAUsar)} 
          </div>
        )}
        <div style={{ marginBottom: '8px', fontSize: '1.8vh', opacity: 0.8 }}>
          Horarios mostrados en {nombreZona(zona)}
        </div>
        <div className="fila-cabecera">
          <div className="columna-info-vacia"></div>
          <div className="contenedor-columnas-horas">
            {disponibilidad.columnas.map((columna) => {
              const desfase = offsetDias(columna.inicio, fechaAUsar, zona);
              return (
                <div key={`cabecera-${columna.inicio}`} className="celda-cabecera-hora">
                  {formatearHoraUTC(columna.inicio, zona)}{etiquetaDesfase(desfase)}
                </div>
              );
            })}
          </div>
        </div>
        {disponibilidad.canchas.map((cancha) => (
          <div key={`${complejo.id}-${cancha.nro}`} className="fila-cancha">
            <div className="info-cancha">
              <h4>Cancha {cancha.nro}</h4>
              <p>{cancha.deporte}</p>
            </div>

            <div className="contenedor-celdas">
              {cancha.celdas.map((celda, indice) => {
                const columna = disponibilidad.columnas[indice];
                if (!columna) return null;

                const estaOcupado = !celda.disponible;
                const esBloquePasado = columna.pasado;
                const realCancha = canchasReales.find((item) => item.nro === cancha.nro);

                return (
                  <div
                    key={`celda-${cancha.nro}-${columna.inicio}`}
                    className={`celda-turno ${estaOcupado ? 'ocupada' : esBloquePasado ? 'pasado' : 'libre'}`}
                    title={obtenerTooltipCelda({ estaOcupado, esBloquePasado: esBloquePasado, esPanelEncargado })}
                    onClick={(evento) => {
                      if (estaOcupado) {
                        if (esPanelEncargado && celda.turnoId && realCancha) {
                          const turno = (realCancha.turnos ?? []).find((item) => item.id === celda.turnoId);
                          if (turno) mostrarDetalle(realCancha, turno, evento);
                        }
                        return;
                      }
                      if (esBloquePasado) return;
                      if (esPanelEncargado) {
                        agendarComoEncargado(cancha, columna);
                      } else {
                        abrirConfirmacion(cancha, columna, evento);
                      }
                    }}
                  ></div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {seleccion && createPortal(
        <aside
          ref={modalRef}
          className="modal-contenido"
          style={{ top: posicionModal.top, left: posicionModal.left }}
          aria-label="Confirmar reserva"
        >
          {seleccion.tipo === 'detalle' ? (
            <>
              <h3>Detalle de la reserva</h3>
              <p>Cancha: {seleccion.cancha.nro}</p>
              <p>
                Horario: {formatearHoraUTC(seleccion.turno.fechaInicio, zona)} a{' '}
                {formatearHoraUTC(seleccion.turno.fechaFin, zona)}
              </p>
              <p>Estado: {seleccion.turno.estado}</p>
              <p><strong>{seleccion.turno.cliente
                ? `${seleccion.turno.cliente.personaFisica
                    ? `${seleccion.turno.cliente.personaFisica.nombre} ${seleccion.turno.cliente.personaFisica.apellido}`
                    : seleccion.turno.cliente.personaJuridica?.razonSocial || 'Cliente sin nombre'}`
                : `${seleccion.turno.nombreSolicitante || ''} ${seleccion.turno.apellidoSolicitante || ''}`.trim() || 'Solicitante sin nombre'}</strong></p>
              <p>{seleccion.turno.cliente?.email}</p>
              <p>{seleccion.turno.cliente?.telefono}</p>
            </>
          ) : (
            <>
              <h3>Confirmar reserva</h3>
              <p>Fecha: {formatearFechaUTC(seleccion.inicio, zona)}</p>
              <p>
                Horario: {formatearHoraUTC(seleccion.inicio, zona)} a {formatearHoraUTC(seleccion.fin, zona)}
              </p>
              {offsetDias(seleccion.inicio, fechaAUsar, zona) > 0 && (
                <p>Corresponde al día siguiente en tu zona horaria.</p>
              )}
              <p>Cancha: {seleccion.canchaNro}</p>
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
