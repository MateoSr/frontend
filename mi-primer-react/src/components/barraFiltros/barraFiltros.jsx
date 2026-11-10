import { useState } from 'react';
import './barraFiltros.css';

export const BarraFiltros = ({ onFiltroCambio }) => {

    const [inputMin, setInputMin] = useState('');
    const [inputMax, setInputMax] = useState('');

    const soloDigitos = (valor) => valor.replace(/\D/g, '');

    const parsearPrecio = (valor, porDefecto) => {
      const limpio = valor.trim();
      if (limpio === '') return porDefecto;
      const numero = Number(limpio);
      return Number.isFinite(numero) ? numero : porDefecto;
    };

    const aplicarFiltroManual = () => {
      const min = parsearPrecio(inputMin, 0);
      const max = parsearPrecio(inputMax, Infinity);

      // Si el usuario invirtió los valores, los ordenamos.
      if (max !== Infinity && min > max) {
        onFiltroCambio({ min: max, max: min });
        return;
      }

      onFiltroCambio({ min, max });
    };

  return (
    <div className="contenedor-filtros">
      <div className="seccion-filtro">
        <h3>Precio</h3>

        <div className="rango-precio">
          <input 
            type="text" 
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            placeholder="Mínimo" 
            className="input-precio" 
            value={inputMin}
            onChange={(e) => setInputMin(soloDigitos(e.target.value))}
          />
          <span className="separador">-</span>
          <input 
            type="text" 
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            placeholder="Máximo" 
            className="input-precio" 
            value={inputMax}
            onChange={(e) => setInputMax(soloDigitos(e.target.value))}
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