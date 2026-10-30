import React from 'react';
import './planes.css';

function Planes() {
    const planes = [
        {
            nombre: "Plan Base",
            canchas: "1 - 2 - 3 Canchas",
            precioViejo: "$71.000",
            precioActual: "$57.000",
            anual: "$ 684.000 por 12 meses",
            destacado: false
        },
        {
            nombre: "Plan Estándar",
            canchas: "4 - 5 - 6 Canchas",
            precioViejo: "$111.000",
            precioActual: "$89.000",
            anual: "$ 1.068.000 por 12 meses",
            destacado: true // Muestra la etiqueta "MÁS POPULAR"
        },
        {
            nombre: "Plan Full",
            canchas: "7 o más Canchas",
            precioViejo: "$145.000",
            precioActual: "$116.000",
            anual: "$ 1.392.000 por 12 meses",
            destacado: false
        }
    ];

    return (
        <section className="seccion-planes">
            <div className="contenedor-tarjetas">
                {planes.map((plan, index) => (
                    <div className="tarjeta-plan" key={index}>
                        <h3 className="titulo-plan">{plan.nombre}</h3>
                        <p className="subtitulo-canchas">{plan.canchas}</p>
                        <div className="bloque-precios">
                            <span className="precio-tachado">{plan.precioViejo}</span>
                            <div className="precio-destacado">
                                <h2>{plan.precioActual}</h2>
                                <span>/mes</span>
                            </div>
                            <p className="precio-anual">{plan.anual}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Planes;