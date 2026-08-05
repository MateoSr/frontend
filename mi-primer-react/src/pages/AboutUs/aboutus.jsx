import './aboutus.css';
import foto_nosotros from '../../assets/foto-nosotros.jpg';

function Aboutus() {
  return (
    <main>
      <h1 className='titulo-aboutus'>Sobre Nosotros</h1>
      <div className='contenedor-aboutus'>
        <div className='contenedor-aboutus-izquierda'>
          <img className='contenedor-aboutus-imagen' src={foto_nosotros}></img>
        </div>
        <div className='contenedor-aboutus-derecha'>
          <p style={{ fontSize: '3vh', letterSpacing: '0.1vh', lineHeight: '1.8' }}>Somos tres estudiantes de Ingeniería en Sistemas de Información unidos por la pasión de resolver problemas reales a través de la tecnología. Turno Libre nació al experimentar en carne propia lo frustrante que resulta organizar un partido: entre llamadas interminables, agendas desactualizadas y canchas ocupadas, las ganas de jugar terminaban perdiéndose en el camino. Ante este desafío, decidimos combinar nuestro aprendizaje universitario y el diseño de software para construir la solución ideal. Desarrollamos una plataforma moderna e intuitiva que actúa como el lazo perfecto entre los complejos deportivos y los deportistas, eliminando intermediarios para que reservar un turno sea tan ágil, rápido y divertido como el partido mismo.</p>
        </div>
      </div>
    </main>
  )
}

export default Aboutus