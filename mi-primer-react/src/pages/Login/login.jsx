import { API_URL } from '../../config/api.js';
import InputForum from '../../components/inputForum/inputForum.jsx';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useModal } from '../../context/modal/ModalContext.jsx';
import { decodificarPayload } from '../../utils/auth.js';
import './login.css';

function Login({ endpoint = '/api/login', redirectTo = '/' }) {
  const { mostrarModal } = useModal();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    const datosFormulario = { email, password };

    try {
      const response = await fetch(`${API_URL.replace(/\/api$/,"")}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosFormulario),
      });

      const data = await response.json();
      if (response.ok) {
        const token = data.token.token;
        localStorage.setItem("gestor_token", token);
        const payload = decodificarPayload(token);
        const destinoPorRol = {
          Encargado: '/menuEncargado',
          'Dueño': '/menuDueño',
          Administrador: '/menuAdmin',
        };
        const destino = (payload && destinoPorRol[payload.rol]) ?? redirectTo;
        window.location.href = destino;
      } else {
        mostrarModal({
          titulo: 'Error de inicio de sesión',
          mensaje: data.error,
          tipo: 'error'
        });
      }
    } catch (error) {
      mostrarModal({
        titulo: 'Error',
        mensaje: "Error de conexión con el servidor",
        tipo: 'error'
      });
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-form-side">
          <div className="login-header">
            <div className="brand-logo">TL</div>
            <h2>Turno Libre</h2>
            <p className="login-subtitle">Ingresá tus datos para acceder a tus reservas</p>
          </div>
          <form onSubmit={handleSubmit} className="login-form">
            <InputForum
              label="Correo electrónico"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tuemail@ejemplo.com"
              required={true}
              readOnly={false}
            />
            <div className="password-group">
              <InputForum
                label="Contraseña"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required={true}
                readOnly={false}
              />
              <div className="forgot-wrapper">
                <Link to="/forgot" className="redirect-forgot">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>
            <button className="login-boton" type="submit">
              Iniciar sesión
            </button>
          </form>
          <div className="login-footer">
            <p>¿No tenés una cuenta? <Link to="/register" className="redirect-register">Crear cuenta</Link></p>
          </div>
        </div>
        <div className="login-image-side">
          <div className="image-overlay">
            <h3>Reservá tu cancha en segundos</h3>
            <p>Conectá con tus amigos y jugá en los mejores complejos deportivos.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;