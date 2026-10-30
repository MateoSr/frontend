import { useEffect, useState } from 'react';
import { obtenerComplejos } from '../services/complejosService';

export const useComplejos = (queryString) => {
  const [complejos, setComplejos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const cargarComplejos = async () => {
      setCargando(true);
      setError('');

      try {
        const data = await obtenerComplejos(queryString, controller.signal);
        setComplejos(data);
      } catch (fetchError) {
        if (fetchError.name === 'AbortError') {
          return;
        }

        console.error('Error al cargar los complejos:', fetchError);
        setComplejos([]);
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

  return { complejos, cargando, error };
};