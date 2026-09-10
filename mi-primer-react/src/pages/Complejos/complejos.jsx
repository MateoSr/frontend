import React from 'react';
import { useSearchParams } from 'react-router-dom';
import BarraBusqueda from '../../components/barraBusqueda/barra';
import { BarraFiltros } from '../../components/barraFiltros/barraFiltros';
import { GrillaComplejos } from '../../components/grillaComplejos/grillaComplejos';
import { complejosDisponibles } from '../../datosDePrueba';
import './complejos.css';

export const Complejos = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const min = Number(searchParams.get('min')) || 0;
  const max = Number(searchParams.get('max')) || Infinity;
  const ordenActual = searchParams.get('sort') || 'relevantes';

  const cambiarOrden = (e) => {
    const nuevoOrden = e.target.value;

    setSearchParams({ min, max, sort: nuevoOrden });
  };

  const aplicarFiltroPrecio = ({ min: nuevoMin, max: nuevoMax }) => {
    setSearchParams({
      min: nuevoMin,
      max: nuevoMax === Infinity ? '' : nuevoMax,
      sort: ordenActual,
    });
  };

  const complejosFiltrados = complejosDisponibles.filter((complejo) => {
    return complejo.precio >= min && complejo.precio <= max;
  });

  const complejosOrdenados = [...complejosFiltrados].sort((a, b) => {
    if (ordenActual === 'precio_menor') {
      return a.precio - b.precio;
    }
    if (ordenActual === 'precio_mayor') {
      return b.precio - a.precio;
    }
    if (ordenActual === 'nombre_az') {
      return a.nombre.localeCompare(b.nombre);
    }
    if (ordenActual === 'nombre_za') {
      return b.nombre.localeCompare(a.nombre);
    }
    return 0;
  });

  return (
    <div className="contenedor-pagina">
      <div className="barra-busqueda">
      <BarraBusqueda></BarraBusqueda>
      </div>
      <div className="contenido-principal">
        <aside className="columna-filtros">
          <BarraFiltros onFiltroCambio={aplicarFiltroPrecio} />
        </aside>
        <main className="seccion-resultados">
          <div className="encabezado-resultados">
            <h1>{complejosOrdenados.length} complejos encontrados</h1>
            <div className="selector-orden">
              Ordenar por:
              <select value={ordenActual} onChange={cambiarOrden}>
                <option value="relevantes">Más relevantes</option>
                <option value="precio_menor">Menor precio</option>
                <option value="precio_mayor">Mayor precio</option>
                <option value="nombre_az">Nombre (A - Z)</option>
                <option value="nombre_za">Nombre (Z - A)</option>
              </select>
            </div>
          </div>

          <GrillaComplejos complejos={complejosOrdenados} />
        </main>
      </div>
    </div>
  );
};

export default Complejos;