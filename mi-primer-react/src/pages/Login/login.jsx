import { api } from '../../services/apiClient.js';
import InputForum from '../../components/inputForum/inputForum.jsx';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useModal } from '../../context/modal/ModalContext.jsx';
import { decodificarPayload } from '../../utils/auth.js';
import { guardarTokens, guardarUltimaActividad } from '../../utils/tokenStorage.js';
import './login.css';

function Login() {
  const { mostrarModal } = useModal();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    const datosFormulario = { email, password };

    try {
      const data = await api.post('/login', datosFormulario, { skipAuth: true });
      const token = data.token.token;
      guardarTokens(data.token);
      guardarUltimaActividad();
      const payload = decodificarPayload(token);
      const destinoPorRol = {
        Encargado: '/menuEncargado',
        'Dueño': '/menuDueño',
        Administrador: '/menuAdmin',
      };
      const destino = (payload && destinoPorRol[payload.rol]) ?? '/';
      window.location.href = destino;
    } catch (error) {
      mostrarModal({
        titulo: 'Error de inicio de sesión',
        mensaje: error.message,
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