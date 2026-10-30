import { test, expect } from '@playwright/test';

// Flujo E2E real: el cliente inicia sesión, busca complejos, abre el detalle
// de uno y llega a la pantalla de reserva.
//
// REQUISITOS (Opción A): backend real en http://localhost:3000 y PostgreSQL
// con los datos de demo (`npx prisma db seed`).
const CLIENTE = { email: 'cliente1@gmail.com', password: 'password123' };

test.describe('Reserva de turno (flujo de cliente)', () => {
  test('un cliente puede iniciar sesión y navegar hasta el detalle de un complejo', async ({ page }) => {
    // 1. Iniciar sesión
    await page.goto('/login');
    await page.getByLabel('Correo electrónico').fill(CLIENTE.email);
    await page.getByLabel('Contraseña').fill(CLIENTE.password);
    await page.getByRole('button', { name: 'Iniciar Sesión' }).click();

    // El login guarda el token y redirige con window.location.href (recarga completa).
    await page.waitForURL('/');
    await page.waitForFunction(() => Boolean(localStorage.getItem('gestor_token')));
    const token = await page.evaluate(() => localStorage.getItem('gestor_token'));
    expect(token).toBeTruthy();

    // 2. Ir a la búsqueda de complejos
    await page.goto('/complejos');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/complejos encontrados|Buscando/);

    // 3. Abrir el detalle del primer complejo disponible
    const primeraTarjeta = page.locator('.tarjeta-complejo').first();
    await expect(primeraTarjeta).toBeVisible();
    await primeraTarjeta.click();

    // 4. Estamos en la página de detalle del complejo
    await expect(page).toHaveURL(/\/detalle-complejo\/\d+/);
  });
});
