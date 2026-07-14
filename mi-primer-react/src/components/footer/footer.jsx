import './footer.css'
import logo from '../../assets/logo-footer.png'
function Footer(){
    return(
        <footer className='footer-caja'>
            <div className='logo-caja'>
                <img  className='logo' src={logo}></img>
            </div>
            <div className='datos-contact'>
                <p ><strong className='titulo-footer'>Datos contacto</strong></p>
                <ul className='contactos-list'>
                    <li>
                        <a href="mailto:turnolibre@gmail.com">turnolibre@gmail.com</a>
                    </li>
                    <li><p>+54 9 3412 12-3456</p></li>
                    <div className='redes'>
                        <a href='https://www.instagram.com/' target='blank'><svg viewBox="0 0 24 24" width="24" height="24"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/></svg></a>
                        <a href='https://www.facebook.com/' target='blank'><svg viewBox="0 0 24 24" width="24" height="24"><path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2m13 2h-2.5A3.5 3.5 0 0 0 12 8.5V11h-2v3h2v7h3v-7h3v-3h-3V9a1 1 0 0 1 1-1h2V5z"/></svg></a>
                        <a href='https://www.x.com/' target='blank'><svg height="24" width="24" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
                    </div>
                    
                </ul>
            </div>
            <div className='enlace'>
                <p ><strong className='titulo-footer'>Ayuda</strong></p>
                <ul className='contactos-list'>
                    <li><a href="/faq">Preguntas Frecuentes</a></li>
                    <li><a href="/sobre-nosotros">Sobre Nosotros</a></li>
                    <li><a href="/politicas">Politicas</a></li>
                </ul>
            </div>


        </footer>
    )
}

export default Footer
