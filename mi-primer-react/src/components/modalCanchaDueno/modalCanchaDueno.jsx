import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import './modalCanchaDueno.css';

// Función auxiliar para obtener la fecha de hoy en formato YYYY-MM-DD
const obtenerFechaHoy = () => {
  const hoy = new Date();
  return hoy.toISOString().split('T')[0];
};

export function ModalCanchaDueno({ isOpen, tipo, cancha, onClose, onConfirmar }) {
  if (!isOpen) return null;

  const esEdicion = tipo === 'EDITAR';
  const esCrear = tipo === 'CREAR';
  const esPrecio = tipo === 'PRECIO';

  const [deportes, setDeportes] = useState([]);
  useEffect(() => {
        const fetchDeportes = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/tipoCancha');
                if (response.ok) {
                    const data = await response.json();
                    setDeportes(data);
                }
            } catch (error) {
                console.error("Error al cargar los deportes:", error);
            }
        };
        fetchDeportes();
    }, []);

  // Estado para Cancha (Nro, Deporte y Estado)
  const [formCancha, setFormCancha] = useState({
    nro: '',
    tipoCanchaId: '',
    estado: 'Activo',
  });

  // Estado para Precios (con fechaDesde)
  const [formPrecio, setFormPrecio] = useState({
    fechaDesde: obtenerFechaHoy(),
    precioBase: '',
    precioAdicional: '',
    precioSena: '',
  });

  useEffect(() => {
    if (cancha) {
      // Cargar datos de la cancha para Editar
      setFormCancha({
        nro: cancha.nro || '',
        tipoCanchaId: cancha.tipoCancha?.id || '',
        estado: cancha.estado || 'Activo',
      });

      // Cargar datos de precio si ya existen
      const precioActual = cancha.precios?.[0] || {};
      
      let fechaFormateada = obtenerFechaHoy();
      if (precioActual.fechaDesde) {
        fechaFormateada = new Date(precioActual.fechaDesde).toISOString().split('T')[0];
      }

      setFormPrecio({
        fechaDesde: fechaFormateada,
        precioBase: precioActual.precioBase || '',
        precioAdicional: precioActual.precioAdicional || '',
        precioSena: precioActual.precioSena || '',
      });
    } else {
      // Reseteo para Crear
      setFormCancha({ nro: '', tipoCanchaId: '', estado: 'Activo' });
      setFormPrecio({
        fechaDesde: obtenerFechaHoy(),
        precioBase: '',
        precioAdicional: '',
        precioSena: '',
      });
    }
  }, [tipo, cancha]);

  const handleCanchaChange = (e) => {
    const { name, value } = e.target;
    setFormCancha((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrecioChange = (e) => {
    const { name, value } = e.target;
    setFormPrecio((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (esPrecio) {
      onConfirmar('PRECIO', { cancha, precios: formPrecio });
    } else {
      onConfirmar(tipo, { cancha, datos: formCancha });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            {esCrear && 'Agregar Nueva Cancha'}
            {esEdicion && `Editar Cancha N° ${cancha?.nro}`}
            {esPrecio && `Gestionar Precios - Cancha N° ${cancha?.nro}`}
          </h3>
          <button type="button" className="btn-cerrar-modal" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* --- MODAL CREAR / EDITAR CANCHA --- */}
        {(esCrear || esEdicion) && (
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-grupo">
              <label>Número / ID de Cancha</label>
              <input
                type="number"
                name="nro"
                value={formCancha.nro}
                onChange={handleCanchaChange}
                placeholder="Ej: 1"
                disabled={esEdicion} // Bloqueado si se está editando
                required
              />
            </div>

            <div className="form-grupo">
              <label>Deporte / Tipo de Cancha</label>
              <select
                name="tipoCanchaId"
                value={formCancha.tipoCanchaId}
                onChange={handleCanchaChange}
                required
              >
                <option value="">Seleccionar deporte</option>
                {deportes.map((dep) => (
                            <option key={dep.id} value={dep.id}>
                                {dep.deporte}
                            </option>
                        ))}
              </select>
            </div>

            <div className="form-grupo">
              <label>Estado</label>
              <select
                name="estado"
                value={formCancha.estado}
                onChange={handleCanchaChange}
                required
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
                <option value="Mantenimiento">Mantenimiento</option>
              </select>
            </div>

            <div className="modal-acciones">
              <button type="button" className="btn-cancelar" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn-guardar">
                {esEdicion ? 'Guardar Cambios' : 'Crear Cancha'}
              </button>
            </div>
          </form>
        )}

        {/* --- MODAL PRECIOS --- */}
        {esPrecio && (
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-grupo">
              <label>Fecha Desde</label>
              <input
                type="date"
                name="fechaDesde"
                value={formPrecio.fechaDesde}
                onChange={handlePrecioChange}
                required
              />
            </div>

            <div className="form-grupo">
              <label>Precio Base ($)</label>
              <input
                type="number"
                name="precioBase"
                value={formPrecio.precioBase}
                onChange={handlePrecioChange}
                placeholder="Ej: 25000"
                required
              />
            </div>

            <div className="form-grupo">
              <label>Precio Adicional ($)</label>
              <input
                type="number"
                name="precioAdicional"
                value={formPrecio.precioAdicional}
                onChange={handlePrecioChange}
                placeholder="Ej: 3000"
              />
            </div>

            <div className="form-grupo">
              <label>Precio Seña ($)</label>
              <input
                type="number"
                name="precioSena"
                value={formPrecio.precioSena}
                onChange={handlePrecioChange}
                placeholder="Ej: 10000"
                required
              />
            </div>

            <div className="modal-acciones">
              <button type="button" className="btn-cancelar" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn-guardar">
                Guardar Precios
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}