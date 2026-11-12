import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import BarraBusqueda from '../../components/barraBusqueda/barra';
import { BarraFiltros } from '../../components/barraFiltros/barraFiltros';
import { GrillaComplejos } from '../../components/grillaComplejos/grillaComplejos';
import Paginacion from '../../components/paginacion/paginacion';
import { useComplejos } from '../../hooks/useComplejos';
import './complejos.css';

export const Complejos = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const ordenActual = searchParams.get('sort') || 'relevantes';
  const paginaActual = Math.max(1, Number(searchParams.get('page')) || 1);
  const queryString = searchParams.toString();
  const { complejos, total, totalPaginas, cargando, error } = useComplejos(queryString);

  useEffect(() => {
    if (cargando) {
      return;
    }

    if (totalPaginas > 0 && paginaActual > totalPaginas) {
      const nuevosParametros = new URLSearchParams(searchParams);
      nuevosParametros.set('page', String(totalPaginas));
      setSearchParams(nuevosParametros, { replace: true });
      return;
    }

    if (totalPaginas === 0 && paginaActual > 1) {
      const nuevosParametros = new URLSearchParams(searchParams);
      nuevosParametros.delete('page');
      setSearchParams(nuevosParametros, { replace: true });
    }
  }, [cargando, paginaActual, totalPaginas, searchParams, setSearchParams]);

  const cambiarOrden = (e) => {
    const nuevoOrden = e.target.value;

    const nuevosParametros = new URLSearchParams(searchParams);
    nuevosParametros.set('sort', nuevoOrden);
    nuevosParametros.delete('page');
    setSearchParams(nuevosParametros);
  };

  const aplicarFiltroPrecio = ({ min: nuevoMin, max: nuevoMax }) => {
    const nuevosParametros = new URLSearchParams(searchParams);
    nuevosParametros.set('min', nuevoMin);

    if (nuevoMax === Infinity) {
      nuevosParametros.delete('max');
    } else {
      nuevosParametros.set('max', nuevoMax);
    }

    nuevosParametros.set('sort', ordenActual);
    nuevosParametros.delete('page');
    setSearchParams(nuevosParametros);
  };

  const cambiarPagina = (nuevaPagina) => {
    const nuevosParametros = new URLSearchParams(searchParams);
    nuevosParametros.set('page', String(nuevaPagina));
    setSearchParams(nuevosParametros);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
            <h1>{cargando ? 'Buscando complejos...' : `${total} complejos encontrados`}</h1>
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
          {error ? (
            <p>{error}</p>
          ) : (
            <>
              <GrillaComplejos complejos={complejos} />
              <Paginacion
                paginaActual={paginaActual}
                totalPaginas={totalPaginas}
                onCambiarPagina={cambiarPagina}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Complejos;
