import InputForum from '../../components/inputForum/inputForum';
import { Link } from 'react-router-dom';
import { useState } from 'react'
import './login.css'

function Login(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const datosFormulario = {
            email: email,
            password: password
        }
        try{
            const response = await fetch('http://localhost:3000/api/login', {
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
                alert(data.message)
            }
        }catch(error){
            alert("Error en la conexion",error)
            
        }
    }

    return(
        <div className="login-container">
            <form onSubmit={handleSubmit} className='login-form'>
                <h2>Iniciar Sesion</h2>
                <InputForum label="Correo Electrónico" type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tuemail@ejemplo.com" required={true}></InputForum>
                <InputForum label="Contraseña" type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="******" required={true}></InputForum>
                <div className="login-links">
                <Link to="/register" className="redirect-form"><strong>Crear cuenta</strong></Link>
                <Link to="/forgot" className="redirect-form"><strong>Olvide mi contraseña</strong></Link>
                </div>
                <button className="boton" type="submit"> Iniciar Sesion </button>

            </form>
        </div>
    )
}
export default Login
