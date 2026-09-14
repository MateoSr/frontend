import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearComplejo } from '../../services/complejosService';
import { obtenerLocalidades } from '../../services/localidadesService';
import './crearComplejo.css';

function CrearComplejo() {
  const navigate = useNavigate();

  const [localidades, setLocalidades] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    localidadId: '',
    imagenUrl: ''
  });

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
      const payload = {
        ...formData,
        localidadId: parseInt(formData.localidadId, 10)
      };

      await crearComplejo(payload);
      alert('¡Complejo creado exitosamente!');
      navigate('/admin/complejos');
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className='crear-complejo-contenedor'>
      <h2 className='crear-complejo-titulo'>Crear Nuevo Complejo</h2>
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
        <div className='crear-complejo-campo'>
          <label>Imagen (Ruta/URL):</label>
          <input type="text" name="imagenUrl" value={formData.imagenUrl} onChange={handleChange} placeholder="/assets/foto-complejo.jpg" />
        </div>
        <button className="crear-complejo-boton" type="submit" disabled={cargando} >
          {cargando ? 'Guardando...' : 'Crear Complejo'}
        </button>
      </form>
    </main>
  );
};
export default CrearComplejo;