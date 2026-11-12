import { describe, it, expect } from 'vitest';
import {
  guardarToken,
  guardarTokens,
  guardarUltimaActividad,
  hayToken,
  limpiarSesion,
  obtenerRefreshToken,
  obtenerToken,
  obtenerUltimaActividad,
} from './tokenStorage';

describe('utils/tokenStorage', () => {
  it('guarda access y refresh token juntos', () => {
    guardarTokens({ token: 'access', refreshToken: 'refresh' });

    expect(obtenerToken()).toBe('access');
    expect(obtenerRefreshToken()).toBe('refresh');
    expect(hayToken()).toBe(true);
  });

  it('guarda y lee la última actividad', () => {
    guardarUltimaActividad(123456789);

    expect(obtenerUltimaActividad()).toBe(123456789);
  });

  it('limpiarSesion borra access, refresh e inactividad', () => {
    guardarToken('access');
    guardarTokens({ refreshToken: 'refresh' });
    guardarUltimaActividad();

    limpiarSesion();

    expect(obtenerToken()).toBeNull();
    expect(obtenerRefreshToken()).toBeNull();
    expect(obtenerUltimaActividad()).toBeNull();
    expect(hayToken()).toBe(false);
  });
});
