import InputForum from '../../components/inputForum/inputForum';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import './login.css';

function Login() {
  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const datosFormulario = { email, password };

    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosFormulario),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        localStorage.setItem("gestor_token", data.token.token);
        window.location.href = '/';
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Error en la conexión con el servidor");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        {/* LADO IZQUIERDO: Formulario */}
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

        {/* LADO DERECHO: Imagen Deportiva con Overlay */}
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