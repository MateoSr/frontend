import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fechaArgentinaHoyISO } from '../../utils/fechas';
import './barra.css'

const HORARIOS = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
    "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
    "21:00", "21:30", "22:00", "22:30", "23:00", "23:30"
];

function getHoraActualAR() {
    const ahora = new Date();
    const enAR = new Date(ahora.getTime() - 3 * 60 * 60 * 1000);
    return enAR.toISOString().slice(11, 16);
}

function BarraBusqueda() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const hoyAR = fechaArgentinaHoyISO();
    const horaActualAR = getHoraActualAR();

    const [deportes, setDeportes] = useState([]);
    const deporteActual = searchParams.get('deporte') || '';
    const [deporteSeleccionado, setDeporteSeleccionado] = useState(deporteActual);

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

    const ciudadActual = searchParams.get('ciudad') || '';
    const fechaActual = searchParams.get('fecha') || '';
    const fechaPorDefecto = fechaActual && fechaActual >= hoyAR ? fechaActual : hoyAR;
    const horaActual = searchParams.get('hora') || '';

    const [fechaSeleccionada, setFechaSeleccionada] = useState(fechaPorDefecto);
    const [horaSeleccionada, setHoraSeleccionada] = useState(horaActual);

    useEffect(() => {
        setDeporteSeleccionado(deporteActual);
    }, [deporteActual]);

    useEffect(() => {
        if (fechaSeleccionada === hoyAR && horaSeleccionada && horaSeleccionada < horaActualAR) {
            const primeroDisponible = HORARIOS.find(h => h >= horaActualAR);
            setHoraSeleccionada(primeroDisponible || '');
        }
    }, [fechaSeleccionada, hoyAR, horaActualAR, horaSeleccionada]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const ciudad = formData.get('ciudad');
        const deporte = formData.get('deporte');
        let fecha = formData.get('fecha') || fechaSeleccionada;
        let hora = formData.get('hora') || horaSeleccionada;

        if (fecha && fecha < hoyAR) {
            fecha = hoyAR;
            setFechaSeleccionada(fecha);
        }

        if (fecha === hoyAR && hora && hora < horaActualAR) {
            const primeroDisponible = HORARIOS.find(h => h >= horaActualAR);
            hora = primeroDisponible || '';
            setHoraSeleccionada(hora);
        }

        const params = new URLSearchParams();
        if (ciudad) params.set('ciudad', ciudad);
        if (deporte) params.set('deporte', deporte);
        if (fecha) params.set('fecha', fecha);
        if (hora) params.set('hora', hora);
        navigate(`/complejos?${params.toString()}`);
    };

    return (
        <div className='barraBusqueda-contenedor'>
            <form className='barraBusqueda-form' onSubmit={handleSubmit}>
                <div className='filtro-form'>
                    <svg className='icon' viewBox="0 0 24 24" width="24" height="24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                    <input name='ciudad' type='text' placeholder='Buscar ciudad' defaultValue={ciudadActual} required></input>
                </div>
                <div className='filtro-form'>
                    <svg className='icon' viewBox="0 0 24 24" width="24" height="24"><circle cx="12" cy="12" r="10" /><path d="M12 2v20M2 12h20" /><path d="M6.2 6.2c3.2 3.2 3.2 8.4 0 11.6" /><path d="M17.8 6.2c-3.2 3.2-3.2 8.4 0 11.6" /></svg>
                    <select
                        name='deporte'
                        className="filtro-select"
                        value={deporteSeleccionado}
                        onChange={(e) => setDeporteSeleccionado(e.target.value)}
                        required
                    >
                        <option value="" disabled hidden>
                            Seleccionar un deporte
                        </option>
                        {deportes.map((dep) => (
                            <option key={dep.id} value={dep.id}>
                                {dep.deporte}
                            </option>
                        ))}
                    </select>
                </div>
                <div className='filtro-form'>
                    <svg className='icon' viewBox="0 0 24 24" width="24" height="24"><path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" /><path d="M16 2V6" /><path d="M8 2V6" /><path d="M3 10H21" /></svg>
                    <input name='fecha' type='date' min={hoyAR} style={{ color: "gray" }} value={fechaSeleccionada} onChange={(e) => setFechaSeleccionada(e.target.value)} required></input>
                </div>
                <div className='filtro-form'>
                    <svg className='icon' viewBox="0 0 24 24" width="24" height="24"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 12" /></svg>
                    <select name='hora' required className="filtro-select" value={horaSeleccionada} onChange={(e) => setHoraSeleccionada(e.target.value)}>
                        <option value="" disabled hidden style={{ color: "gray" }}>Seleccionar un Horario</option>
                        {HORARIOS.map((h) => {
                            const esHoy = fechaSeleccionada === hoyAR;
                            const deshabilitado = esHoy && h < horaActualAR;
                            return (
                                <option key={h} value={h} disabled={deshabilitado}>
                                    {h}
                                </option>
                            );
                        })}
                    </select>
                </div>
                <div className='filtro-form'>
                    <button className='boton' type='submit'>Buscar</button>
                </div>
            </form>
        </div>
    )
}

export default BarraBusqueda

