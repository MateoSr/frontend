import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearComplejo } from '../../services/complejosService';
import { obtenerLocalidades } from '../../services/localidadesService';
import { obtenerUsuarioPorId } from '../../services/usuariosService';
import { createPortal } from 'react-dom';
import './crearComplejo.css';

export const CrearComplejo = () => {
  const navigate = useNavigate();

  const [localidades, setLocalidades] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    localidadId: '',
    imagenUrl: '/assets/foto-complejo.jpg',
    duenoId: '',
    encargadoId: ''
  });

  const [mostrarModal, setMostrarModal] = useState(false);
  const [datosConfirmacion, setDatosConfirmacion] = useState(null);

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarLocalidades = async () => {
      try {
        const data = await obtenerLocalidades();
        setLocalidades(data.sort((a, b) =>
          a.nombre.localeCompare(b.nombre)));
        if (data.length > 0) {
          setFormData((prev) => ({ ...prev, localidadId: data[0].id }));
        }
      } catch (err) {
        console.error('Error cargando localidades:', err);
      }
    };
    cargarLocalidades();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError('');

    try {
      const dueno = await obtenerUsuarioPorId(formData.duenoId);
      const encargado = await obtenerUsuarioPorId(formData.encargadoId);

      const localidadSel = localidades.find(l => l.id === parseInt(formData.localidadId, 10));

      setDatosConfirmacion({
        ...formData,
        localidadNombre: localidadSel ? localidadSel.nombre : formData.localidadId,
        duenoEmail: dueno.email,
        duenoNombre: dueno.nombre || 'Sin nombre',
        encargadoEmail: encargado.email,
        encargadoNombre: encargado.nombre || 'Sin nombre'
      });

      setMostrarModal(true);
    } catch (err) {
      setError(err.message || 'Error al verificar las IDs de dueño o encargado');
    } finally {
      setCargando(false);
    }
  };

  const handleConfirmarCreacion = async () => {
    setCargando(true);
    setError('');

    try {
      const payload = {
        nombre: formData.nombre,
        direccion: formData.direccion,
        localidadId: parseInt(formData.localidadId, 10),
        imagenUrl: formData.imagenUrl,
        duenoId: parseInt(formData.duenoId, 10),
        encargadoId: parseInt(formData.encargadoId, 10)
      };

      await crearComplejo(payload);
      alert('¡Complejo registrado con éxito!');
      navigate('/admin/complejos');
    } catch (err) {
      setMostrarModal(false);
      alert(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
      <main className='crear-complejo-contenedor'>
        <h2 className='crear-complejo-titulo'>Crear Nuevo Complejo</h2>
        {error && <div className="mensaje-error">{error}</div>}
        <form className='crear-complejo-form' onSubmit={handleSubmit}>
          <div className='crear-complejo-campo'>
            <label>Nombre:</label>
            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
          </div>
          <div className='crear-complejo-campo'>
            <label>Dirección:</label>
            <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} required />
          </div>
          <div className='crear-complejo-campo'>
            <label>Localidad:</label>
            <select name="localidadId" value={formData.localidadId} onChange={handleChange} required >
              <option value="" disabled>Seleccione una localidad</option>
              {localidades.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.nombre}
                </option>
              ))}
            </select>
          </div>
          {/* <div className='crear-complejo-campo'>
            <label>Imagen (Ruta/URL):</label>
            <input type="text" name="imagenUrl" value={formData.imagenUrl} onChange={handleChange} placeholder="/assets/foto-complejo.jpg" />
          </div> */}
          <div className='crear-complejo-campo'>
            <label>ID dueño:</label>
            <input type="text" name="duenoId" value={formData.duenoId} onChange={handleChange} placeholder="ID del dueño" />
          </div>
          <div className='crear-complejo-campo'>
            <label>ID encargado:</label>
            <input type="text" name="encargadoId" value={formData.encargadoId} onChange={handleChange} placeholder="ID del encargado" />
          </div>
          <button className="crear-complejo-boton" type="submit" disabled={cargando}>
            {cargando ? 'Verificando...' : 'Crear Complejo'}
          </button>
        </form>
      </main>
      {mostrarModal && datosConfirmacion && createPortal(
        <div className="modal-overlay-complejo">
          <div className="modal-confirmacion-contenido-complejo">
            <h2>Verificar Datos del Complejo</h2>

            <p><strong>Nombre:</strong> {datosConfirmacion.nombre}</p>
            <p><strong>Dirección:</strong> {datosConfirmacion.direccion}</p>
            <p><strong>Localidad:</strong> {datosConfirmacion.localidadNombre}</p>
            {/* <p><strong>Imagen:</strong> {datosConfirmacion.imagenUrl}</p> */}

            <hr className="modal-divisor-complejo" />

            <p><strong>Dueño (ID: {datosConfirmacion.duenoId}):</strong></p>
            <p className="modal-subtexto-complejo">{datosConfirmacion.duenoEmail}</p>

            <p><strong>Encargado (ID: {datosConfirmacion.encargadoId}):</strong></p>
            <p className="modal-subtexto-complejo">{datosConfirmacion.encargadoEmail}</p>

            <div className="modal-acciones-complejo">
              <button
                type="button"
                className="btn-modal-cancelar-complejo"
                onClick={() => setMostrarModal(false)}
                disabled={cargando}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn-modal-confirmar-complejo"
                onClick={handleConfirmarCreacion}
                disabled={cargando}
              >
                {cargando ? 'Guardando...' : 'Confirmar y Crear'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
export default CrearComplejo;