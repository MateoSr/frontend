import { useState,useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import logo from '../../assets/logo.png'
import './header.css'


function Header(){
    const [estaLog,setLog] = useState(false)

    useEffect(() => {
    const token = localStorage.getItem("gestor_token");
    setLog(!!token);
    }, []);

    return (
    <div className='header-caja'>
      <Link to='/'>
        <img className="logo-header" src={logo} alt="Logo" />
      </Link>
      <nav className='nav-barra'>
        <ul className='nav-links'>
          <li className='nav-item-dropdown'>
            <NavLink to='/complejos' className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Complejos</NavLink>
          </li>
          <li>
            <NavLink to='/software' className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Software</NavLink>
          </li>
          {estaLog ? (
            <li>
              <NavLink to='/perfil' className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Mi Perfil</NavLink>
            </li>
          ) : (
            <li>
              <NavLink 
                to='/login'className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Iniciar Sesión</NavLink>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}

export default Header
