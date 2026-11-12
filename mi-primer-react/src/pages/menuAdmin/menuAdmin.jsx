import { useNavigate } from 'react-router-dom';
import './menuAdmin.css';

function MenuAdmin() {
  const navigate = useNavigate();
  return (
    <main className='contenedor-menuAdmin'>
      <h1 className='titulo-menuAdmin'>Menú admin</h1>
      <div className='contenedor-menuAdmin-boton'>
        <button className='boton-menuAdmin' onClick={() => navigate('/administrar-complejos')}>Gestionar complejos</button>
        <button className='boton-menuAdmin' onClick={() => navigate('/administrar-usuarios')}>Gestionar usuarios</button>
      </div>
    </main>
  )
}
export default MenuAdmin