import React from 'react';
import { TarjetaComplejo } from '../tarjetaComplejo/tarjetaComplejo'; 
import './grillaComplejos.css';

export const GrillaComplejos = ({ complejos }) => {
  if (!complejos || complejos.length === 0) {
    return (
      <div className="mensaje-vacio">
        <p>No se encontraron complejos con esos filtros.</p>
      </div>
    );
  }
  return (
    <div className="contenedor-grilla">
      {complejos.map((complejo) => (
        <TarjetaComplejo key={complejo.id} complejo={complejo} />
      ))}
    </div>
  );
};