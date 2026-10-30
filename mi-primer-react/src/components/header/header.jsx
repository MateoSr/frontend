import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // Aprovechamos la librería que instalaste
import logo from '../../assets/logo.png';
import { obtenerRol } from '../../utils/auth';
import './header.css';

const INICIO_POR_ROL = {
  Encargado: '/menuEncargado',
  'Dueño': '/menuDueño',
  Administrador: '/menuAdmin',
};

const PANEL_POR_ROL = {
  Encargado: { to: '/menuEncargado', texto: 'Mi panel' },
  'Dueño': { to: '/menuDueño', texto: 'Mi panel' },
  Administrador: { to: '/menuAdmin', texto: 'Panel admin' },
};

function Header() {
  const [estaLog, setLog] = useState(() => {
    const token = localStorage.getItem("gestor_token");
    return !!token;
  });

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const rol = obtenerRol();
  const panel = rol ? PANEL_POR_ROL[rol] : null;

  const cerrarSesion = () => {
    localStorage.removeItem('gestor_token');
    setMenuOpen(false);
    window.location.href = '/login';
  };

  return (
    <div className='header-caja'>
      <Link to={INICIO_POR_ROL[rol] ?? '/'}>
        <img className="logo-header" src={logo} alt="Logo" />
      </Link>

      {/* Botón Hamburguesa (solo visible en móviles) */}
      <button className="menu-toggle" onClick={toggleMenu} aria-label="Abrir menú">
        {menuOpen ? <X size={30} /> : <Menu size={30} />}
      </button>

      {/* Agregamos una clase dinámica 'abierto' basada en el estado */}
      <nav className={`nav-barra ${menuOpen ? 'abierto' : ''}`}>
        <ul className='nav-links'>
          {panel ? (
            <>
              <li onClick={() => setMenuOpen(false)}>
                <NavLink to={panel.to} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>{panel.texto}</NavLink>
              </li>
              <li>
                <button type="button" className="nav-link boton-cerrar-sesion" onClick={cerrarSesion}>Cerrar sesión</button>
              </li>
            </>
          ) : (
            <>
              <li className='nav-item-dropdown' onClick={() => setMenuOpen(false)}>
                <NavLink to='/complejos' className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Complejos</NavLink>
              </li>
              <li onClick={() => setMenuOpen(false)}>
                <NavLink to='/software' className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Software</NavLink>
              </li>
              {estaLog ? (
                <li onClick={() => setMenuOpen(false)}>
                  <NavLink to='/perfil' className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Mi perfil</NavLink>
                </li>
              ) : (
                <li onClick={() => setMenuOpen(false)}>
                  <NavLink
                    to='/login' className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Iniciar sesión</NavLink>
                </li>
              )}
            </>
          )}
        </ul>
      </nav>
    </div>
  );
}

export default Header;