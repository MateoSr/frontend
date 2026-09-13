import { useSearchParams, useNavigate } from 'react-router-dom';
import './confirmarReserva.css';
import './modalConfirmar.css';
import InputForum from '../../components/inputForum/inputForum';
import { useReserva } from '../../hooks/useReserva';

export default function ConfirmarReserva() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const complejo = searchParams.get('complejoId');
  const canchaNro = searchParams.get('canchaNro');
  const fecha = searchParams.get('fecha');
  const horaInicio = searchParams.get('horarioInicio');

  const {
    reserva,
    titular,
    cargando,
    horaFin,
    mostrarModal,
    handleChange,
    handleConfirmar
  } = useReserva({
    complejo: complejo || '',
    canchaNro: canchaNro || '',
    fecha: fecha || '',
    horaInicio: horaInicio || ''
  });
  return (
    <div className="confirmar-reserva-wrapper">
      <div className="reserva-container">
        
        {/* Encabezado Principal */}
        <header className="reserva-header">
          <h1>¡Ya casi terminamos!</h1>
          <p>Revisá los detalles de tu turno y tus datos para confirmar la reserva.</p>
        </header>

        {/* Sección de Tarjetas Separadas */}
        <div className="reserva-grid">
          
          <div className="card-reserva card-turno">
            <h2>Detalles del Turno</h2>
            
            <div className="info-grupo con-linea">
              <span className="info-label">Complejo</span>
              <div className="info-detalle">
                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4m-4 0H9m4 0V5" />
                </svg>
                <span className="info-valor destacado">
                  {cargando ? 'Cargando...' : reserva?.complejoNombre || 'Gol Gana'}
                </span>
              </div>
            </div>

            <div className="info-grupo con-linea">
              <span className="info-label">Ubicación</span>
              <div className="info-detalle">
                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="info-valor">
                  {cargando ? 'Cargando...' : reserva?.complejoUbicacion || 'Cullen 1665, Rosario'}
                </span>
              </div>
            </div>

            <div className="info-grupo con-linea">
              <span className="info-label">Cancha</span>
              <div className="info-detalle">
                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                <span className="info-valor">Cancha {canchaNro}</span>
              </div>
            </div>

            <div className="info-grupo con-linea">
              <span className="info-label">Deporte</span>
              <div className="info-detalle">
                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="info-valor">
                  {cargando ? 'Cargando...' : reserva?.deporte || 'Fútbol 5'}
                </span>
              </div>
            </div>

            <div className="info-row con-linea">
              <div className="info-grupo">
                <span className="info-label">Hora Inicio</span>
                <div className="info-detalle">
                  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="info-valor">{horaInicio} hs</span>
                </div>
              </div>

              <div className="info-grupo">
                <span className="info-label">Hora Fin</span>
                <div className="info-detalle">
                  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="info-valor">{horaFin} hs</span>
                </div>
              </div>
            </div>

            <div className="info-grupo precio-row con-linea">
              <span className="info-label">Precio Seña</span>
              <div className="info-detalle">
                <svg className="icon icon-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="info-valor sena">
                  $ {cargando ? '...' : reserva?.precioSena || '10.000'}
                </span>
              </div>
            </div>

            <div className="info-grupo precio-row total">
              <span className="info-label">Precio Total</span>
              <div className="info-detalle">
                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span className="info-valor total-monto">
                  $ {cargando ? '...' : reserva?.precioTotal || '37.000'}
                </span>
              </div>
            </div>
          </div>

          {/* Tarjeta 2: Datos del Titular */}
          <div className="card-reserva card-titular">
            <h2>Datos del Titular</h2>
            
            <form className="reserva-form">
              <InputForum
                label="Nombre"
                id="nombre"
                name="nombre"
                type="text"
                value={titular.nombre}
                onChange={handleChange}
                placeholder="Ej. Mirko"
              />

              <InputForum
                label="Apellido"
                id="apellido"
                name="apellido"
                type="text"
                value={titular.apellido}
                onChange={handleChange}
                placeholder="Ej. Surjak"
              />

              <InputForum
                label="Teléfono"
                id="telefono"
                name="telefono"
                type="tel"
                value={titular.telefono}
                onChange={handleChange}
                placeholder="Ej. +54 3471 330992"
              />

              <InputForum
                label="Correo Electrónico"
                id="email"
                name="email"
                type="email"
                value={titular.email}
                onChange={handleChange}
                placeholder="tuemail@ejemplo.com"
              />
            </form>
          </div>

        </div>

        {/* Botón de Confirmar centrado */}
        <div className="confirmar-action">
          <button type="button" className="btn-confirmar" onClick={handleConfirmar}>
            Confirmar Reserva
          </button>
        </div>
      </div>

      {/* Modal renderizado fuera de la jerarquía mediante Portal */}
      {mostrarModal && (
  <div className="modal-overlay">
    <div className="modal-confirmacion-contenido">
      <h2>¡Reserva Confirmada!</h2>
      
      <p>
        Su turno se ha creado correctamente, le enviamos el comprobante por email.
      </p>
      <p className="modal-subtexto">
        Recuerde que puede ver sus turnos en su perfil.
      </p>

      <button type="button" className="btn-modal-home" onClick={() => navigate('/')}>
        Ir al Home
      </button>
    </div>
  </div>
  )}
    </div>
  );
}