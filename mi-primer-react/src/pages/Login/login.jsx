import InputForum from '../../components/inputForum/inputForum';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './login.css';

function Login({ endpoint = '/api/login', redirectTo = '/' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    const datosFormulario = { email, password };

    try {
      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosFormulario),
      });

      const data = await response.json();
      if (response.ok) {
        const token = data.token.token;
        localStorage.setItem("gestor_token", token);
        const payload = JSON.parse(atob(token.split('.')[1]));
        const destino = payload.rol === 'Encargado' ? '/menuEncargado' : redirectTo;
        window.location.href = destino;
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert("Error de conexión con el servidor");
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
              label="Correo Electrónico"
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
              Iniciar Sesión
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