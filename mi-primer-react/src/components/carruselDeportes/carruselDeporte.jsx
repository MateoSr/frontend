import "./carruselDeporte.css";
import { useState, useEffect } from "react";
import futbol from "../../assets/futbol.png";
import padel from "../../assets/padel.png";
import tenis from "../../assets/tenis.png";
import basquet from "../../assets/basquet.png";
import volley from "../../assets/volley.png";
import hockey from "../../assets/hockey.png";
import './carruselDeporte.css';

const imagenesOriginales = [futbol, basquet, volley, hockey, tenis, padel];

function CarruselDeporte() {    
    const [paso, setPaso] = useState(0);
    const [conTransicion, setConTransicion] = useState(true);

    const imagenesVisibles = 4; 
    const porcentajePorImagen = 100 / imagenesVisibles;

    const imagenesDuplicadas = [
    ...imagenesOriginales,
    ...imagenesOriginales.slice(0, imagenesVisibles)
    ];

    useEffect(() => {
    const interval = setInterval(() => {
        setConTransicion(true);
        setPaso((prev) => prev + 1);
    }, 3000);

    return () => clearInterval(interval);
    }, []);

    const manejarFinTransicion = () => {

    if (paso >= imagenesOriginales.length) {
        setConTransicion(false);
        setPaso(0);
    }
    };

    return (
    <div className="carrusel-ancho-contenedor">
        <h2>Nuestros deportes</h2>
    <div 
        className="carrusel-ancho-cinta"
        onTransitionEnd={manejarFinTransicion}
        style={{ 
            transform: `translate3d(-${paso * porcentajePorImagen}%, 0, 0)`,
            transition: conTransicion ? 'transform 0.8s ease-in-out' : 'none' 
        }}
    >
    {imagenesDuplicadas.map((img, index) => (
        <div 
            className="carrusel-ancho-item" 
            key={index} 
            style={{ width: `${porcentajePorImagen}%` }}
        >
            <img src={img} alt={`png-${index}`} />
        </div>
        ))}
    </div>
    </div>
    );
}

export default CarruselDeporte;