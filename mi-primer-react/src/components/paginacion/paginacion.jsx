import './paginacion.css';

const construirPaginas = (actual, total) => {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const paginas = new Set([1, total, actual - 1, actual, actual + 1]);
  const ordenadas = [...paginas]
    .filter((pagina) => pagina >= 1 && pagina <= total)
    .sort((a, b) => a - b);

  const resultado = [];
  let anterior = 0;

  for (const pagina of ordenadas) {
    if (anterior && pagina - anterior > 1) {
      resultado.push(`elipsis-${pagina}`);
    }
    resultado.push(pagina);
    anterior = pagina;
  }

  return resultado;
};

export const Paginacion = ({ paginaActual, totalPaginas, onCambiarPagina }) => {
  if (!totalPaginas || totalPaginas <= 1) {
    return null;
  }

  const paginas = construirPaginas(paginaActual, totalPaginas);

  return (
    <nav className="paginacion" aria-label="Paginación de complejos">
      <button
        type="button"
        className="paginacion-boton"
        onClick={() => onCambiarPagina(paginaActual - 1)}
        disabled={paginaActual <= 1}
        aria-label="Página anterior"
      >
        Anterior
      </button>

      <ul className="paginacion-lista">
        {paginas.map((pagina) =>
          typeof pagina === 'number' ? (
            <li key={pagina}>
              <button
                type="button"
                className={`paginacion-numero${pagina === paginaActual ? ' activo' : ''}`}
                onClick={() => onCambiarPagina(pagina)}
                aria-current={pagina === paginaActual ? 'page' : undefined}
              >
                {pagina}
              </button>
            </li>
          ) : (
            <li key={pagina} className="paginacion-elipsis" aria-hidden="true">
              …
            </li>
          )
        )}
      </ul>

      <button
        type="button"
        className="paginacion-boton"
        onClick={() => onCambiarPagina(paginaActual + 1)}
        disabled={paginaActual >= totalPaginas}
        aria-label="Página siguiente"
      >
        Siguiente
      </button>
    </nav>
  );
};

export default Paginacion;
