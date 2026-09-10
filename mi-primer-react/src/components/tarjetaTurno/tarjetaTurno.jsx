// components/tarjetaTurno/TarjetaTurno.jsx
import { useState } from 'react';
import './tarjetaTurno.css';

//imagen si falla la carga.
const imagen_fallo = "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=600";


export function TarjetaTurno({ turno }) {
  const { nro_cancha,horarioInicio, estado, imagenUrl, complejoNombre,deporte,fecha} = turno;
  
  // controla la carga de la imagen
  const [imgSrc, setImgSrc] = useState(imagenUrl || imagen_fallo);

  const handleErrorImage = () => {
    setImgSrc(imagen_fallo);
  };

  // clase dinamica segun el estado(cambia color)
  const getEstadoClass = (est) => {
    switch (est.toLowerCase()) {
      case 'reservado': return 'estado-reservado';
      case 'en curso': return 'estado-encurso';
      case 'completado': return 'estado-finalizado';
      case 'cancelado': return 'estado-cancelado';
      default: return '';
    }
  };

  return (
    <div className="tarjeta-complejo">
      <div className="tarjeta-img-contenedor">
        <img 
          src={imgSrc} 
          alt={complejoNombre} 
          onError={handleErrorImage} 
          className="tarjeta-img"
        />
        <span className={`badge-estado ${getEstadoClass(estado)}`}>
          {estado}
        </span>
      </div>

      <div className="tarjeta-body">
        <h3 className="complejo-nombre">{complejoNombre}</h3>
        <p className="cancha-info">Cancha N° {nro_cancha}</p>
        <p className="cancha-info"> Deporte {deporte}</p>
        
        <div className="tarjeta-fechas">
          <span className="fecha-item">📅 {fecha}</span>
          <span className="fecha-item">⏰ {horarioInicio}</span>
        </div>
      </div>
    </div>
  );
}

export default TarjetaTurno;