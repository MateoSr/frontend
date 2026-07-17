import './barra.css'

function BarraBusqueda(){
    return(
        <div className='barraBusqueda-contenedor'>
            <form className='barraBusqueda-form'>
            <div className='filtro-form'>
                <svg className='icon'viewBox="0 0 24 24" width="24" height="24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                <input name='ciudad' type='text' placeholder='Buscar Ciudad' required></input>
            </div>
            <div className='filtro-form'>
                <svg className='icon'viewBox="0 0 24 24" width="24" height="24"><circle cx="12" cy="12" r="10"/><path d="M12 2v20M2 12h20"/><path d="M6.2 6.2c3.2 3.2 3.2 8.4 0 11.6" /><path d="M17.8 6.2c-3.2 3.2-3.2 8.4 0 11.6" /></svg>
                <select name='deporte'className="filtro-select"required>
                    <option value="" disabled selected hidden>Seleccionar un Deporte</option>
                    <option value="futbol">Fútbol 5</option>
                    <option value="futbol">Fútbol 7</option>
                    <option value="futbol">Fútbol 11</option>
                    <option value="futbol">Tenis</option>
                    <option value="futbol">Basket</option>
                    <option value="futbol">Futsal</option>
                    <option value="futbol">Hockey</option>
                    <option value="futbol">Voley</option>
                    <option value="padel">Pádel</option>
                </select>
            </div>
            <div className='filtro-form'>
                <svg className='icon'viewBox="0 0 24 24" width="24" height="24"><path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z"/><path d="M16 2V6"/><path d="M8 2V6"/><path d="M3 10H21"/></svg>
                <input name='fecha'type='date' style={{color:"gray"}}required></input>
            </div>
            <div className='filtro-form'>
                <svg className='icon'viewBox="0 0 24 24" width="24" height="24"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 12" /></svg>
                <select name='hora'required className="filtro-select">
                    <option value=""disabled selected hidden style={{color:"gray"}}>Seleccionar un Horario</option>
                    <option value="09:00">09:00</option>
                    <option value="09:30">09:30</option>
                    <option value="10:00">10:00</option>
                    <option value="10:30">10:30</option>
                    <option value="11:00">11:00</option>
                    <option value="11:30">11:30</option>
                    <option value="12:00">12:00</option>
                    <option value="12:30">12:30</option>
                    <option value="13:00">13:00</option>
                    <option value="13:30">13:30</option>
                    <option value="14:00">14:00</option>
                    <option value="14:30">14:30</option>
                    <option value="15:00">15:00</option>
                    <option value="15:30">15:30</option>
                    <option value="16:00">16:00</option>
                    <option value="16:30">16:30</option>
                    <option value="17:00">17:00</option>
                    <option value="17:30">17:30</option>
                    <option value="18:00">18:00</option>
                    <option value="18:30">18:30</option>
                    <option value="19:00">19:00</option>
                    <option value="19:30">19:30</option>
                    <option value="20:00">20:00</option>
                    <option value="20:30">20:30</option>
                    <option value="21:00">21:00</option>
                    <option value="21:30">21:30</option>
                    <option value="22:00">22:00</option>
                    <option value="22:30">22:30</option>
                    <option value="23:00">23:00</option>
                    <option value="23:30">23:30</option>
                    <option value="00:00">00:00</option>
                </select>
            </div>
            <div className='filtro-form'>
                <button className='boton'type='submit'>Buscar</button>
            </div>


            </form>
        </div>
    )
}

export default BarraBusqueda

