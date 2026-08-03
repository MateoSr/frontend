import { Link } from 'react-router-dom';
import './notfound.css';

function NotFound() {
  return (
    <div className="not-found-container">
      <h1 className="not-found-title">404</h1>
      <h2 className="not-found-subtitle">¡Uy! La página que buscás no existe.</h2>
      <p className="not-found-text">
        Parece que te equivocaste de jugada o la URL cambió.
      </p>
      
      <Link to="/" className="notfound-home">
        <strong>Volver al Inicio</strong>
      </Link>
    </div>
  );
}

export default NotFound;