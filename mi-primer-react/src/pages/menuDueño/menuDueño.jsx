import './menuDueño.css';
import {TarjetaMenuDueno} from '../../components/tarjetaMenuDueno/tarjetaMenuDueno'
import {TarjetaMenuDuenoComplejo} from '../../components/tarjetaMenuDuenoComplejo/tarjetaMenuDuenoComplejo'
import { useEffect, useState } from 'react';
import { busquedaComplejoDueno } from '../../services/complejosService';
import { obtenerDatosMenuDueno } from '../../services/dashboarService';
import { useModal } from '../../context/modal/ModalContext';




function MenuDueño() {
  const { mostrarModal } = useModal();
  const [complejos, setComplejos] = useState([])
  const [datos,setDatos] = useState({})

  useEffect(() => {
      const token = localStorage.getItem('gestor_token');
      if (!token) {
        mostrarModal({
          titulo: 'Sesión requerida',
          mensaje: 'No estás logueado. Por favor, inicia sesión.',
          tipo: 'info'
        }).then(() => {
          window.location.href = '/login';
        });
        return undefined;
      }
      //obteniendo los datos de los comnplejos del dueño
      const obtenerComplejos = async () => {
        try{
          const data = await busquedaComplejoDueno(token)
          setComplejos(data)
          console.log(complejos)
        }catch(error){
          if (error.name === 'AbortError' || error.name === 'CanceledError') {
        return;
      }
      mostrarModal({
        titulo: 'Error',
        mensaje: error.message,
        tipo: 'error'
      });
      }
      }

      const obtenerDatos = async () => {
        try{
          const data = await obtenerDatosMenuDueno(token)
          console.log(data)
          setDatos(data)
        }catch(error){
          mostrarModal({
            titulo: 'Error',
            mensaje: error.message,
            tipo: 'error'
          })
        }
      }
      obtenerComplejos()
      obtenerDatos()
    },[mostrarModal])



  return (
    <main className='contenedor-menuDueño'>
        <div className="partesuperior">
            <div className="titsulos">
                <h1 className='titulo-menuDueño'>Buen día, dueño</h1>
                <p>Acá tenés la información sobre tus complejos</p>
            </div>
            <div className="fecha">

            </div>

        </div>
        <div className='contenidoprincipal'>
            <div className='tarjetasMetricas'>
                <TarjetaMenuDueno 
          titulo="Ingresos Estimados Hoy" 
          valor={`$${datos.ingresosEstimados}`}
      
          icono="💵" 
          esVerde={true} 
        />
        
        {/* Tarjeta 2: Reservas Totales */}
        <TarjetaMenuDueno 
          titulo="Reservas Totales" 
          valor={datos.cantidadTurnos} 
          subtitulo={`En ${datos.cantidadCanchas} canchas disponibles`}
          icono="📅" 
        />
        
        {/* Tarjeta 3: Ocupación Promedio (Activando la barra de progreso) */}
        <TarjetaMenuDueno 
          titulo="Ocupación Promedio" 
          valor={`${datos?.ocupacionPorcentaje ?? 0}%`}
          progreso={datos?.ocupacionPorcentaje ?? 0}
          icono="🔥" 
          esVerde={true}
        />
        
        {/* Tarjeta 4: Complejos Activos (Activando el indicador de estado) */}
        <TarjetaMenuDueno 
          titulo="Deporte top" 
          valor={datos.deporteEstrella?.nombre || "Sin reservas"}
          subtitulo={datos?.deporteEstrella?.reservas != null? `${datos.deporteEstrella.reservas} reservas hoy`: "0 reservas hoy"}
          icono="⚽" 
        />

            </div>
            <div className='infoComplejos'> 
                <div className="seccion-header">
                    <h2>Mis complejos</h2>
                    <span className="sub-hint">Selecciona uno para gestionar horarios y detalles</span>
                </div>

                <div className="grilla-complejos">
                    {complejos.map((complejo) => (
                    <TarjetaMenuDuenoComplejo 
                        key={complejo.id}
                        id={complejo.id}
                        nombre={complejo.nombre}
                        direccion={complejo.direccion}
                        ciudad = {complejo.localidad.nombre}
                        deportes={complejo.deportes}
                        canchasDisponibles={complejo.canchas.length}
                        
                    />
                    ))}
          </div>
            </div>
            <div className='reportesFinancieros'>
                <div className='reportes-header'>
                    <h2>Reportes financieros</h2>
                    <span className="sub-hint">Estadísticas de tus complejos actualizadas</span>
                </div>
                <div>
                    
                </div>
            </div>

        </div>
        
    </main>
  )
}
export default MenuDueño