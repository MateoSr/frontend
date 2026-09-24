import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerTodosLosUsuarios, eliminarUsuario } from '../../services/usuariosService.js';
import './administrarUsuarios.css';

function AdministrarUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const data = await obtenerTodosLosUsuarios();
        setUsuarios(data);
      } catch (error) {
        console.error('Error fetching usuarios:', error);
        alert(error.message || 'Error al cargar usuarios');
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;

    try {
      await eliminarUsuario(id);
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    } catch (error) {
      console.error('Error deleting usuario:', error);
      alert('No se pudo eliminar el usuario.');
    }
  };

  const obtenerNombreRol = (tipoUsuarioId) => {
    switch (tipoUsuarioId) {
      case 1: return 'Admin';
      case 2: return 'Encargado';
      case 3: return 'Cliente';
      case 4: return 'Dueño';
      default: return 'Usuario';
    }
  };

  const usuariosFiltrados = usuarios.filter((u) =>
    u.email.toLowerCase().includes(busqueda.toLowerCase()) ||
    (u.telefono && u.telefono.includes(busqueda))
  );

  return (
    <main className="admin-usuarios-page">
      <div className="admin-usuarios-card">
        <div className="admin-usuarios-header">
          <div className="admin-usuarios-titulo-box">
            <h2>Usuarios</h2>
            <span className="admin-usuarios-badge">
              {usuariosFiltrados.length} {usuariosFiltrados.length === 1 ? 'usuario' : 'usuarios'}
            </span>
          </div>

          <button
            className="btn-nuevo-usuario"
            onClick={() => navigate('/crear-usuario')}
          >
            + Nuevo Usuario
          </button>
        </div>

        <div className="admin-usuarios-toolbar">
          <input
            type="text"
            className="input-busqueda-usuario"
            placeholder="Buscar por email o teléfono..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="admin-usuarios-tabla-container">
          {cargando ? (
            <div className="admin-estado-tabla">Cargando usuarios...</div>
          ) : usuariosFiltrados.length === 0 ? (
            <div className="admin-estado-tabla">
              {busqueda ? 'No se encontraron usuarios con ese criterio.' : 'No hay usuarios registrados.'}
            </div>
          ) : (
            <table className="admin-usuarios-tabla">
              <thead>
                <tr>
                  <th>NRO.</th>
                  <th>EMAIL</th>
                  <th>TELÉFONO</th>
                  <th>ROL</th>
                  <th className="text-center"></th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.map((u) => (
                  <tr key={u.id}>
                    <td className="col-id">#{u.id}</td>
                    <td className="col-email">{u.email}</td>
                    <td className="col-telefono">{u.telefono || '-'}</td>
                    <td>
                      <span className={`badge-rol badge-rol-${u.tipoUsuarioId}`}>
                        {obtenerNombreRol(u.tipoUsuarioId)}
                      </span>
                    </td>
                    <td className="col-acciones">
                      <div className="acciones-contenedor">
                        <button
                          className="btn-tabla-accion btn-tabla-eliminar"
                          onClick={() => handleEliminar(u.id)}
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

export default AdministrarUsuarios;