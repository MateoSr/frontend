import {useState,useEffect} from 'react'
import './profile.css'
import InputForum from '../../components/inputForum/inputForum';

function Profile(){
    const [usuario,setUsuario] = useState({
        nombre: 'Mirko',
        apellido: 'García',
        email:'mirko.garcia@example.com',
        telefono: '123-456-7890',
        fechaNacimiento: '1990-01-01'
    })

    const [isEditing, setIsEditing] = useState(false);
    const [originalUsuario, setOriginalUsuario] = useState({});

    useEffect(() => {
      //funciuon que trae los datos del usuario
      const obtenerPerfil = async () => {
      try{
        const id = 1
        const response = await fetch(`http://localhost:3000/api/users/${id}`)
        if(response.ok){
          const data = response.json()
          setUsuario(data)
          setOriginalUsuario(data)
        }
      }catch(error){
        alert("Error cargando perfil:", error)
      }
    }
    obtenerPerfil()
    },[])


    const actualizarCambio = (e) => {
    const { name, value } = e.target;
    setUsuario(prev => ({
      ...prev,
      [name]: value
    }));
  };

    async function actualizarCambios(e){
        //aca harias el put a la api actualizando los datos
        try{
          const id = 1
          const response = await fetch(`http://localhost:3000/api/users/${id}`,{
            method:'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario)
            });
            if(response.ok){
              alert("¡Perfil actualizado con éxito!");
              setOriginalUsuario(usuario);
              setIsEditing(false);
            }
        }catch(error){
        alert("Error actualizando perfil:", error)
      }
      }

    const handleCancel = () => {
    setUsuario(originalUsuario); 
    setIsEditing(false);
    };

    const editarDatos = () =>{
      setIsEditing(true)
      setOriginalUsuario(usuario)
    }

    return(
      <section className="perfil-container">
      <div className='perfil-header'>
      <h1 className='saludo-titulo'>Hola {isEditing ? originalUsuario.nombre : usuario.nombre}!</h1>
      <p className="perfil-subtitulo">Gestioná tu información personal y consultá tus reservas.</p>
      </div>

      <div className='card-seccion'>
        <h2 className='seccion-subtitulo'>Datos Personales </h2>
        <form onSubmit={actualizarCambios}>
          <div className='grid-inputs'>
          <InputForum label="Nombre" type="text" id="nombre" name="nombre" value={usuario.nombre} readOnly={!isEditing} onChange={actualizarCambio}/>
          <InputForum label="Apellido" type="text" id="apellido" name="apellido" value={usuario.apellido} readOnly={!isEditing} onChange={actualizarCambio}/>
          <InputForum label="Email" type="email" id="email" name="email" value={usuario.email} readOnly = {!isEditing} onChange={actualizarCambio} />
          <InputForum label="Teléfono" type="tel" id="telefono" name="telefono" value={usuario.telefono} readOnly = {!isEditing} onChange={actualizarCambio} />
          <InputForum label="Fecha de Nacimiento" type="date" id="fechaNacimiento" name="fechaNacimiento" value={usuario.fechaNacimiento} readOnly = {!isEditing}onChange={actualizarCambio}/>
          </div>
          
          <div className="acciones-form">
            {!isEditing ? (
              <button type="button"  className='btn-primario' onClick={editarDatos}>
                Editar Perfil
              </button>
            ) : (
              <>
                <button type="submit" className='btn-primario'>Guardar Cambios</button>
                <button type="button" className='btn-secundario' onClick={handleCancel} >Cancelar</button>
              </>
            )}
          </div>
        </form>
      </div>

      <div className="card-seccion">
        <h2 className="seccion-subtitulo">Tus Ultimos Turnos</h2>
        <div className="turnos-contenido">
          <p className="texto-vacio">No tenés turnos registrados actualmente.</p>
        </div>
      </div>
      <button type="button" className='btn-primario'>Cerrar Sesion</button>
    </section>
    )
}

export default Profile