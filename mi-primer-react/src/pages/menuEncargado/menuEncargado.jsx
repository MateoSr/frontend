import { useEffect, useState } from 'react';
import { HorariosCancha } from '../../components/horariosCancha/horariosCancha';
import { obtenerComplejoDelEncargado } from '../../services/complejosService';
import './menuEncargado.css';

function obtenerFechaHoy() {
  return new Date().toISOString().slice(0, 10);
}

function MenuEncargado() {
  const [complejo, setComplejo] = useState(null);
  const [fecha, setFecha] = useState(obtenerFechaHoy);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const cargarComplejo = async () => {
      try {
        const data = await obtenerComplejoDelEncargado(controller.signal);
        setComplejo(data);
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') setError(fetchError.message);
      } finally {
        if (!controller.signal.aborted) setCargando(false);
      }
    };

    cargarComplejo();
    return () => controller.abort();
  }, []);

  if (cargando) return <main className="menu-encargado-estado">Cargando tu complejo...</main>;
  if (error) return <main className="menu-encargado-estado">{error}</main>;
  if (!complejo) return null;

  return (
    <main className="menu-encargado">
      <header className="menu-encargado-cabecera">
        <div>
          <p className="menu-encargado-etiqueta">Panel del encargado</p>
          <h1>{complejo.nombre}</h1>
          <p>{complejo.direccion}, {complejo.localidad?.nombre}</p>
        </div>
        <label className="menu-encargado-fecha">
          Fecha
          <input type="date" value={fecha} onChange={(event) => setFecha(event.target.value)} />
        </label>
      </header>

      <section className="menu-encargado-resumen">
        <div><strong>{complejo.canchas?.length ?? 0}</strong><span>Canchas</span></div>
        <div><strong>{complejo.canchas?.reduce((total, cancha) => total + (cancha.turnos?.filter(turno => turno.fecha?.slice(0, 10) === fecha).length ?? 0), 0)}</strong><span>Reservas del día</span></div>
        <div><strong>{complejo.horarios?.filter(horario => horario.nroDia === (new Date(`${fecha}T00:00:00Z`).getUTCDay() || 7)).length ? 'Abierto' : 'Cerrado'}</strong><span>Estado del complejo</span></div>
      </section>

      <section className="menu-encargado-grilla">
        <div className="menu-encargado-grilla-cabecera">
          <div>
            <h2>Agenda de canchas</h2>
            <p>Seleccioná un turno ocupado para consultar los datos del cliente.</p>
          </div>
          <div className="leyenda"><span className="leyenda-libre" /> Disponible <span className="leyenda-ocupada" /> Reservada</div>
        </div>
        <HorariosCancha complejo={complejo} fechaActual={fecha} esPanelEncargado />
      </section>
    </main>
  );
}

export default MenuEncargado;
