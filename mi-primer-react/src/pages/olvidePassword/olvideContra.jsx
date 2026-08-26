import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import InputForum from '../../components/inputForum/inputForum';
import './olvideContra.css'

function OlvideContra() {
    const [email, setEmail] = useState('')
    const [estado, setEstado] = useState('')


    const enviarEmail = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch('http://localhost:3000/api/forgot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await response.json
            if (response.ok) {
                alert("Email enviado")
            }
        } catch (error) {
            alert("Error en servidor ")
        }
    }

    return (
        <div className='olvide-contenedor'>
            <div className='olvide-card'>

                <div className="olvide-izquierda">
                    <div className="olvide-header">
                        <div className="logo-marca">TL</div>
                        <h2>Turno Libre</h2>
                        <p className="olvide-subtitulo">Ingresa tu email para restablecer tu usuario</p>
                    </div>
                    <form className='olvide-form' onSubmit={enviarEmail}>
                        <InputForum label="Correo Electrónico" type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tuemail@ejemplo.com" required={true} readOnly={false} />
                        <button className='olvide-boton' type='submit'> Enviar</button>
                    </form>
                    <div className="register-footer">
                        <p>¿Ya tenés una cuenta? <Link to="/login" className="redirect-login">Iniciar sesión</Link></p>
                    </div>
                </div>
                {/* LADO DERECHO */}
                <div className="olvide-imagen">
                    <div className="imagen-overlay">
                        <h3>Recupera tu usuario</h3>
                        <p>Te enviaremos un mail para poder continuar</p>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default OlvideContra;