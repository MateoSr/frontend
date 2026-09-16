import { Link, useParams } from 'react-router-dom';
import './complejoDueño.css';
import { useEffect, useState } from 'react';
import { ListadoCanchas } from '../../components/listadoCanchas/listadoCanchas';
import { Edit3, Trash2, Plus, Check, X } from 'lucide-react';
import { obtenerDetalleComplejo } from "../../services/complejosService";
import { crearCancha, modificarCancha, crearPrecioCancha } from "../../services/canchasService";
import { crearHorario, modificarHorario, borrarHorario } from "../../services/horarioService";
import { ModalCanchaDueno } from '../../components/modalCanchaDueno/modalCanchaDueno';

const diasSemana = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miercoles",
  "Jueves",
  "Viernes",
  "Sabado",
];

function formatearHora(valor) {
  if (typeof valor !== "string") return "-";
  const coincidencia = valor.match(/(?:T|^)(\d{1,2}):(\d{2})/);
  return coincidencia ? `${coincidencia[1].padStart(2, "0")}:${coincidencia[2]}` : valor;
}

function ComplejoDueño() {
  const { id } = useParams();
  const [complejo, setComplejo] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [modalCanchaState, setModalCanchaState] = useState({ isOpen: false, tipo: null, cancha: null });

  // Estados para formulario de edición/creación de horarios
  const [modoEdicion, setModoEdicion] = useState(false);
  const [diaEditando, setDiaEditando] = useState(null);
  const [esEdicionHorario, setEsEdicionHorario] = useState(false);
  const [formHorario, setFormHorario] = useState({ horaApertura: '09:00', horaCierre: '23:00' });

  const recargarComplejo = async () => {
    try {
      const data = await obtenerDetalleComplejo(id);
      setComplejo(data);
    } catch (error) {
      alert("Error al actualizar la información: " + error.message);
    }
  };

  useEffect(() => {
  const controller = new AbortController();

  const cargarComplejo = async () => {
    setCargando(true);
    try {
      const data = await obtenerDetalleComplejo(id, controller.signal);
      setComplejo(data);
    } catch (error) {
      // Ignora la alerta si la petición fue abortada por React
      if (error.name === 'AbortError' || error.name === 'CanceledError') {
        return;
      }
      alert(error.message);
      setComplejo(null);
    } finally {
      if (!controller.signal.aborted) {
        setCargando(false);
      }
    }
  };

  cargarComplejo();

  return () => controller.abort();
}, [id]);

  if (cargando) return <p>Cargando complejo...</p>;
  if (!complejo) return null;

  // Handlers Canchas
  const handleAgregarCancha = () => { setModalCanchaState({ isOpen: true, tipo: 'CREAR', cancha: null }); };
  const handleEditar = (cancha) => { setModalCanchaState({ isOpen: true, tipo: 'EDITAR', cancha }); };
  const handleCerrarModal = () => { setModalCanchaState({ isOpen: false, tipo: null, cancha: null }); };
  const handleAgregarPrecio = (cancha) => { setModalCanchaState({ isOpen: true, tipo: 'PRECIO', cancha }); };

  const handleConfirmarModalCancha = async (tipoAccion, payload) => {
    try {
      if (tipoAccion === 'CREAR') {
        const datosParaApi = {nro: Number(payload.datos.nro),tipoCanchaId: Number(payload.datos.tipoCanchaId),estado: payload.datos.estado,};
        await crearCancha(id, datosParaApi);
      } else if (tipoAccion === 'EDITAR') {
        const datosParaApi = {tipoCanchaId: Number(payload.datos.tipoCanchaId),estado: payload.datos.estado};
        await modificarCancha(id, payload.cancha.nro, datosParaApi);
      } else if (tipoAccion === 'PRECIO') {
        const preciosParaApi = {fecha: payload.precios.fechaDesde,precioBase: Number(payload.precios.precioBase),precioAdicional: Number(payload.precios.precioAdicional || 0),precioSena: Number(payload.precios.precioSena),
      };
        await crearPrecioCancha(id, payload.cancha.nro, preciosParaApi);
      }
      await recargarComplejo();
      handleCerrarModal();
    } catch (error) {
      alert(error.message);
    }
  };

  // Handlers Horarios
  const handleIniciarAgregar = () => {
    const horariosExistentes = complejo.horarios || [];
    const diaLibre = diasSemana.findIndex((_, index) => !horariosExistentes.some(h => h.nroDia === index));
    
    setEsEdicionHorario(false);
    setModoEdicion(true);
    setDiaEditando(diaLibre !== -1 ? diaLibre : 0);
    setFormHorario({ horaApertura: '09:00', horaCierre: '23:00' });
  };

  const handleIniciarEditar = (horario) => {
    setEsEdicionHorario(true);
    setModoEdicion(true);
    setDiaEditando(horario.nroDia);
    setFormHorario({
      horaApertura: formatearHora(horario.horaApertura),
      horaCierre: formatearHora(horario.horaCierre)
    });
  };

  const handleGuardarHorario = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        complejoId:Number(id),
        nroDia: Number(diaEditando),
        horarioApertura: formHorario.horaApertura,
        horarioCierre: formHorario.horaCierre
      };

      if (esEdicionHorario) {
        await modificarHorario(id, diaEditando, payload);
      } else {
        await crearHorario(id, payload);
      }

      await recargarComplejo();
      setModoEdicion(false);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleBorrarHorario = async (nroDia) => {
    if (!window.confirm(`¿Estás seguro de eliminar el horario del día ${diasSemana[nroDia]}?`)) return;
    try {
      await borrarHorario(id, nroDia);
      await recargarComplejo();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className='complejoDueño-container'>
      <div className='complejoDueño-header'>
        <h1>{complejo.nombre}</h1>
        <h2> 📍 {complejo.direccion}, {complejo.localidad.nombre}</h2>
      </div>

      <div className='complejoDueño-body'>
        <div className='grilla-canchas'>
          <ListadoCanchas
            canchas={complejo.canchas}
            onEditar={handleEditar}
            onAgregarPrecio={handleAgregarPrecio}
            onAgregarCancha={handleAgregarCancha}
          />
        </div>

        {/* Sección Horarios Centrada */}
        <div className='contenedor-horarios-centrado'>
          <div className='complejoDueño-horarios'>
            <div className='horarios-header-acciones'>
              <div>
                <h2 className='complejoDueño-horarios-subtitulo'>Horarios del Club</h2>
              </div>
              {!modoEdicion && (
                <button type="button" className="btn-agregar-horario" onClick={handleIniciarAgregar}>
                  <Plus size={16} /> Agregar horario
                </button>
              )}
            </div>

            {/* Formulario Inline para Crear / Editar */}
            {modoEdicion && (
              <form className="form-horario-inline" onSubmit={handleGuardarHorario}>
                <div className="form-campo">
                  <label>Día</label>
                  <select 
                    value={diaEditando} 
                    onChange={(e) => setDiaEditando(e.target.value)}
                    disabled={esEdicionHorario}
                  >
                    {diasSemana.map((dia, idx) => (
                      <option key={idx} value={idx}>{dia}</option>
                    ))}
                  </select>
                </div>
                <div className="form-campo">
                  <label>Apertura</label>
                  <input 
                    type="time" 
                    value={formHorario.horaApertura} 
                    onChange={(e) => setFormHorario({ ...formHorario, horaApertura: e.target.value })} 
                    required 
                  />
                </div>
                <div className="form-campo">
                  <label>Cierre</label>
                  <input 
                    type="time" 
                    value={formHorario.horaCierre} 
                    onChange={(e) => setFormHorario({ ...formHorario, horaCierre: e.target.value })} 
                    required 
                  />
                </div>
                <div className="form-acciones">
                  <button type="submit" className="btn-guardar-horario" title="Guardar">
                    <Check size={16} />
                  </button>
                  <button type="button" className="btn-cancelar-horario" onClick={() => setModoEdicion(false)} title="Cancelar">
                    <X size={16} />
                  </button>
                </div>
              </form>
            )}

            {/* Lista de Horarios */}
            <div className="complejoDueño-listado">
              {complejo.horarios && complejo.horarios.length > 0 ? (
                complejo.horarios.map((horario) => (
                  <div className="horario-fila" key={`${horario.complejoId}-${horario.nroDia}`}>
                    <strong>{diasSemana[horario.nroDia]}</strong>
                    <div className="horario-info-acciones">
                      <span>{formatearHora(horario.horaApertura)} a {formatearHora(horario.horaCierre)}</span>
                      <button 
                        type="button" 
                        className="accion-horario accion-editar" 
                        onClick={() => handleIniciarEditar(horario)}
                        title="Editar"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button 
                        type="button" 
                        className="accion-horario accion-borrar" 
                        onClick={() => handleBorrarHorario(horario.nroDia)}
                        title="Borrar"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="horarios-vacio">No hay horarios cargados para este club.</p>
              )}
            </div>
          </div>
        </div>

        <div className='grilla-reportes-propios'></div>
      </div>

      <Link to={`/menuDueño`} className="link-volver"> &larr; Volver</Link>
      <ModalCanchaDueno
        isOpen={modalCanchaState.isOpen}
        tipo={modalCanchaState.tipo}
        cancha={modalCanchaState.cancha}
        onClose={handleCerrarModal}
        onConfirmar={handleConfirmarModalCancha}
      />
    </div>
  );
}

export default ComplejoDueño;