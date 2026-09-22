import './tarjetaMenuDuenoComplejo.css';
import { Link } from 'react-router-dom';
export function TarjetaMenuDuenoComplejo({ 
  id,
  nombre, 
  direccion,
  ciudad,
  deportes, 
  canchasDisponibles, 
  
}) {
  return (
    <div className="tarjeta-complejo">
      {/* Imagen del complejo */}
      {/* <div className="complejo-imagen-wrapper">
        <img 
          src={imagenUrl || "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=600&q=80"} 
          alt={nombre} 
          className="complejo-img" 
        />
        <span className="badge-activo">Abierto</span>
      </div> */}

      {/* Información del complejo */}
      <div className="complejo-contenido">
        <div>
          <h3 className="complejo-nombre">{nombre}</h3>
          <p className="complejo-direccion">📍 {direccion} {ciudad}</p>
          <p className="complejo-detalles">
            🎾 {Array.isArray(deportes) ? deportes.join(', ') : deportes} &bull; <strong>{canchasDisponibles} canchas</strong>
          </p>
        </div>

        {/* Botón de acción */}
        <Link to={`/complejo/${id}`} className="btn-ver-detalle">
          Ver Complejo &rarr;
        </Link>
      </div>
    </div>
  );
}

export default TarjetaMenuDuenoComplejo;