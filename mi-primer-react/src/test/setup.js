// Setup común para los tests del frontend (ver vite.config.js -> test.setupFiles).
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import { eliminarToken } from '../utils/tokenStorage';

// Limpia el DOM y el token entre tests para evitar contaminación.
afterEach(() => {
  cleanup();
  eliminarToken();
});
