import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { consultarEstadoOrden } from "../../services/pagoService";
import "./pagoResultado.css";

export default function PagoResultado() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [estado, setEstado] = useState("cargando");
  const [mensaje, setMensaje] = useState("Consultando el estado de tu pago...");

  const externalReference =
    searchParams.get("external_reference") ||
    searchParams.get("externalReference") ||
    searchParams.get("merchant_order_id");

  useEffect(() => {
    let activo = true;

    const consultar = async () => {
      const token = localStorage.getItem("gestor_token");
      if (!token || !externalReference) {
        if (activo) {
          setEstado("rechazado");
          setMensaje("No pudimos identificar la orden de pago.");
        }
        return;
      }

      for (let intento = 0; intento < 10 && activo; intento += 1) {
        try {
          const resp = await consultarEstadoOrden(externalReference, token);
          if (!activo) return;

          setEstado(resp.estado);
          if (resp.estado === "aprobada") {
            setMensaje("¡Pago aprobado! Tu reserva quedó confirmada. Te enviamos el comprobante por email.");
            return;
          } else if (resp.estado === "pendiente") {
            setMensaje("Tu pago está pendiente de acreditación. Estamos esperando la confirmación...");
          } else if (resp.estado === "reembolsada") {
            setMensaje("El pago fue acreditado, pero el horario ya fue ocupado por otra reserva. Te contactaremos para el reembolso correspondiente.");
          } else if (resp.estado === "expirada") {
            setMensaje("La orden de pago expiró. Podés volver a seleccionar el horario para intentar nuevamente.");
          } else {
            setMensaje("El pago no fue aprobado. Podés intentar nuevamente desde los horarios disponibles.");
          }

          if (resp.estado !== "pendiente") return;
          await new Promise((resolve) => setTimeout(resolve, 2000));
        } catch (error) {
          if (activo) {
            setEstado("rechazado");
            setMensaje("Ocurrió un error al consultar el estado del pago.");
          }
          return;
        }
      }
    };
    consultar();

    return () => {
      activo = false;
    };
  }, [externalReference]);

  const getIcono = () => {
    if (estado === "aprobada") return "✅";
    if (estado === "pendiente") return "⏳";
    if (estado === "cargando") return "🔄";
    return "❌";
  };

  const irAMisTurnos = () => {
    navigate("/perfil");
  };

  const irAHorarios = () => {
    navigate("/complejos");
  };

  return (
    <div className="pago-resultado-container">
      <div className={`pago-resultado-card ${estado}`}>
        <div className="pago-resultado-icono">{getIcono()}</div>
        <h1 className="pago-resultado-titulo">
          {estado === "aprobada" && "Pago aprobado"}
          {estado === "pendiente" && "Pago pendiente"}
          {(estado === "rechazada" || estado === "cancelada") && "Pago rechazado"}
          {estado === "reembolsada" && "Reserva no confirmada"}
          {estado === "expirada" && "Orden expirada"}
          {estado === "cargando" && "Procesando"}
        </h1>
        <p className="pago-resultado-mensaje">{mensaje}</p>
        <div className="pago-resultado-botones">
          {estado === "aprobada" && (
            <button className="pago-resultado-boton primario" onClick={irAMisTurnos}>
              Ver mis turnos
            </button>
          )}
          <button className="pago-resultado-boton secundario" onClick={irAHorarios}>
            Volver a complejos
          </button>
        </div>
      </div>
    </div>
  );
}
