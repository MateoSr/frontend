import { useState } from "react"
import './resetPassword.css'
import InputForum from "../../components/inputForum/inputForum"
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useModal } from '../../context/modal/ModalContext'

function ResetPassword() {
    const { mostrarModal } = useModal();
    const [credenciales, setCredenciales] = useState({
        password: '',
        confirmpassword: ''
    })
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');


    const cambiarPassword = async (e) => {
        e.preventDefault()
        if (!token) {
        mostrarModal({
            titulo: 'Enlace inválido',
            mensaje: "Enlace inválido o expirado (falta el token).",
            tipo: 'error'
        });
        return;
        }

        if (credenciales.confirmpassword !== credenciales.password) {
            mostrarModal({
                titulo: 'Las contraseñas no coinciden',
                mensaje: "Las contraseñas no coinciden",
                tipo: 'error'
            });
            return
        }
        try {
            const response = await fetch('http://localhost:3000/api/reset-password', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token:token, password: credenciales.password }),
            });
            const data = await response.json()
            if (response.ok) {
                await mostrarModal({
                    titulo: 'Contraseña actualizada',
                    mensaje: data.message || "Credenciales cambiadas",
                    tipo: 'exito'
                });
                navigate('/login')
            } else {
                mostrarModal({
                    titulo: 'Error',
                    mensaje: data.message || "Error al crear usuario",
                    tipo: 'error'
                });
            }

        } catch (error) {
            console.log("Error en la conexion", error);
            mostrarModal({
                titulo: 'Error',
                mensaje: "Error en la conexión con el servidor",
                tipo: 'error'
            });
        }
    }



    return (
        <div className='reset-container'>
            <div className="reset-card">
                <div className="reset-image-side">
                    <div className="imagen-overlay">
                        <h3>Renová ru contraseña.</h3>
                        <p>Actualizá tu contraseña para volver a la cancha y seguir jugando.</p>
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
                            style={{ 'marginBottom': '20px' }}
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
                            style={{ 'marginBottom': '20px' }}
                        />
                        <button className="reset-boton" type="submit">
                            Enviar
                        </button>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword