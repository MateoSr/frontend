import { CircleDollarSign, Edit3, Plus, Trash2 } from 'lucide-react';
import './listadoCanchas.css';

const formatearPrecio = (precio) => {
	if (precio === null || precio === undefined || precio === '') return 'Sin definir';

	return new Intl.NumberFormat('es-AR', {
		style: 'currency',
		currency: 'ARS',
		maximumFractionDigits: 0,
	}).format(Number(precio));
};

export function ListadoCanchas({
	canchas = [],
	onEditar,
	onAgregarPrecio,
	onAgregarCancha,
}) {
	return (
		<section className="listado-canchas" aria-labelledby="listado-canchas-titulo">
			<div className="listado-canchas-header">
				<div>
					<h2 id="listado-canchas-titulo">Canchas del complejo</h2>
				</div>
				<span className="listado-canchas-contador">
					{canchas.length} {canchas.length === 1 ? 'cancha' : 'canchas'}
				</span>
			</div>

			<div className="tabla-canchas-wrapper">
				<table className="tabla-canchas">
					<thead>
						<tr>
							<th scope="col">Nro.</th>
							<th scope="col">Deporte</th>
							<th scope="col">Precio base</th>
							<th scope="col">Precio adicional</th>
							<th scope="col">Precio seña</th>
							<th scope='col'>Estado</th>
							<th scope="col" className="columna-acciones">Acciones</th>
						</tr>
					</thead>
					<tbody>
						{canchas.length > 0 ? (
							canchas.map((cancha, indice) => (
								<tr key={cancha.nro}>
									<td data-label="Nro.">{cancha.nro}</td>
									<td data-label="Deporte" className="deporte-celda">
										{cancha.tipoCancha?.deporte ?? 'Sin definir'}
									</td>
									<td data-label="Precio base">{formatearPrecio(cancha.precios?.[0]?.precioBase)}</td>
									<td data-label="Precio adicional">{formatearPrecio(cancha.precios?.[0]?.precioAdicional)}</td>
									<td data-label="Precio seña">{formatearPrecio(cancha.precios?.[0]?.precioSena)}</td>
									<td data-label="Estado">{cancha?.estado ?? 'Sin estado'}</td>
									<td data-label="Acciones" className="acciones-celda">
										<button type="button" className="accion accion-editar" onClick={() => onEditar?.(cancha)} aria-label={`Editar cancha ${cancha.nro}`} title="Editar cancha">
											<Edit3 size={17} aria-hidden="true" />
										</button>
										<button type="button" className="accion accion-precio" onClick={() => onAgregarPrecio?.(cancha)} aria-label={`Agregar precio a la cancha ${cancha.nro}`} title="Agregar precio">
											<CircleDollarSign size={17} aria-hidden="true" />
										</button>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan="6" className="canchas-vacio">Todavía no hay canchas cargadas.</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			<button type="button" className="boton-agregar-cancha" onClick={onAgregarCancha}>
				<Plus size={18} aria-hidden="true" />
				Agregar otra cancha
			</button>
		</section>
	);
}

export default ListadoCanchas;
