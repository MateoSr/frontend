import { useState,useEffect } from 'react';
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
      <a href='/'>
        <img className="logo-header" src={logo} alt="Logo" />
      </a>
      <nav className='nav-barra'>
        <ul className='nav-links'>
          <li className='nav-item-dropdown'><a href='/complejos'>Complejos</a></li>
          <li><a href='/software'>Software</a></li>

          {estaLog ? (
            <li><a href='/perfil'>Perfil</a></li> // 3. Agregamos href='/perfil'
          ) : (
            <li><a href='/login'>Iniciar Sesión</a></li>
          )}
        </ul>
      </nav>
    </div>
  );
}

export default Header
