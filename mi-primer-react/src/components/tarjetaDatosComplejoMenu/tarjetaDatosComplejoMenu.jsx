import { useState, useEffect } from 'react';
import { MapPin, Phone, Building2, Edit2, Check, X } from 'lucide-react';
import './tarjetaDatosComplejoMenu.css';

export function TarjetaDatosComplejoMenu({ complejo, onGuardar }) {
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    instagram: '',
  });

  useEffect(() => {
    if (complejo) {
      setForm({
        nombre: complejo.nombre || '',
        direccion: complejo.direccion || '',
        telefono: complejo.telefono || '',
        instagram: complejo.instagram || '',
      });
    }
  }, [complejo]);

  if (!complejo) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (onGuardar) {
      await onGuardar(form);
    }
    setEditando(false);
  };

  const handleCancelar = () => {
    setForm({
      nombre: complejo.nombre || '',
      direccion: complejo.direccion || '',
      telefono: complejo.telefono || '',
      instagram: complejo.instagram || '',
    });
    setEditando(false);
  };

  return (
    <div className="tarjeta-datos-complejo-menu">
      <div className="tarjeta-datos-complejo-menu-header">
        <div className="tarjeta-datos-complejo-menu-info-principal">
          <div className="tarjeta-datos-complejo-menu-icono">
            <Building2 size={26} />
          </div>
          <div>
            <h1 className="tarjeta-datos-complejo-menu-titulo">{complejo.nombre}</h1>
            <span className="tarjeta-datos-complejo-menu-subtitulo">Información del complejo</span>
          </div>
        </div>

        {!editando && (
          <button
            type="button"
            className="btn-editar-datos-complejo"
            onClick={() => setEditando(true)}
            title="Editar datos del complejo"
          >
            <Edit2 size={16} />
            <span>Editar</span>
          </button>
        )}
      </div>

      {!editando ? (
        /* --- MODO LECTURA --- */
        <div className="tarjeta-datos-complejo-menu-detalles">
          <div className="item-detalle-datos-complejo">
            <MapPin size={18} className="icono-detalle-datos-complejo" />
            <span>
              {complejo.direccion}, {complejo.localidad?.nombre || 'Sin localidad'}
            </span>
          </div>

          <div className="item-detalle-datos-complejo">
            <Phone size={18} className="icono-detalle-datos-complejo" />
            <span>{complejo.telefono || 'Sin teléfono'}</span>
          </div>

          <div className="item-detalle-datos-complejo">
            <span>
              {complejo.instagram
                ? `@${complejo.instagram.replace('@', '')}`
                : 'Sin Instagram'}
            </span>
          </div>
        </div>
      ) : (
        /* --- MODO EDICIÓN --- */
        <form onSubmit={handleSubmit} className="form-editar-datos-complejo">
          <div className="grilla-form-datos-complejo">
            <div className="campo-datos-complejo">
              <label>Nombre del Complejo</label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="campo-datos-complejo">
              <label>Dirección</label>
              <input
                type="text"
                name="direccion"
                value={form.direccion}
                onChange={handleChange}
                required
              />
            </div>

            <div className="campo-datos-complejo">
              <label>Teléfono</label>
              <input
                type="text"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                placeholder="Ej: 3444123123"
              />
            </div>

            <div className="campo-datos-complejo">
              <label>Instagram</label>
              <input
                type="text"
                name="instagram"
                value={form.instagram}
                onChange={handleChange}
                placeholder="Ej: usuario_club"
              />
            </div>
          </div>

          <div className="acciones-form-datos-complejo">
            <button type="submit" className="btn-guardar-datos-complejo" title="Guardar cambios">
              <Check size={16} /> Guardar
            </button>
            <button
              type="button"
              className="btn-cancelar-datos-complejo"
              onClick={handleCancelar}
              title="Cancelar"
            >
              <X size={16} /> Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}