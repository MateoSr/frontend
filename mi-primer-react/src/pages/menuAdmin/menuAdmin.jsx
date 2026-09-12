import { useNavigate } from 'react-router-dom';
import './menuAdmin.css';

function MenuAdmin() {
  const navigate = useNavigate();
  return (
    <main className='contenedor-menuAdmin'>
      <h1 className='titulo-menuAdmin'>Menu Admin</h1>
      <div className='contenedor-menuAdmin-boton'>
        <button className='boton-menuAdmin' onClick={() => navigate('/administrar-complejos')}>Gestionar Complejos</button>
        <button className='boton-menuAdmin' onClick={() => navigate('/administrar-usuarios')}>Gestionar Usuarios</button>
      </div>
    </main>
  )
}
export default MenuAdmin