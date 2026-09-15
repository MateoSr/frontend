import React from 'react';
import './tarjetaComplejo.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
export const TarjetaComplejo = ({ complejo }) => {
  const { nombre, direccion, precio, imagenUrl, disponibilidad } = complejo;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const manejarClic = () => {
    const fecha = searchParams.get('fecha');
    const parametros = fecha ? `?fecha=${encodeURIComponent(fecha)}` : '';
    navigate(`/detalle-complejo/${complejo.id}${parametros}`);
  };
  return (
    <div className="tarjeta-complejo" onClick={manejarClic} style={{ cursor: 'pointer' }}>
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