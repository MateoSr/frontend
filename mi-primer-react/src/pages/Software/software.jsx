import { Link } from 'react-router-dom';
import { useState, useRef } from 'react';
import './software.css';
import Planes from '../../components/planes/planes';
import InputForum from '../../components/inputForum/inputForum';

function Software() {
    const [formData, setFormData] = useState({
        razonSocial: '',
        nombreContacto: '',
        email: '',
        plan: '',
        comentario: ''
    });
    const planesRef = useRef(null);

    const scrollToPlanes = () => {
        planesRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch('http://localhost:3000/api/contacto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData) // datos de razonSocial, nombreContacto, email, plan, comentario
    });

    const data = await response.json();

    if (response.ok) {
      alert(data.message);
      // Limpiar formulario o cerrar modal
    } else {
      alert(data.message || "Error al enviar formulario");
    }
  } catch (error) {
    console.error("Error de conexión:", error);
  }
};
    return (
        <main>
            <section className='seccion-contenedor-imagen-complejo'>
                <div className='contenedor-imagen-complejo'>
                    <h1>Plataforma para Complejos Deportivos</h1>
                    <h2>Optimizá el alquiler de tus canchas</h2>
                    <button className='btn-ver-planes' onClick={scrollToPlanes}>
                        Ver Planes
                    </button>
                </div>
            </section>
            <div className='rectangulo-naranja'></div>
            <section className='seccion-celular'>
                <div className='contenedor-imagen-celular'></div>
                <div className='contenedor-texto-celular'>
                    <h1>Reserva Automática de Turnos</h1>
                    <h2>Todas tus reservas, en un solo lugar</h2>
                    <p>Conecta WhatsApp, Instagram, Facebook y Google en un único sistema. Tus clientes consultan la disponibilidad en tiempo real y aseguran su cancha en segundos, sin intermediarios ni esperas.</p>
                </div>
            </section>
            <div className='planes' ref={planesRef}>
                <h1>Nuestros planes</h1>
                <Planes></Planes>
            </div>
            <section className='seccion-contacto'>
                <div className='contenedor-formulario'>
                    <h2>Contratá la plataforma</h2>
                    <p>Dejanos tus datos y nos ponemos en contacto para configurar tu complejo.</p>
                    <form onSubmit={handleSubmit} className='formulario-contratacion'>
                        <InputForum label="Razón social" type="text" id="RazonSocial" value={formData.razonSocial} onChange={(e) => setFormData({...formData, razonSocial: e.target.value})} placeholder="Messi S.A." required={true} readOnly={false} />
                        <InputForum label="Nombre de contacto" type="text" id="nombre" value={formData.nombreContacto} onChange={(e) => setFormData({...formData, nombreContacto: e.target.value})} placeholder="Antonella Roccuzzo" required={true} readOnly={false} />
                        <InputForum label="Correo Electrónico" type="email" id="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="tuemail@ejemplo.com" required={true} readOnly={false} />
                        <InputForum label="Plan de Preferencia" type="select" id="plan" value={formData.plan} onChange={(e) => setFormData({...formData, plan: e.target.value})} required={true} options={[
                            { value: 'Plan Base', label: 'Plan Base (1-3 Canchas)' },
                            { value: 'Plan Estándar', label: 'Plan Estándar (4-6 Canchas)' },
                            { value: 'Plan Full', label: 'Plan Full (7+ Canchas)' }
                        ]} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Comentario</label>
                            <textarea
                                id="comentario"
                                name="comentario"
                                onChange={(e) => setFormData({...formData, comentario: e.target.value})}
                                placeholder="Dejá tu comentario..."
                                className="textarea-comentario"
                            />
                        </div>
                        <button type="submit" className="btn-enviar-formulario">
                            Enviar Solicitud
                        </button>
                    </form>
                </div>
            </section>
        </main>
    );
}

export default Software;