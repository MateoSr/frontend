import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerTodosLosComplejos, eliminarComplejo } from '../../services/complejosService.js';
import './administrarComplejos.css';

function AdministrarComplejos() {
  const [complejos, setComplejos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const data = await obtenerTodosLosComplejos();
        setComplejos(data);
      } catch (error) {
        console.error('Error fetching complejos:', error);
        alert(error.message);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este complejo?')) return;

    try {
      await eliminarComplejo(id);
      setComplejos((prev) => prev.filter((complejo) => complejo.id !== id));
    } catch (error) {
      console.error('Error deleting complejo:', error);
      alert('No se pudo eliminar el complejo.');
    }
  };

  // Filtrado dinámico por nombre
  const complejosFiltrados = complejos.filter((complejo) =>
    complejo.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <main className="admin-complejos-page">
      <div className="admin-complejos-card">
        {/* Cabecera del panel */}
        <div className="admin-complejos-header">
          <div className="admin-complejos-titulo-box">
            <h2>Complejos</h2>
            <span className="admin-complejos-badge">
              {complejosFiltrados.length} {complejosFiltrados.length === 1 ? 'complejo' : 'complejos'}
            </span>
          </div>

          <button
            className="btn-nuevo-complejo"
            onClick={() => navigate('/crear-complejo')}
          >
            + Nuevo Complejo
          </button>
        </div>

        {/* Barra de Búsqueda */}
        <div className="admin-complejos-toolbar">
          <input
            type="text"
            className="input-busqueda-complejo"
            placeholder="Buscar complejo por nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {/* Contenido de la Tabla */}
        <div className="admin-complejos-tabla-container">
          {cargando ? (
            <div className="admin-estado-tabla">Cargando complejos...</div>
          ) : complejosFiltrados.length === 0 ? (
            <div className="admin-estado-tabla">
              {busqueda ? 'No se encontraron complejos con ese nombre.' : 'No hay complejos registrados.'}
            </div>
          ) : (
            <table className="admin-complejos-tabla">
              <thead>
                <tr>
                  <th>NRO.</th>
                  <th>NOMBRE</th>
                  <th>DIRECCIÓN</th>
                  <th className="text-center">ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {complejosFiltrados.map((complejo) => (
                  <tr key={complejo.id}>
                    <td className="col-id">#{complejo.id}</td>
                    <td className="col-nombre">{complejo.nombre}</td>
                    <td className="col-direccion">{complejo.direccion}</td>
                    <td className="col-acciones">
                      <div className="acciones-contenedor">
                        <button
                          className="btn-tabla-accion btn-tabla-editar"
                          onClick={() => navigate(`/editar-complejo/${complejo.id}`)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn-tabla-accion btn-tabla-eliminar"
                          onClick={() => handleEliminar(complejo.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}

export default AdministrarComplejos;