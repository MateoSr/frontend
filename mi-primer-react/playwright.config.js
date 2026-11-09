import { defineConfig, devices } from '@playwright/test';
import { fileURLToPath } from 'node:url';

// Test end-to-end (Opción A): usa el backend REAL + PostgreSQL con el seed cargado.
// Antes de correr `npm run test:e2e` tenés que tener la base con datos de demo:
//   cd backend && npx prisma db seed
// Playwright levanta automáticamente el backend (si no está corriendo) y el frontend (Vite).
const backendDir = fileURLToPath(new URL('../../backend', import.meta.url));

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
  webServer: [
    {
      command: 'npm run dev',
      cwd: backendDir,
      url: 'http://localhost:3000',
      reuseExistingServer: true,
      timeout: 120_000,
    },
    {
      command: 'npm run dev',
      url: 'http://localhost:5173',
      reuseExistingServer: true,
      timeout: 120_000,
    },
  ],
});
