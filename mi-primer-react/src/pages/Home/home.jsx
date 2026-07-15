import { useState } from 'react';
import './home.css'
import fondo_1 from '../../assets/fondo-1.jpg';
import fondo_2 from '../../assets/fondo-2.jpg';
import fondo_3 from '../../assets/fondo-3.jpg';
import BarraBusqueda from '../../components/barraBusqueda/barra'

const imagenes = [
    { img: fondo_1 },
    { img: fondo_2 },
    { img: fondo_3 }
];

function Home(){
    const [imagenActual, setimagenActual] = useState(0);

    setTimeout(() => {
    imagenActual === imagenes.length - 1 ? setimagenActual(0) : setimagenActual(imagenActual + 1);
    }, 8000);

    return(
        <main>
            <div className='contenedor-imagenes'>
                <img src={imagenes[0].img} className={`imagenes-fondo ${imagenActual === 0 ? 'active' : ''}`}/>
                <img src={imagenes[1].img} className={`imagenes-fondo ${imagenActual === 1 ? 'active' : ''}`}/>
                <img src={imagenes[2].img} className={`imagenes-fondo ${imagenActual === 2 ? 'active' : ''}`}/>
                <div></div>
                <div className='contenedor-barra'>
                    <h1 style={{color:"#ffff",textShadow:"2px 2px 4px rgba(0, 0, 0, 0.5)",fontSize:"50px"}}>Busca tu cancha ya!</h1>
                    <BarraBusqueda></BarraBusqueda>
                </div>
            </div>
            <div className='div'>
                <h2>Bienvenidos a Turno Libre</h2>
                <p>Turno Libre es una plataforma que permite a los usuarios reservar turnos en diferentes complejos deportivos y acceder a software de gestión para optimizar la administración de sus instalaciones. Con Turno Libre, los usuarios pueden encontrar fácilmente disponibilidad de turnos, realizar reservas en línea y gestionar sus actividades deportivas de manera eficiente.</p>
            </div>
        </main>
    )
}
export default Home