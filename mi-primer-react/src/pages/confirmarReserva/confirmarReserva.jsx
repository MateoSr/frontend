import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './confirmarReserva.css';
import './modalConfirmar.css';
import InputForum from '../../components/inputForum/inputForum';
import { useReserva } from '../../hooks/useReserva';
import IconEdificio from '../../assets/icons/edificio.svg?react';
import IconUbicacion from '../../assets/icons/ubicacion.svg?react';
import IconCancha from '../../assets/icons/cancha.svg?react';
import IconMoneda from '../../assets/icons/moneda.svg?react';
import IconReloj from '../../assets/icons/reloj.svg?react';
import IconBilletera from '../../assets/icons/billetera.svg?react';
import IconTarjeta from '../../assets/icons/tarjeta.svg?react';

export default function ConfirmarReserva() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const complejo = searchParams.get('complejoId');
  const canchaNro = searchParams.get('canchaNro');
  const inicio = searchParams.get('inicio');
  const duracion = searchParams.get('duracion');
  const modo = searchParams.get('modo');

  const {
    reserva,
    titular,
    cargando,
    horaInicio,
    horaFin,
    mostrarModal,
    esEncargado,
    handleChange,
    handleConfirmar
  } = useReserva({
    complejo: complejo || '',
    canchaNro: canchaNro || '',
    inicio: inicio || '',
    duracion: duracion || '',
    modo
  });

  useEffect(() => {
    if (!mostrarModal || !esEncargado) return undefined;

    const temporizador = setTimeout(() => navigate('/menuEncargado'), 1500);
    return () => clearTimeout(temporizador);
  }, [mostrarModal, esEncargado, navigate]);
  return (
    <div className="confirmar-reserva-wrapper">
      <div className={`reserva-container ${esEncargado ? 'modo-encargado' : ''}`}>
        
        {/* Encabezado Principal */}
        <header className="reserva-header">
          <h1>{esEncargado ? 'Agendar turno' : '¡Ya casi terminamos!'}</h1>
          <p>{esEncargado ? 'Seleccioná el cliente y confirmá el turno.' : 'Revisá los detalles de tu turno y tus datos para confirmar la reserva.'}</p>
        </header>

        {/* Sección de Tarjetas Separadas */}
        <div className="reserva-grid">
          
          <div className="card-reserva card-turno">
            <h2>Detalles del turno</h2>
            
            <div className="info-grupo con-linea">
              <span className="info-label">Complejo</span>
              <div className="info-detalle">
                <IconEdificio className="icon" />
                <span className="info-valor destacado">
                  {cargando ? 'Cargando...' : reserva?.complejoNombre || 'Gol Gana'}
                </span>
              </div>
            </div>

            <div className="info-grupo con-linea">
              <span className="info-label">Ubicación</span>
              <div className="info-detalle">
                <IconUbicacion className="icon" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                <span className="info-valor">
                  {cargando ? 'Cargando...' : reserva?.complejoUbicacion || 'Cullen 1665, Rosario'}
                </span>
              </div>
            </div>

            <div className="info-grupo con-linea">
              <span className="info-label">Cancha</span>
              <div className="info-detalle">
                <IconCancha className="icon" />
                <span className="info-valor">Cancha {canchaNro}</span>
              </div>
            </div>

            <div className="info-grupo con-linea">
              <span className="info-label">Deporte</span>
              <div className="info-detalle">
                <IconMoneda className="icon" />
                <span className="info-valor">
                  {cargando ? 'Cargando...' : reserva?.deporte || 'Fútbol 5'}
                </span>
              </div>
            </div>

            <div className="info-row con-linea">
              <div className="info-grupo">
                <span className="info-label">Hora inicio</span>
                <div className="info-detalle">
                  <IconReloj className="icon" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  <span className="info-valor">{horaInicio} hs</span>
                </div>
              </div>

              <div className="info-grupo">
                <span className="info-label">Hora fin</span>
                <div className="info-detalle">
                  <IconReloj className="icon" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  <span className="info-valor">{horaFin} hs</span>
                </div>
              </div>
            </div>

            <div className="info-grupo precio-row con-linea">
              <span className="info-label">Precio seña</span>
              <div className="info-detalle">
                <IconBilletera className="icon icon-orange" />
                <span className="info-valor sena">
                  $ {cargando ? '...' : reserva?.precioSenia}
                </span>
              </div>
            </div>

            <div className="info-grupo precio-row total">
              <span className="info-label">Precio total</span>
              <div className="info-detalle">
                <IconTarjeta className="icon" />
                <span className="info-valor total-monto">
                  $ {cargando ? '...' : reserva?.precioTotal}
                </span>
              </div>
            </div>
          </div>

          {/* Tarjeta 2: Datos del Titular */}
          <div className="card-reserva card-titular">
            <h2>{esEncargado ? 'Cliente del turno' : 'Datos del titular'}</h2>
            
            <form className="reserva-form">
              <InputForum
                label="Nombre"
                id="nombre"
                name="nombre"
                type="text"
                value={titular.nombre}
                onChange={handleChange}
                placeholder="Ej. Mirko"
                required={esEncargado}
              />

              <InputForum
                label="Apellido"
                id="apellido"
                name="apellido"
                type="text"
                value={titular.apellido}
                onChange={handleChange}
                placeholder="Ej. Surjak"
                required={esEncargado}
              />
              {!esEncargado && (
                <>
              <InputForum
                label="Teléfono"
                id="telefono"
                name="telefono"
                type="tel"
                value={titular.telefono}
                onChange={handleChange}
                placeholder="Ej. +54 3471 330992"
                required={true}
              />

              <InputForum
                label="Correo Electrónico"
                id="email"
                name="email"
                type="email"
                value={titular.email}
                onChange={handleChange}
                placeholder="tuemail@ejemplo.com"
                required={true}
              />
              </>
              )}
            </form>
          </div>

        </div>

        {/* Botón de Confirmar centrado */}
        <div className="confirmar-action">
          <button type="button" className="btn-confirmar" onClick={handleConfirmar}>
            {esEncargado ? 'Agendar turno' : 'Pagar seña con Mercado Pago'}
          </button>
        </div>
      </div>

      {/* Modal renderizado fuera de la jerarquía mediante Portal */}
      {mostrarModal && (
  <div className="modal-overlay">
    <div className="modal-confirmacion-contenido">
      <h2>{esEncargado ? '¡Turno agendado!' : '¡Reserva confirmada!'}</h2>
      
      <p>
        {esEncargado
          ? 'El turno se creó correctamente para el cliente seleccionado.'
          : 'Su turno se ha creado correctamente, le enviamos el comprobante por email.'}
      </p>
      <p className="modal-subtexto">
        {!esEncargado && 'Recuerde que puede ver sus turnos en su perfil.'}
      </p>

      <button type="button" className="btn-modal-home" onClick={() => navigate(esEncargado ? '/menuEncargado' : '/')}>
        {esEncargado ? 'Volver al panel' : 'Ir al Home'}
      </button>
    </div>
  </div>
  )}
    </div>
  );
}