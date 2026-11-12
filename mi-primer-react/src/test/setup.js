// Setup común para los tests del frontend (ver vite.config.js -> test.setupFiles).
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import { limpiarSesion } from '../utils/tokenStorage';
import { reiniciarAvisoExpiracion } from '../utils/sesion';

// Limpia el DOM y la sesión entre tests para evitar contaminación.
afterEach(() => {
  cleanup();
  limpiarSesion();
  reiniciarAvisoExpiracion();
});
