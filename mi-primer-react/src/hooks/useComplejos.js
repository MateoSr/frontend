import { useEffect, useState } from 'react';
import { obtenerComplejos } from '../services/complejosService';

export const useComplejos = (queryString) => {
  const [complejos, setComplejos] = useState([]);
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const cargarComplejos = async () => {
      setCargando(true);
      setError('');

      try {
        const resultado = await obtenerComplejos(queryString, controller.signal);
        setComplejos(resultado.data);
        setTotal(resultado.total);
        setPagina(resultado.page);
        setTotalPaginas(resultado.totalPages);
      } catch (fetchError) {
        if (fetchError.name === 'AbortError') {
          return;
        }

        console.error('Error al cargar los complejos:', fetchError);
        setComplejos([]);
        setTotal(0);
        setPagina(1);
        setTotalPaginas(0);
        setError('No se pudieron cargar los complejos.');
      } finally {
        if (!controller.signal.aborted) {
          setCargando(false);
        }
      }
    };

    cargarComplejos();

    return () => controller.abort();
  }, [queryString]);

  return { complejos, total, pagina, totalPaginas, cargando, error };
};
