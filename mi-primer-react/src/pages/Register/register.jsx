import InputForum from '../../components/inputForum/inputForum';
import { Link } from 'react-router-dom';
import { useState } from 'react'

function Register(){
    const [usuario,setUsuario] = useState({
        email:'',
        password:'',
        confirmPassword:'',
        telefono:''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const datosFormulario = usuario;
        console.log(datosFormulario)

        try{
            const response = await fetch('http://localhost:3000/api/users', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json', 
                },
                body: JSON.stringify(datosFormulario), 
            });

            const data = await response.json();
            if(response.ok){
                console.log('Usuario creado exitosamente', data);
            }
            else{
                console.log('Error al crear usuario', data);
            }
        }catch(error){
            console.log("Error en la conexion",error)
            
        }
    }


    return(
        <div>
            <form className='register-form' onSubmit={handleSubmit}>
                <h2>Registrarse</h2>
                <InputForum label="Correo Electrónico" type="email" id="email" value={usuario.email} onChange={(e) => setUsuario(prev => ({ ...prev, email: e.target.value }))} placeholder="tuemail@ejemplo.com" required={true} />
                <InputForum label="Contraseña" type="password" id="password" value={usuario.password} onChange={(e) => setUsuario(prev => ({ ...prev, password: e.target.value }))} placeholder="******" required={true} />
                <InputForum label="Confirmar Contraseña" type="password" id="confirmPassword" value={usuario.confirmPassword} onChange={(e) => setUsuario(prev => ({ ...prev, confirmPassword: e.target.value }))} placeholder="******" required={true} />
                <InputForum label="Teléfono" type="tel" id="telefono" value={usuario.telefono} onChange={(e) => setUsuario(prev => ({ ...prev, telefono: e.target.value }))} placeholder="123-456-7890" required={true} />
                <button className="boton" type="submit">Registrarse</button>
            </form>
        </div>
    )
}

export default Register