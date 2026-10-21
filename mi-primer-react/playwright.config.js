import { defineConfig, devices } from '@playwright/test';

// Test end-to-end (Opción A): usa el backend REAL + PostgreSQL con el seed cargado.
// Antes de correr `npm run test:e2e` tenés que tener:
//   1) El backend levantado:      cd backend && npm run dev
//   2) La base con datos de demo: cd backend && npx prisma db seed
// Playwright se encarga de levantar el frontend (Vite) automáticamente.
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
