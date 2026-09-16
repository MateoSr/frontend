import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { crearUsuario } from '../../services/usuariosService';
import { crearPersonaJuridica } from '../../services/personaJuridicaService';

import './crearUsuario.css';

export const CrearUsuario = () => {
  const navigate = useNavigate();

  const [tipoUsuarioId, setTipoUsuarioId] = useState(4);

  const [formData, setFormData] = useState({
    email: '',
    telefono: '',
    password: '',
    cuit: '',
    razonSocial: ''
  });

  const [mostrarModal, setMostrarModal] = useState(false);
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePreSubmit = (e) => {
    e.preventDefault();
    setMostrarModal(true);
  };

  const handleConfirmarCreacion = async () => {
    setCargando(true);

    try {
      let cuitAsociado = null;

      if (tipoUsuarioId === 4) {
        cuitAsociado = formData.cuit;

        try {
          await crearPersonaJuridica({
            cuit: formData.cuit,
            razonSocial: formData.razonSocial,
          });
        } catch (errPersona) {
          console.log('Persona jurídica ya registrada previamente, asociando CUIT directamente.');
        }
      }

      const payloadUsuario = {
        email: formData.email,
        telefono: formData.telefono,
        password: formData.password,
        tipoUsuarioId: tipoUsuarioId,
        personaJuridicaCuit: cuitAsociado,
      };

      const resUser = await crearUsuario(payloadUsuario);

      setMostrarModal(false);
      alert(`¡${tipoUsuarioId === 4 ? 'Dueño' : 'Encargado'} creado con éxito! ID de usuario: ${resUser.user.id}`);
      navigate('/administrar-usuarios');

    } catch (err) {
      setMostrarModal(false);
      alert('Error al crear el usuario: ' + (err.message || 'Error de servidor'));
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
      <main className="crear-usuario-contenedor">
        <h2 className="crear-usuario-titulo">
          Crear Nuevo {tipoUsuarioId === 4 ? 'Dueño' : 'Encargado'}
        </h2>

        {/* Switch para cambiar entre IDs de tipoUsuario */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
          <button
            type="button"
            className="crear-usuario-boton"
            style={{
              marginTop: 0,
              backgroundColor: tipoUsuarioId === 4 ? '#ee5801' : '#888'
            }}
            onClick={() => setTipoUsuarioId(4)}
          >
            Dueño
          </button>
          <button
            type="button"
            className="crear-usuario-boton"
            style={{
              marginTop: 0,
              backgroundColor: tipoUsuarioId === 2 ? '#ee5801' : '#888'
            }}
            onClick={() => setTipoUsuarioId(2)}
          >
            Encargado
          </button>
        </div>

        <form className="crear-usuario-form" onSubmit={handlePreSubmit}>
          <div className="crear-usuario-campo">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="crear-usuario-campo">
            <label>Teléfono:</label>
            <input
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              required
            />
          </div>

          <div className="crear-usuario-campo">
            <label>Contraseña:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Formulario condicional si es Dueño (tipoUsuarioId === 4) */}
          {tipoUsuarioId === 4 && (
            <>
              <div className="crear-usuario-campo">
                <label>CUIT:</label>
                <input
                  type="text"
                  name="cuit"
                  value={formData.cuit}
                  onChange={handleChange}
                  placeholder="Ej: 30-12345678-9"
                  required
                />
              </div>

              <div className="crear-usuario-campo">
                <label>Razón Social:</label>
                <input
                  type="text"
                  name="razonSocial"
                  value={formData.razonSocial}
                  onChange={handleChange}
                  placeholder="Ej: Complejos Deportivos S.A."
                  required
                />
              </div>
            </>
          )}

          <button className="crear-usuario-boton" type="submit" disabled={cargando}>
            Crear {tipoUsuarioId === 4 ? 'Dueño' : 'Encargado'}
          </button>
        </form>
      </main>

      {/* Pop-up Modal de Confirmación */}
      {mostrarModal && createPortal(
        <div className="modal-overlay">
          <div className="modal-confirmacion-contenido">
            <h2>Verificar Datos</h2>

            <p><strong>Rol:</strong> {tipoUsuarioId === 4 ? 'Dueño (ID 4)' : 'Encargado (ID 2)'}</p>
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Teléfono:</strong> {formData.telefono}</p>

            {tipoUsuarioId === 4 && (
              <>
                <hr className="modal-divisor" />
                <p><strong>CUIT:</strong> {formData.cuit}</p>
                <p><strong>Razón Social:</strong> {formData.razonSocial}</p>
              </>
            )}

            <div className="modal-acciones-usuario">
              <button
                type="button"
                className="btn-modal-cancelar-usuario"
                onClick={() => setMostrarModal(false)}
                disabled={cargando}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn-modal-confirmar-usuario"
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

export default CrearUsuario;