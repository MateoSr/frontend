const API_URL = 'http://localhost:3000/api';

const obtenerJson = async (url, options = {}) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    let mensaje = 'Error en el proceso de pago';
    try {
      const data = await response.json();
      mensaje = data.message || mensaje;
    } catch (_) {}
    throw new Error(mensaje);
  }
  return response.json();
};

export const crearOrdenPago = async (datos, token) => obtenerJson(`${API_URL}/pagos/crear-orden`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  },
  body: JSON.stringify(datos)
});

export const consultarEstadoOrden = async (externalReference, token) => obtenerJson(`${API_URL}/pagos/estado/${externalReference}`, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
