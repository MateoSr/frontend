import { useState } from 'react';
import logo from '../../assets/logo.png'
import './header.css'

function Header(){
    const [estaLog,setLog] = useState(false)

    return(
        <div className='header-caja'>
                <a href='/'>
                    <img className="logo-header" src={logo}></img>
                </a>
                <nav className='nav-barra'>
                    <ul className='nav-links'>
                        <li className='nav-item-dropdown'><a href='/complejos'>Complejos</a></li>
                        <li><a href='/software'>Software</a></li>

                        {estaLog ? 
                        (<li><a>Perfil</a></li>):
                        (<li><a href='/login'>Iniciar Sesion</a></li>)
                        }
                    </ul>
                </nav>
            
        </div>
    
    )
}

export default Header
