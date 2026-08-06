import InputForum from '../../components/inputForum/inputForum';
import { Link } from 'react-router-dom';
import { useState } from 'react'
import './register.css'

function Register(){
    const [usuario,setUsuario] = useState({
        email:'',
        password:'',
        confirmPassword:'',
        telefono:'',
        dni:'',
        nombre:'',
        apellido:'',
        fechaNacimiento:''  
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        // const datosFormulario = usuario
        // console.log(datosFormulario)
        if (usuario.confirmPassword !== usuario.password) {
            alert("Las contraseñas no coinciden");
            return;
        }

        const { confirmPassword, ...datosFormulario } = usuario
    
        try{
            const response = await fetch('http://localhost:3000/api/register', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json', 
                },
                body: JSON.stringify(datosFormulario), 
            });

            const data = await response.json();
            if(response.ok){
                alert(data.message);
            }
            else{
                alert(data.message || "Error al crear usuario");
            }
        }catch(error){
            console.log("Error en la conexion",error)
            
        }
    }


    return(
        <div className="register-container">
            <form className='register-form' onSubmit={handleSubmit}>
                <h2>Registrarse</h2>
             
                <InputForum label="Correo Electrónico" type="email" id="email" value={usuario.email} onChange={(e) => setUsuario(prev => ({ ...prev, email: e.target.value }))} placeholder="tuemail@ejemplo.com" required={true} />
                <InputForum label="Contraseña" type="password" id="password" name="password" autoComplete="new-password" value={usuario.password} onChange={(e) => setUsuario(prev => ({ ...prev, password: e.target.value }))} placeholder="******" required={true} />
                <InputForum label="Confirmar Contraseña" type="password" id="confirmPassword" name="confirmPassword" autoComplete="new-password"value={usuario.confirmPassword} onChange={(e) => setUsuario(prev => ({ ...prev, confirmPassword: e.target.value }))} placeholder="******" required={true} />
                <InputForum label="Teléfono" type="tel" id="telefono" value={usuario.telefono} onChange={(e) => setUsuario(prev => ({ ...prev, telefono: e.target.value }))} placeholder="123-456-7890" required={true} />
                
                <InputForum label="DNI" type="text" id="dni" value={usuario.dni} onChange={(e) => setUsuario(prev => ({ ...prev, dni: e.target.value }))} placeholder="12345678" required={true} />
                <InputForum label="Nombre" type="text" id="nombre" value={usuario.nombre} onChange={(e) => setUsuario(prev => ({ ...prev, nombre: e.target.value }))} placeholder="Lionel" required={true} />
                <InputForum label="Apellido" type="text" id="apellido" value={usuario.apellido} onChange={(e) => setUsuario(prev => ({ ...prev, apellido: e.target.value }))} placeholder="Messi" required={true} />
                <InputForum label="Fecha de Nacimiento" type="date" id="fechaNacimiento" value={usuario.fechaNacimiento} onChange={(e) => setUsuario(prev => ({ ...prev, fechaNacimiento: e.target.value }))} placeholder="1990-01-01" required={true} />
                <Link to="/login" className="redirect-form"><strong>Ya tengo cuenta</strong></Link>
                
                <button className="boton" type="submit">Registrarse</button>
            </form>
        </div>
    )
}

export default Register