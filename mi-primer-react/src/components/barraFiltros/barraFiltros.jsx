import React, { useState } from 'react';
import './barraFiltros.css';

export const BarraFiltros = ({ onFiltroCambio }) => {

    const [inputMin, setInputMin] = useState('');
    const [inputMax, setInputMax] = useState('');

    const aplicarFiltroManual = () => {
    const min = inputMin !== '' ? Number(inputMin) : 0;
    const max = inputMax !== '' ? Number(inputMax) : Infinity;
    
    onFiltroCambio({ min, max });
  };

  return (
    <div className="contenedor-filtros">
      <div className="seccion-filtro">
        <h3>Precio</h3>

        <div className="rango-precio">
          <input 
            type="number" 
            placeholder="Mínimo" 
            className="input-precio" 
            min="0"
            value={inputMin}
            onChange={(e) => setInputMin(e.target.value)}
          />
          <span className="separador">-</span>
          <input 
            type="number" 
            placeholder="Máximo" 
            className="input-precio" 
            min="0"
            value={inputMax}
            onChange={(e) => setInputMax(e.target.value)}
          />
          <button 
            className="btn-aplicar-precio" 
            onClick={aplicarFiltroManual}
          >
            ›
          </button>
        </div>

        <ul className="lista-precios">
          <li>
            <label>
              <input 
                type="radio" 
                name="rango-precio" 
                onChange={() => onFiltroCambio({ min: 0, max: 40000 })}
              /> 
              Hasta $40.000
            </label>
          </li>
          <li>
            <label>
              <input 
                type="radio" 
                name="rango-precio" 
                onChange={() => onFiltroCambio({ min: 40000, max: 60000 })}
              /> 
              $40.000 a $60.000
            </label>
          </li>
          <li>
            <label>
              <input 
                type="radio" 
                name="rango-precio" 
                onChange={() => onFiltroCambio({ min: 60000, max: Infinity })}
              /> 
              Más de $60.000
            </label>
          </li>
          <li>
            <label>
              <input 
                type="radio" 
                name="rango-precio" 
                onChange={() => onFiltroCambio({ min: 0, max: Infinity })}
              /> 
              Mostrar todos
            </label>
          </li>
        </ul>
      </div>
    </div>
  );
};