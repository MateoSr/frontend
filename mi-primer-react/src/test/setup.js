// Setup común para los tests del frontend (ver vite.config.js -> test.setupFiles).
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Limpia el DOM y el almacenamiento entre tests para evitar contaminación.
afterEach(() => {
  cleanup();
  localStorage.clear();
});
