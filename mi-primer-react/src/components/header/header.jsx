import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // Aprovechamos la librería que instalaste
import logo from '../../assets/logo.png';
import './header.css';

function Header() {
  const [estaLog, setLog] = useState(() => {
    const token = localStorage.getItem("gestor_token");
    return !!token;
  });

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <div className='header-caja'>
      <Link to='/'>
        <img className="logo-header" src={logo} alt="Logo" />
      </Link>

      {/* Botón Hamburguesa (solo visible en móviles) */}
      <button className="menu-toggle" onClick={toggleMenu} aria-label="Abrir menú">
        {menuOpen ? <X size={30} /> : <Menu size={30} />}
      </button>

      {/* Agregamos una clase dinámica 'abierto' basada en el estado */}
      <nav className={`nav-barra ${menuOpen ? 'abierto' : ''}`}>
        <ul className='nav-links'>
          <li className='nav-item-dropdown' onClick={() => setMenuOpen(false)}>
            <NavLink to='/complejos' className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Complejos</NavLink>
          </li>
          <li onClick={() => setMenuOpen(false)}>
            <NavLink to='/software' className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Software</NavLink>
          </li>
          {estaLog ? (
            <li onClick={() => setMenuOpen(false)}>
              <NavLink to='/perfil' className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Mi Perfil</NavLink>
            </li>
          ) : (
            <li onClick={() => setMenuOpen(false)}>
              <NavLink
                to='/login' className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Iniciar Sesión</NavLink>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}

export default Header;