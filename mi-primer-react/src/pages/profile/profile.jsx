import {useState,useEffect} from 'react'
import './profile.css'
import InputForum from '../../components/inputForum/inputForum';
import TarjetaTurno from '../../components/tarjetaTurno/tarjetaTurno';
import { useModal } from '../../context/modal/ModalContext';

function Profile(){
    const { mostrarModal } = useModal();
    const [usuario,setUsuario] = useState({})
    const [turnos,setTurnos] = useState([])
    const [isEditing, setIsEditing] = useState(false);
    const [originalUsuario, setOriginalUsuario] = useState({});

    useEffect(() => {
      const token = localStorage.getItem("gestor_token");
      if (!token) {
      console.log("No hay token almacenado. El usuario no está logueado.");
      return;
      }
      //funciuon que trae los datos del usuario
      const obtenerPerfil = async () => {
      try{
      
        const response = await fetch(`http://localhost:3000/api/users/perfil`,{
          method: "GET",
           headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` 
        }
        })
        if(response.ok){
          const data = await response.json()
          console.log(data)
          setUsuario(data)
          setOriginalUsuario(data)
        }
      }catch(error){
        mostrarModal({
          titulo: 'Error',
          mensaje: `Error cargando perfil: ${error.message || error}`,
          tipo: 'error'
        })
      }
    }
    obtenerPerfil()
    },[mostrarModal])

    useEffect(() => {
    const buscarTurnos = async () => {
      const token = localStorage.getItem("gestor_token");
      try{
        const response = await fetch('http://localhost:3000/api/turnos', {
          method: 'GET', 
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if(response.ok){
          const respuesta = await response.json()
          console.log(respuesta)
          
          // Ordenar: próximos primero (asc), luego pasados (desc)
          const ahora = new Date();
          const ordenados = [...respuesta].sort((a, b) => {
            const fechaA = new Date(a.fechaInicio);
            const fechaB = new Date(b.fechaInicio);
            const esFuturoA = fechaA >= ahora;
            const esFuturoB = fechaB >= ahora;
            
            if (esFuturoA && esFuturoB) return fechaA - fechaB; // ambos futuros: más cercano primero
            if (!esFuturoA && !esFuturoB) return fechaB - fechaA; // ambos pasados: más reciente primero
            return esFuturoA ? -1 : 1; // futuros antes que pasados
          });
          
          setTurnos(ordenados);
        }
      }catch(error){
        console.log("Error cargando turnos del usuario:", error)
      }
    }
    buscarTurnos()
    },[])

    const cancelarTurno = async (idTurno) => {
      try {
    const token = localStorage.getItem("gestor_token"); 
    
    const respuesta = await fetch(`http://localhost:3000/api/turnos/${idTurno}/cancelar`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await respuesta.json();

    if (respuesta.ok) {
      await mostrarModal({
        titulo: 'Turno cancelado',
        mensaje: "Turno cancelado correctamente",
        tipo: 'exito'
      });
      setTurnos(prevTurnos => prevTurnos.filter(t => t.id !== idTurno));
      window.location.reload();
    } else {
      mostrarModal({
        titulo: 'Error',
        mensaje: data.error || "No se pudo cancelar el turno",
        tipo: 'error'
      });
    }
  } catch (error) {
    mostrarModal({
      titulo: 'Error',
      mensaje: "Error de conexión con el servidor",
      tipo: 'error'
    });
  }
};


    const actualizarCambio = (e) => {
    const { name, value } = e.target;
    setUsuario(prev => ({
      ...prev,
      [name]: value
    }));
  };

    async function actualizarCambios(e){
        e.preventDefault()
        const token = localStorage.getItem("gestor_token");
        if (!token) {
        console.log("No hay token almacenado. El usuario no está logueado.");
        return;
        }
        //aca harias el put a la api actualizando los datos
        try{
          
          const response = await fetch(`http://localhost:3000/api/users/perfil`,{
            method:'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(usuario)
            });
            if(response.ok){
              mostrarModal({
                titulo: 'Perfil actualizado',
                mensaje: "¡Perfil actualizado con éxito!",
                tipo: 'exito'
              });
              setOriginalUsuario(usuario);
              setIsEditing(false);
            }
        }catch(error){
        mostrarModal({
          titulo: 'Error',
          mensaje: `Error actualizando perfil: ${error.message || error}`,
          tipo: 'error'
        })
        console.log(error)
      }
      }

    const handleCancel = () => {
    setUsuario({ ...originalUsuario }); 
    setIsEditing(false);
  };

    const editarDatos = (e) =>{
      if(e) e.preventDefault()
      setIsEditing(true)
    }

    const cerrarSesion = () => {
      localStorage.removeItem("gestor_token");
      window.location.href = '/';
    }

    return(
      <section className="perfil-container">
      <div className='perfil-header'>
      <h1 className='saludo-titulo'>Hola {isEditing ? originalUsuario.nombre : usuario.nombre}!</h1>
      <p className="perfil-subtitulo">Gestioná tu información personal y consultá tus reservas.</p>
      </div>

      <div className='card-seccion'>
        <h2 className='seccion-subtitulo'>Datos personales</h2>
        <form onSubmit={actualizarCambios}>
          <div className='grid-inputs'>
          <InputForum label="Nombre" type="text" id="nombre" name="nombre" value={usuario?.nombre || ""} readOnly={!isEditing} onChange={actualizarCambio}/>
          <InputForum label="Apellido" type="text" id="apellido" name="apellido" value={usuario?.apellido || ""} readOnly={!isEditing} onChange={actualizarCambio}/>
          <InputForum label="Email" type="email" id="email" name="email" value={usuario?.email || ""} readOnly = {!isEditing} onChange={actualizarCambio} />
          <InputForum label="Teléfono" type="tel" id="telefono" name="telefono" value={usuario?.telefono || ""} readOnly = {!isEditing} onChange={actualizarCambio} />
          <InputForum label="Fecha de nacimiento" type="date" id="fechaNacimiento" name="fechaNacimiento" value={usuario?.fechaNacimiento || ""} readOnly = {!isEditing}onChange={actualizarCambio}/>
          </div>
          
          <div className="acciones-form">
            {!isEditing ? (
              <button type="button"  className='btn-primario' onClick={editarDatos}>
                Editar Perfil
              </button>
            ) : (
              <>
                <button type="submit" className='btn-primario'>Guardar cambios</button>
                <button type="button" className='btn-secundario' onClick={handleCancel} >Cancelar</button>
              </>
            )}
          </div>
        </form>
      </div>

      <div className="card-seccion">
        <h2 className="seccion-subtitulo">Tus últimos turnos</h2>
        {turnos.length > 0 ? (
          <div className="grid-turnos">
            {turnos.slice(0, 3).map((turno) => (
              <TarjetaTurno 
                key={turno.id} 
                turno={turno} 
                onCancelar={(idTurno) => {cancelarTurno(idTurno);}} 
              />
            ))}
          </div>
        ) : (
          <p className="turnos-vacio">No tenés turnos registrados actualmente.</p>
        )}
      </div>
      <button type="button" className='btn-primario' onClick={cerrarSesion}>Cerrar sesión</button>
    </section>
    )
}

export default Profile