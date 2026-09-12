import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './administrarComplejos.css';

function AdministrarComplejos() {
  const [complejos, setComplejos] = useState([]);
  const navigate = useNavigate();

  const handleEliminar = async (id) => {
    try {
      const response = await fetch(`/api/complejos/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Error deleting complejo');
      }
      setComplejos(complejos.filter((complejo) => complejo.id !== id));
    } catch (error) {
      console.error('Error deleting complejo:', error);
    }
  };

  useEffect(() => {
    fetch('/api/complejos') // Replace with your actual API endpoint
      .then((response) => response.json())
      .then((data) => setComplejos(data))
      .catch((error) => console.error('Error fetching complejos:', error));
  }, []);

  return (
    <main className='contenedor-administrarComplejos'>
      <div className='contenedor-administrarComplejos-header'>
        <button className='boton-administrarComplejos' onClick={() => navigate('/crear-complejo')}>Nuevo</button>
        <h1 className='titulo-administrarComplejos'>Complejos</h1>
      </div>
      <div className='contenedor-administrarComplejos-lista'>
        {complejos.map((complejo) => (
          <div key={complejo.id} className='complejo-item'>
            <h2>{complejo.nombre}</h2>
            <p>{complejo.direccion}</p>
            <button className='boton-administrarComplejos' onClick={() => navigate(`/editar-complejo/${complejo.id}`)}>Editar</button>
            <button className='boton-administrarComplejos' onClick={() => handleEliminar(complejo.id)}>Eliminar</button>
          </div>
        ))}
      </div>
    </main>
  );
}
export default AdministrarComplejos;