/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, XCircle, Info, AlertTriangle } from 'lucide-react';
import './modalGlobal.css';

const ModalContext = createContext(null);

const ICONOS = {
  exito: CheckCircle2,
  error: XCircle,
  info: Info,
  pregunta: AlertTriangle,
  peligro: AlertTriangle,
};

export function ModalProvider({ children }) {
  const [feedback, setFeedback] = useState(null);
  const [confirmacion, setConfirmacion] = useState(null);

  const mostrarModal = useCallback(({ titulo, mensaje, tipo = 'info' } = {}) => {
    return new Promise((resolve) => {
      setFeedback({ titulo, mensaje, tipo, resolver: resolve });
    });
  }, []);

  const confirmar = useCallback(
    ({
      titulo = 'Confirmar',
      mensaje,
      tipo = 'pregunta',
      textoConfirmar = 'Aceptar',
      textoCancelar = 'Cancelar',
    } = {}) => {
      return new Promise((resolve) => {
        setConfirmacion({ titulo, mensaje, tipo, textoConfirmar, textoCancelar, resolver: resolve });
      });
    },
    []
  );

  const cerrarFeedback = useCallback(() => {
    if (!feedback) return;
    feedback.resolver?.();
    setFeedback(null);
  }, [feedback]);

  const resolverConfirmacion = useCallback(
    (valor) => {
      if (!confirmacion) return;
      confirmacion.resolver?.(valor);
      setConfirmacion(null);
    },
    [confirmacion]
  );

  const value = useMemo(() => ({ mostrarModal, confirmar }), [mostrarModal, confirmar]);

  return (
    <ModalContext.Provider value={value}>
      {children}
      {feedback && createPortal(<FeedbackModal {...feedback} onCerrar={cerrarFeedback} />, document.body)}
      {confirmacion &&
        createPortal(<ConfirmacionModal {...confirmacion} onResolver={resolverConfirmacion} />, document.body)}
    </ModalContext.Provider>
  );
}

function FeedbackModal({ titulo, mensaje, tipo, onCerrar }) {
  const Icono = ICONOS[tipo] || Info;

  return (
    <div className="modal-global-overlay" onClick={onCerrar}>
      <div className="modal-global-contenido" onClick={(e) => e.stopPropagation()}>
        <div className={`modal-global-icono modal-global-icono-${tipo}`}>
          <Icono size={44} />
        </div>
        {titulo && <h2>{titulo}</h2>}
        <p>{mensaje}</p>
        <button type="button" className="modal-global-btn modal-global-btn-primario" onClick={onCerrar}>
          Aceptar
        </button>
      </div>
    </div>
  );
}

function ConfirmacionModal({ titulo, mensaje, tipo, textoConfirmar, textoCancelar, onResolver }) {
  const Icono = ICONOS[tipo] || AlertTriangle;

  return (
    <div className="modal-global-overlay" onClick={() => onResolver(false)}>
      <div className="modal-global-contenido" onClick={(e) => e.stopPropagation()}>
        <div className={`modal-global-icono modal-global-icono-${tipo}`}>
          <Icono size={44} />
        </div>
        {titulo && <h2>{titulo}</h2>}
        <p>{mensaje}</p>
        <div className="modal-global-acciones">
          <button
            type="button"
            className="modal-global-btn modal-global-btn-secundario"
            onClick={() => onResolver(false)}
          >
            {textoCancelar}
          </button>
          <button
            type="button"
            className={`modal-global-btn ${
              tipo === 'peligro' ? 'modal-global-btn-peligro' : 'modal-global-btn-primario'
            }`}
            onClick={() => onResolver(true)}
          >
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}

export function useModal() {
  const contexto = useContext(ModalContext);
  if (!contexto) {
    throw new Error('useModal debe usarse dentro de un <ModalProvider>');
  }
  return contexto;
}
