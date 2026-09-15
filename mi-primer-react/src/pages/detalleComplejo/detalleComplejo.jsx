import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { HorariosCancha } from "../../components/horariosCancha/horariosCancha";
import imagenComplejo from "../../assets/foto-complejo-AlAngulo.jpg";
import { obtenerDetalleComplejo } from "../../services/complejosService";
import "./detalleComplejo.css";

const diasSemana = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sabado",
];

function formatearHora(valor) {
    if (typeof valor !== "string") return "-";

    const coincidencia = valor.match(/(?:T|^)(\d{1,2}):(\d{2})/);
    return coincidencia ? `${coincidencia[1].padStart(2, "0")}:${coincidencia[2]}` : valor;
}

function DetalleComplejo() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const [complejo, setComplejo] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        const cargarComplejo = async () => {
            setCargando(true);
            setError("");

            try {
                const data = await obtenerDetalleComplejo(id, controller.signal);
                setComplejo(data);
            } catch (fetchError) {
                if (fetchError.name !== "AbortError") {
                    setError(fetchError.message);
                    setComplejo(null);
                }
            } finally {
                if (!controller.signal.aborted) setCargando(false);
            }
        };

        if (id) cargarComplejo();
        else {
            setError("No se recibio el id del complejo.");
            setCargando(false);
        }

        return () => controller.abort();
    }, [id]);

    if (cargando) return <p className="detalle-complejo-estado">Cargando complejo...</p>;
    if (error) return <p className="detalle-complejo-estado">{error}</p>;
    if (!complejo) return null;

    return (
        <main className="detalle-complejo">
            <img
                className="detalle-complejo-imagen"
                src={complejo.imagenUrl || imagenComplejo}
                alt={`Imagen de ${complejo.nombre}`}
            />
            <h1 className="detalle-complejo-nombre">{complejo.nombre}</h1>
            <HorariosCancha
                complejo={complejo}
                fechaActual={searchParams.get("fecha") || new Date().toISOString().slice(0, 10)}
            />
            <details className="detalle-complejo-acordeon" open>
                <summary>Ubicación</summary>
                <div className="contenido-acordeon">
                    <p>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', verticalAlign: 'text-bottom' }}>
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        {complejo.direccion}
                        {complejo.localidad?.nombre ? `, ${complejo.localidad.nombre}` : ""}
                    </p>
                </div>
            </details>
            <details className="detalle-complejo-acordeon" open>
                <summary>Horarios del Club</summary>
                <div className="contenido-acordeon">
                    {(complejo.horarios ?? []).map((horario) => (
                        <div className="horario-fila" key={`${horario.complejoId}-${horario.nroDia}`}>
                            <strong>{diasSemana[horario.nroDia]}</strong>
                            <span>{formatearHora(horario.horaApertura)} a {formatearHora(horario.horaCierre)}</span>
                        </div>
                    ))}
                </div>
            </details>
        </main>
    );
}

export default DetalleComplejo;