import { useState } from 'react';
import './tarjetaTurno.css';

const imagen_fallo = "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=600";

const formatearFecha = (fechaISO) => {
  if (!fechaISO) return "";
  const fechaSolo = fechaISO.split('T')[0]; 
  const [year, month, day] = fechaSolo.split('-');
  return `${day}/${month}/${year}`;
};

const formatearHora = (horaISO) => {
  if (!horaISO) return "";
  const horaSolo = horaISO.split('T')[1]; 
  return horaSolo.substring(0, 5); 
};

export function TarjetaTurno({ turno, onCancelar }) {
  const { id, canchaNro, horaInicio, estado, imagenUrl, complejo, cancha, fecha } = turno;
  
  const [imgSrc, setImgSrc] = useState(imagenUrl || imagen_fallo);

  const handleErrorImage = () => {
    setImgSrc(imagen_fallo);
  };

  const getEstadoClass = (est) => {
    switch (est.toLowerCase()) {
      case 'reservado': return 'estado-reservado';
      case 'en curso': return 'estado-encurso';
      case 'completado': return 'estado-finalizado';
      case 'cancelado': return 'estado-cancelado';
      default: return '';
    }
  };

  // Maneja la confirmación y llamada a la función de cancelación
  const handleCancelarClick = () => {
    const confirmar = window.confirm("¿Estás seguro de que quieres cancelar este turno?");
    if (confirmar && onCancelar) {
      onCancelar(id); // Pasa el ID del turno a la función que maneja la lógica
    }
  };

  // Opcional: Solo permite cancelar si el turno está reservado
  const puedeCancelar = estado.toLowerCase() === 'reservado';

  return (
    <div className="tarjeta-complejo">
      <div className="tarjeta-img-contenedor">
        <img 
          src={imgSrc} 
          alt={complejo.nombre} 
          onError={handleErrorImage} 
          className="tarjeta-img"
        />

        {/* Botón de cruz roja arriba a la izquierda */}
        {puedeCancelar && (
          <button 
            type="button"
            className="btn-cancelar-turno" 
            onClick={handleCancelarClick}
            title="Cancelar turno"
          >
            ✕
          </button>
        )}

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