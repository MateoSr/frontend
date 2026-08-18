import { useState } from "react"
import './resetPassword.css'
import InputForum from "../../components/inputForum/inputForum"
import { useSearchParams, useNavigate} from 'react-router-dom'

function ResetPassword(){
    const [credenciales,setCredenciales] = useState({
        password:'',
        confirmpassword:''
    })
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');

    if(!id){
        alert("Enlace inválido o sin ID de usuario.");
        return;
    }

    const cambiarPassword = async (e)=>{
        e.preventDefault()
        if (credenciales.confirmpassword !== credenciales.password) {
            alert("Las contraseñas no coinciden");
            return 
        }
        try{
            const response = await fetch('http://localhost:3000/api/reset-password',{
                method:'PATCH',
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify({id:Number(id),password:credenciales.password}), 
             });
             const data = await response.json()
             if (response.ok) {
                alert(data.message || "Credenciales cambiadas");
                navigate('/login')
            } else {
                alert(data.message || "Error al crear usuario");
            }
             
        }catch(error){
            console.log("Error en la conexion", error);
            alert("Error en la conexión con el servidor");
        }
    }
    
        

    return(
        <div className='reset-container'>
            <div className="reset-card">
                <div className="reset-image-side">
                    <div className="imagen-overlay">
                        <h3>Reservá tu cancha en segundos</h3>
                        <p>Conectá con tus amigos y jugá en los mejores complejos deportivos.</p>
                    </div>
                </div>
                <div className="reset-derecha">
                    <div className="reset-header">
                        <div className="logo-marca">TL</div>
                        <h2>Turno Libre</h2>
                        <p className="reset-subtitulo">Ingresá tus datos para acceder a tus reservas</p>
                    </div>
                    <form className="reset-forum" onSubmit={cambiarPassword}>
                        <InputForum 
                            label="Contraseña" 
                            type="password" 
                            id="password" 
                            value={credenciales.password} 
                            onChange={(e) => setCredenciales(prev => ({ ...prev, password: e.target.value }))} 
                            placeholder="••••••••" 
                            required={true} 
                            readOnly={false} 
                        />
                            <InputForum 
                            label="Confirmar Contraseña" 
                            type="password" 
                            id="confirmpassword" 
                            value={credenciales.confirmpassword} 
                            onChange={(e) => setCredenciales(prev => ({ ...prev, confirmpassword: e.target.value }))} 
                            placeholder="••••••••" 
                            required={true} 
                            readOnly={false} 
                        />
                        <button className="boton" type="submit">
                        Enviar
                        </button>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword