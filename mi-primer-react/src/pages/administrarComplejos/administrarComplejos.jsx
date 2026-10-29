import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerTodosLosComplejos, darDeBajaComplejo } from '../../services/complejosService.js';
import { useModal } from '../../context/modal/ModalContext';
import './administrarComplejos.css';

function AdministrarComplejos() {
  const [complejos, setComplejos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();
  const { mostrarModal, confirmar } = useModal();

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const data = await obtenerTodosLosComplejos();
        setComplejos(data);
      } catch (error) {
        console.error('Error fetching complejos:', error);
        mostrarModal({
          titulo: 'Error',
          mensaje: error.message || 'Error al cargar complejos',
          tipo: 'error'
        });
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [mostrarModal]);

  const handleDarDeBaja = async (id) => {
    const confirmado = await confirmar({
      titulo: 'Dar de baja complejo',
      mensaje: '¿Estás seguro de dar de baja este complejo? Dejará de aparecer en la búsqueda.',
      tipo: 'peligro',
      textoConfirmar: 'Dar de baja'
    });
    if (!confirmado) return;

    try {
      const data = await darDeBajaComplejo(id);
      setComplejos((prev) =>
        prev.map((complejo) =>
          complejo.id === id
            ? { ...complejo, estado: data.complejo?.estado ?? 'Inactivo' }
            : complejo
        )
      );
    } catch (error) {
      console.error('Error giving complejo de baja:', error);
      mostrarModal({
        titulo: 'Error',
        mensaje: 'No se pudo dar de baja el complejo.',
        tipo: 'error'
      });
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
            + Nuevo complejo
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
                  <th>Nro.</th>
                  <th>Nombre</th>
                  <th>Dirección</th>
                  <th className="text-center">Estado</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {complejosFiltrados.map((complejo) => (
                  <tr key={complejo.id}>
                    <td className="col-id">#{complejo.id}</td>
                    <td className="col-nombre">{complejo.nombre}</td>
                    <td className="col-direccion">{complejo.direccion}</td>
                    <td className="col-estado">
                      <span
                        className={`badge-estado ${
                          complejo.estado === 'Inactivo' ? 'badge-inactivo' : 'badge-activo'
                        }`}
                      >
                        {complejo.estado ?? 'Activo'}
                      </span>
                    </td>
                    <td className="col-acciones">
                      <div className="acciones-contenedor">
                        <button
                          className="btn-tabla-accion btn-tabla-eliminar"
                          onClick={() => handleDarDeBaja(complejo.id)}
                          disabled={complejo.estado === 'Inactivo'}
                        >
                          Dar de baja
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