import './tarjetaMenuDueno.css';

export function TarjetaMenuDueno({ 
  titulo, 
  valor, 
  subtitulo, 
  icono = "📊", 
  esVerde = false, 
  progreso = null,       // Si le pasas un string como "73%", muestra la barra
  estadoNormal = null    // Si le pasas texto, muestra el punto verde de estado
}) {
  return (
    <div className={`tarjeta-metrica ${esVerde ? 'tarjeta-naranja' : 'tarjeta-blanca'}`}>
      
      <div className="tarjeta-header">
        <span className="titulo-metrica">{titulo}</span>
        <div className={`icono-contenedor ${esVerde ? 'verde-claro' : 'fondo-suave'}`}>
          {icono}
        </div>
      </div>

      <div className="tarjeta-cuerpo">
        <h2 className="valor-metrica">{valor}</h2>
        
        {/* Subtexto normal o de comparación */}
        {subtitulo && <p className="subtitulo-metrica">{subtitulo}</p>}
        
        {/* Barra de progreso opcional (para ocupación) */}
        {progreso && (
          <div className="barra-progreso-fondo">
            <div className="barra-progreso-fill" style={{ width: progreso }}></div>
          </div>
        )}
        
        {/* Estado operativo opcional (para complejos activos) */}
        {estadoNormal && (
          <p className="subtitulo-metrica estado-normal">
            <span className="punto-verde"></span> {estadoNormal}
          </p>
        )}
      </div>

    </div>
  );
}

export default TarjetaMenuDueno;