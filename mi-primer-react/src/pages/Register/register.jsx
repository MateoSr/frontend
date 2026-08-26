import InputForum from '../../components/inputForum/inputForum';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import './register.css';

function Register() {
  const [usuario, setUsuario] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    telefono: '',
    dni: '',
    nombre: '',
    apellido: '',
    fechaNacimiento: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (usuario.confirmPassword !== usuario.password) {
      alert("Las contraseñas no coinciden");
      return;
    }

    const { confirmPassword, ...datosFormulario } = usuario;

    try {
      const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosFormulario),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
      } else {
        alert(data.message || "Error al crear usuario");
      }
    } catch (error) {
      console.log("Error en la conexion", error);
      alert("Error en la conexión con el servidor");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">

        {/* LADO IZQUIERDO: Formulario de Registro */}
        <div className="register-form-side">
          <div className="register-header">
            <div className="brand-logo">TL</div>
            <h2>Crear Cuenta</h2>
            <p className="register-subtitle">Sumate a Turno Libre y empezá a reservar</p>
          </div>

          <form className="register-form" onSubmit={handleSubmit}>

            {/* Fila 1: Nombre y Apellido */}
            <div className="form-row">
              <InputForum
                label="Nombre"
                type="text"
                id="nombre"
                value={usuario.nombre}
                onChange={(e) => setUsuario(prev => ({ ...prev, nombre: e.target.value }))}
                placeholder="Lionel"
                required={true}
                readOnly={false}
              />
              <InputForum
                label="Apellido"
                type="text"
                id="apellido"
                value={usuario.apellido}
                onChange={(e) => setUsuario(prev => ({ ...prev, apellido: e.target.value }))}
                placeholder="Messi"
                required={true}
                readOnly={false}
              />
            </div>

            {/* Email */}
            <InputForum
              label="Correo Electrónico"
              type="email"
              id="email"
              value={usuario.email}
              onChange={(e) => setUsuario(prev => ({ ...prev, email: e.target.value }))}
              placeholder="tuemail@ejemplo.com"
              required={true}
              readOnly={false}
            />

            {/* Fila 2: DNI y Teléfono */}
            <div className="form-row">
              <InputForum
                label="DNI"
                type="text"
                id="dni"
                value={usuario.dni}
                onChange={(e) => setUsuario(prev => ({ ...prev, dni: e.target.value }))}
                placeholder="12345678"
                required={true}
                readOnly={false}
              />
              <InputForum
                label="Teléfono"
                type="tel"
                id="telefono"
                value={usuario.telefono}
                onChange={(e) => setUsuario(prev => ({ ...prev, telefono: e.target.value }))}
                placeholder="123-456-7890"
                required={true}
                readOnly={false}
              />
            </div>

            {/* Fecha de Nacimiento */}
            <InputForum
              label="Fecha de Nacimiento"
              type="date"
              id="fechaNacimiento"
              value={usuario.fechaNacimiento}
              onChange={(e) => setUsuario(prev => ({ ...prev, fechaNacimiento: e.target.value }))}
              required={true}
              readOnly={false}
            />

            {/* Fila 3: Contraseña y Confirmar */}
            <div className="form-row">
              <InputForum
                label="Contraseña"
                type="password"
                id="password"
                name="password"
                autoComplete="new-password"
                value={usuario.password}
                onChange={(e) => setUsuario(prev => ({ ...prev, password: e.target.value }))}
                placeholder="••••••••"
                required={true}
                readOnly={false}
              />
              <InputForum
                label="Confirmar Contraseña"
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                autoComplete="new-password"
                value={usuario.confirmPassword}
                onChange={(e) => setUsuario(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="••••••••"
                required={true}
                readOnly={false}
              />
            </div>

            <button className="register-boton" type="submit">Registrarse</button>
          </form>

          <div className="register-footer">
            <p>¿Ya tenés una cuenta? <Link to="/login" className="redirect-login">Iniciar sesión</Link></p>
          </div>
        </div>

        {/* LADO DERECHO: Imagen Deportiva con Overlay */}
        <div className="register-image-side">
          <div className="image-overlay">
            <h3>¡Formá parte de la comunidad!</h3>
            <p>Organizá partidos, encontrá canchas disponibles y no te quedes fuera de la jugada.</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Register;
