import { Link } from 'react-router-dom';
import './footer.css';
import logo from '../../assets/logo-footer.png';
import IconInstagram from '../../assets/icons/instagram.svg?react';
import IconFacebook from '../../assets/icons/facebook.svg?react';
import IconX from '../../assets/icons/x.svg?react';

function Footer() {
    return (
        <footer className='footer-caja'>
            <div className='logo-caja'>
                <img className='logo' src={logo} alt="Logo Footer" />
            </div>

            <div className='datos-contact'>
                <p><strong className='titulo-footer'>Datos de contacto</strong></p>
                <ul className='contactos-list'>
                    <li>
                        <a href="mailto:soporteturnolibre@gmail.com">soporteturnolibre@gmail.com</a>
                    </li>
                    <li>
                        <p>+54 9 3412 12-3456</p>
                    </li>
                </ul>
                <div className='redes'>
                    <a href='https://www.instagram.com/' target='_blank' rel='noreferrer' aria-label="Instagram">
                        <IconInstagram width={24} height={24} />
                    </a>
                    <a href='https://www.facebook.com/' target='_blank' rel='noreferrer' aria-label="Facebook">
                        <IconFacebook width={24} height={24} />
                    </a>
                    <a href='https://www.x.com/' target='_blank' rel='noreferrer' aria-label="X (Twitter)">
                        <IconX width={24} height={24} />
                    </a>
                </div>
            </div>

            <div className='enlace'>
                <p><strong className='titulo-footer'>Ayuda</strong></p>
                <ul className='contactos-list'>
                    <li><Link to="/faq">Preguntas frecuentes</Link></li>
                    <li><Link to="/sobre-nosotros">Sobre Nosotros</Link></li>
                </ul>
            </div>
        </footer>
    );
}

export default Footer;