import { useState, useEffect } from 'react';
import './home.css'
import fondo_1 from '../../assets/fondo-1.jpg';
import fondo_2 from '../../assets/fondo-2.jpg';
import fondo_3 from '../../assets/fondo-3.jpg';
import BarraBusqueda from '../../components/barraBusqueda/barra'
import CarruselDeporte from '../../components/carruselDeportes/carruselDeporte'
import fondo_boton_complejo from '../../assets/background-boton-complejo.jpg'
import fondo_boton_software from '../../assets/background-boton-software.jpg'

const imagenes = [
    { img: fondo_1 },
    { img: fondo_2 },
    { img: fondo_3 }
];

function Home(){
    const [imagenActual, setimagenActual] = useState(0);

    useEffect(() => {const cronometro = setTimeout(() => {
    imagenActual === imagenes.length - 1 ? setimagenActual(0) : setimagenActual(imagenActual + 1);
    }, 8000);
    return() => clearTimeout(cronometro);
}, [imagenActual]);

    return(
        <main>
            <div className='contenedor-imagenes'>
                <img src={imagenes[0].img} alt="" className={`imagenes-fondo ${imagenActual === 0 ? 'active' : ''}`}/>
                <img src={imagenes[1].img} alt="" className={`imagenes-fondo ${imagenActual === 1 ? 'active' : ''}`}/>
                <img src={imagenes[2].img} alt="" className={`imagenes-fondo ${imagenActual === 2 ? 'active' : ''}`}/>
                <div className='contenedor-barra'>
                    <h1 className='hero-titulo'>Busca tu cancha ya!</h1>
                    <BarraBusqueda></BarraBusqueda>
                </div>
            </div>
            <div className='contenedor-home'> 
                <div className='contenedor-home-texto'>
                    <h2>Te gustaría alquilar una cancha para tu próximo partido?</h2><h2>Es muy sencillo y rápido!</h2>
                    <p>Reunir a tus amigos y organizar el partido de la semana nunca había sido tan fácil. Explora nuestra exclusiva selección de complejos, compara canchas y elegí la que más te guste. En solo unos clics podes revisar la disponibilidad de horarios en tiempo real, reservar tu lugar de forma segura y garantizar que todo esté listo para divertirse. No dejes que se queden sin lugar esta semana, asegura tu cancha ahora mismo y prepárate para jugar!</p>
                </div>
                <div className='contenedor-home-boton'>
                    <img className='contenedor-home-imagen' src={fondo_boton_complejo} alt="Complejos"></img>
                    <button className='boton-home' onClick={() => window.location.href = '/complejos'}><strong>Ver Todos Los Complejos</strong></button>
                </div>
            </div>
            <CarruselDeporte></CarruselDeporte>
            <div className='contenedor-home contenedor-home-invertido'> 
                <div className='contenedor-home-boton'>
                    <img className='contenedor-home-imagen' src={fondo_boton_software} alt="Software"></img>
                    <button className='boton-home' onClick={() => window.location.href = '/software'}><strong>Contactate Con Nosotros</strong></button>
                </div>
                <div className='contenedor-home-texto'>
                    <h2>Tenés un complejo deportivo?</h2><h2>Digitalizá tu gestión y hacé crecer tu negocio!</h2>
                    <p>Llevar el control de las reservas en papel o por mensajes de WhatsApp puede ser caótico y hacerte perder clientes. Con nuestra plataforma de gestión, vas a poder automatizar las reservas de tus canchas, administrar los horarios sin riesgo de superposiciones y ofrecerle a los jugadores la comodidad de agendar su turno las 24 horas del día. Centralizá toda tu administración en un solo lugar, reducí el ausentismo y enfocate en lo que realmente importa: hacer crecer tu complejo.</p>
                </div>
            </div>
        </main>
    )
}
export default Home