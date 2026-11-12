import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { RutaProtegida } from './rutaProtegida.jsx';
import * as auth from '../../utils/auth.js';

// Mockeamos la lectura del rol (que en la app real se obtiene decodificando el JWT).
vi.mock('../../utils/auth.js', () => ({
  obtenerRol: vi.fn(),
}));

const obtenerRolMock = vi.mocked(auth.obtenerRol);

// Test unitario de componente: un usuario sin sesión no puede ver contenido protegido.
describe('RutaProtegida', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirige a /login cuando no hay usuario autenticado', () => {
    obtenerRolMock.mockReturnValue(null);

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/login" element={<div>Login</div>} />
          <Route
            path="/admin"
            element={
              <RutaProtegida rol="Administrador">
                <div>Contenido protegido</div>
              </RutaProtegida>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.queryByText('Contenido protegido')).not.toBeInTheDocument();
  });
});
