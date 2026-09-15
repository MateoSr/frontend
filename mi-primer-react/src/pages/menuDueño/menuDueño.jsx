import './menuDueño.css';
import {TarjetaMenuDueno} from '../../components/tarjetaMenuDueno/tarjetaMenuDueno'
import {TarjetaMenuDuenoComplejo} from '../../components/tarjetaMenuDuenoComplejo/tarjetaMenuDuenoComplejo'



function MenuDueño() {
    const misComplejos = [
    {
      id: 1,
      nombre: "Complejo Norte Pádel & Fútbol",
      direccion: "Av. Libertador 4500",
      deportes: "Fútbol 5, Pádel",
      canchas: 5,
      imagenUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 2,
      nombre: "Central Sports Club",
      direccion: "San Martín 1220",
      deportes: "Fútbol 7, Tenis",
      canchas: 3,
      imagenUrl: "https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=600&q=80"
    }
  ];


  return (
    <main className='contenedor-menuDueño'>
        <div className="partesuperior">
            <div className="titsulos">
                <h1 className='titulo-menuDueño'>Buen Dia Dueño</h1>
                <p> Aqui tienes la informacion acerca de tus complejos</p>
            </div>
            <div className="fecha">

            </div>

        </div>
        <div className='contenidoprincipal'>
            <div className='tarjetasMetricas'>
                <TarjetaMenuDueno 
          titulo="Ingresos Estimados Hoy" 
          valor="$63.500" 
          subtitulo="+12% vs ayer" 
          icono="💵" 
          esVerde={true} 
        />
        
        {/* Tarjeta 2: Reservas Totales */}
        <TarjetaMenuDueno 
          titulo="Reservas Totales" 
          valor="23" 
          subtitulo="En 8 canchas disponibles" 
          icono="📅" 
        />
        
        {/* Tarjeta 3: Ocupación Promedio (Activando la barra de progreso) */}
        <TarjetaMenuDueno 
          titulo="Ocupación Promedio" 
          valor="73%" 
          progreso="73%" 
          icono="🔥" 
          esVerde={true}
        />
        
        {/* Tarjeta 4: Complejos Activos (Activando el indicador de estado) */}
        <TarjetaMenuDueno 
          titulo="Complejos Activos" 
          valor="2" 
          estadoNormal="Todos operando normal" 
          icono="🏟️" 
        />

            </div>
            <div className='infoComplejos'> 
                <div className="seccion-header">
                    <h2>Mis Complejos</h2>
                    <span className="sub-hint">Selecciona uno para gestionar horarios y detalles</span>
                </div>

                <div className="grilla-complejos">
                    {misComplejos.map((complejo) => (
                    <TarjetaMenuDuenoComplejo 
                        key={complejo.id}
                        id={complejo.id}
                        nombre={complejo.nombre}
                        direccion={complejo.direccion}
                        deportes={complejo.deportes}
                        canchasDisponibles={complejo.canchas}
                        
                    />
                    ))}
          </div>
            </div>
            <div className='reportesFinancieros'>
                <div className='reportes-header'>
                    <h2>Reportes Financieros</h2>
                    <span className="sub-hint">Estadisticas de tus complejos actualizadas</span>
                </div>
                <div>
                    <h1> LAUTI Y MATEO GILES SI LEEN ESTO SON PUTOS </h1>
                </div>
            </div>

        </div>
        
    </main>
  )
}
export default MenuDueño