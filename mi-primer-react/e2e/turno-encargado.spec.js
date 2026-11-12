import { test, expect } from '@playwright/test';

// Flujo E2E real: un encargado inicia sesión, agenda un turno con datos por
// defecto y verificamos que se haya persistido. Al final se borra con la
// cuenta de administrador para que el test sea repetible.
//
// REQUISITOS (Opción A): PostgreSQL con los datos de demo (`npx prisma db seed`).
// Playwright levanta el backend y el frontend automáticamente.
// Misma URL por defecto que `src/config/api.js`.
const API_URL = 'http://localhost:3000/api';
const ENCARGADO = { email: 'encargado1@turnolibre.com', password: 'password123' };
const ADMIN = { email: 'admin@turnolibre.com', password: 'password123' };
const CLIENTE = { nombre: 'Cliente', apellido: 'Prueba E2E' };

function fechaMananaArgentina() {
  const manana = new Date(Date.now() + 24 * 60 * 60 * 1000);
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Argentina/Buenos_Aires',
  }).format(manana);
}

async function loginApi(request, { email, password }) {
  const response = await request.post(`${API_URL}/login`, {
    data: { email, password },
  });
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  return body.token.token;
}

test.describe('Turno (flujo de encargado)', () => {
  test('un encargado agenda un turno con datos por defecto', async ({ page, request }) => {
    const fecha = fechaMananaArgentina();

    // 1. Iniciar sesión como encargado.
    await page.goto('/login');
    await page.getByLabel('Correo electrónico').fill(ENCARGADO.email);
    await page.getByLabel('Contraseña').fill(ENCARGADO.password);
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();

    // El login redirige con window.location.href según el rol.
    await page.waitForURL('/menuEncargado');
    await expect(page.getByRole('heading', { name: 'Al Angulo' })).toBeVisible();

    // 2. Elegir una fecha futura para garantizar horarios disponibles.
    await page.locator('.menu-encargado-fecha input').fill(fecha);
    await expect(page.locator('.menu-encargado-fecha input')).toHaveValue(fecha);

    // 3. Agendar en la primera celda libre de la Cancha 1.
    const filaCancha1 = page.locator('.fila-cancha').filter({ hasText: 'Cancha 1' });
    const celdaLibre = filaCancha1.locator('.celda-turno.libre').first();
    await expect(celdaLibre).toBeVisible();
    await celdaLibre.click();

    // 4. Verificar los datos del turno que viajan por la URL.
    await expect(page).toHaveURL(/\/confirmar-reserva\?/);
    const url = new URL(page.url());
    const canchaNro = url.searchParams.get('canchaNro');
    const fechaTurno = url.searchParams.get('fecha');
    const horaInicio = url.searchParams.get('horarioInicio');
    expect(url.searchParams.get('complejoId')).toBe('1');
    expect(url.searchParams.get('modo')).toBe('encargado');
    expect(canchaNro).toBeTruthy();
    expect(fechaTurno).toBe(fecha);
    expect(horaInicio).toBeTruthy();

    // 5. Completar los datos por defecto del cliente y confirmar.
    await expect(page.getByRole('heading', { name: 'Agendar turno' })).toBeVisible();
    await page.getByLabel('Nombre').fill(CLIENTE.nombre);
    await page.getByLabel('Apellido').fill(CLIENTE.apellido);
    await page.getByRole('button', { name: 'Agendar turno' }).click();

    // 6. Verificación en UI: modal de éxito y vuelta al panel.
    await expect(page.getByRole('heading', { name: '¡Turno agendado!' })).toBeVisible();
    await page.waitForURL('/menuEncargado');

    // 7. Verificación en API: el turno quedó persistido.
    const token = await page.evaluate(() => localStorage.getItem('gestor_token'));
    const esperadoInicio = new Date(`${fechaTurno}T${horaInicio}:00-03:00`).toISOString();

    let turnoCreado = null;
    try {
      const response = await request.get(`${API_URL}/turnos/complejo/1`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      expect(response.ok()).toBeTruthy();
      const turnos = await response.json();

      turnoCreado = turnos.find((turno) =>
        turno.complejoId === 1 &&
        turno.canchaNro === Number(canchaNro) &&
        turno.fechaInicio === esperadoInicio &&
        turno.nombreSolicitante === CLIENTE.nombre &&
        turno.apellidoSolicitante === CLIENTE.apellido
      );

      expect(turnoCreado).toBeTruthy();
      expect(turnoCreado.estado).toBe('Reservado');
      expect(turnoCreado.clienteId).toBeNull();
    } finally {
      // 8. Limpieza: el encargado no puede borrar, usamos el admin.
      if (turnoCreado?.id) {
        const adminToken = await loginApi(request, ADMIN);
        const borrado = await request.delete(`${API_URL}/turnos/${turnoCreado.id}`, {
          headers: { Authorization: `Bearer ${adminToken}` },
        });
        expect(borrado.ok()).toBeTruthy();
      }
    }
  });
});
