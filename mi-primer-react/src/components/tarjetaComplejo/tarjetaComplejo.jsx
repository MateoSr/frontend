import React from 'react';
import './tarjetaComplejo.css';
export const TarjetaComplejo = ({ complejo }) => {
  const { nombre, direccion, precio, imagenUrl, disponibilidad } = complejo;

  return (
    <div className="tarjeta-complejo">
      <div className="complejo-media">
        <img src={imagenUrl} alt={nombre} className="complejo-imagen" />
        <div className="precio-overlay">
          desde <strong>${precio.toLocaleString('es-AR')}</strong>
        </div>
      </div>
      <div className="complejo-info">
        <h3>{nombre}</h3>
        <p>📍 {direccion}</p>
      </div>
      <div className="complejo-turnos">
        {disponibilidad && disponibilidad.map((slot, i) => (
          <button 
            key={i} 
            className="turno-button"
          >
            {slot.time}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TarjetaComplejo;