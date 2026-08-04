import './faq.css'

function Faq() {
  return(
    <main>
      <div className='contenedor-faq'>
      <h1 className='titulo-faq'>Preguntas frecuentes</h1>
      <ul  className='lista-faq'>
        <li>
          <h2>Qué es este sistema y a quién está dirigido?</h2>
            <p>Es una plataforma web pensada para simplificar y gestionar el alquiler de canchas deportivas. Está dirigida tanto a administradores de complejos deportivos que buscan organizar sus reservas y disponibilizar sus canchas, como a jugadores que desean encontrar y reservar canchas de manera rápida y sencilla.</p>
        </li>
        <li>
          <h2>Necesito registrarme para usar la plataforma?</h2>
            <p>Sí, para realizar una reserva o gestionar un complejo deportivo es necesario crear una cuenta. El registro es rápido y te permitirá acceder a tu historial de reservas, gestionar tus datos personales y recibir confirmaciones.</p>
        </li>
        <li>
          <h2>Cómo realizo la reserva de una cancha?</h2>
            <p>Inicia sesión en tu cuenta.
              Selecciona el deporte, el complejo deportivo, la fecha y el horario deseado.

              Elige la cancha disponible que prefieras.

              Confirma la reserva. Recibirás un resumen con los detalles de tu turno.
            </p>
        </li>
        <li>
          <h2>Puedo cancelar o modificar una reserva existente?</h2>
            <p>Sí. Desde la sección "Mis Reservas" de tu perfil puedes cancelar o modificar una reserva, siempre y cuando se realice con la anticipación mínima requerida por las políticas del complejo deportivo.</p>
        </li>
        <li>
          <h2>Soy dueño/administrador de un complejo, ¿cómo puedo publicar mis canchas?</h2>
            <p>Debes registrarte con un perfil de administrador o solicitar la alta de tu complejo dentro de la plataforma. Una vez activado tu perfil, podrás cargar la información de tu establecimiento, agregar canchas, definir horarios de atención y establecer las tarifas correspondientes.</p>
        </li>
        <li>
          <h2>Qué métodos de pago se aceptan?</h2>
            <p>La plataforma permite registrar y consultar el estado del pago de las reservas. Los medios de pago admitidos dependen de las opciones habilitadas por cada complejo, efectivo en el lugar, transferencia bancaria o medios de pago digitales integrados.</p>
        </li>
        <li>
          <h2>Qué hago si tengo un problema con mi reserva?</h2>
            <p>Ante cualquier inconveniente o duda sobre tu reserva, puedes comunicarte directamente con el complejo deportivo a través de la información de contacto provista en el detalle de la reserva o utilizar nuestro formulario de contacto/soporte técnico.</p>
        </li>
      </ul>
      </div>
    </main>
  )
}

export default Faq