//components/tarjetaTurno/TarjetaTurno.jsx
import { useState } from 'react';
import './tarjetaTurno.css';

//imagen si falla la carga.
const imagen_fallo = "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=600";

//TRANSFORMA LA FECHA
const formatearFecha = (fechaISO) => {
  if (!fechaISO) return "";
  const fechaSolo = fechaISO.split('T')[0]; 
  const [year, month, day] = fechaSolo.split('-');
  return `${day}/${month}/${year}`;
};

// TRANSFORMA LA HORA
const formatearHora = (horaISO) => {
  if (!horaISO) return "";
  const horaSolo = horaISO.split('T')[1]; 
  return horaSolo.substring(0, 5); 
};

export function TarjetaTurno({ turno }) {
  const { canchaNro,horaInicio, estado, imagenUrl, complejo,cancha,fecha} = turno;
  
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
          alt={complejo.nombre} 
          onError={handleErrorImage} 
          className="tarjeta-img"
        />
        <span className={`badge-estado ${getEstadoClass(estado)}`}>
          {estado}
        </span>
      </div>

      <div className="tarjeta-body">
        <h3 className="complejo-nombre">{complejo.nombre}</h3>
        <p className="cancha-info">Cancha N° {canchaNro}</p>
        <p className="cancha-info"> Deporte {cancha.tipoCancha.deporte}</p>
        
        <div className="tarjeta-fechas">
          <span className="fecha-item">📅 {formatearFecha(fecha)}</span>
          <span className="fecha-item">⏰ {formatearHora(horaInicio)}</span>
        </div>
      </div>
    </div>
  );
}

export default TarjetaTurno;