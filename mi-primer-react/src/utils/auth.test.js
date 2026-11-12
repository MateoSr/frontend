import { describe, it, expect } from 'vitest';
import { decodificarPayload, msHastaExpiracion, obtenerRol } from './auth';
import { guardarToken, obtenerToken } from './tokenStorage';

function crearToken(payload) {
  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  let binario = '';
  bytes.forEach((byte) => {
    binario += String.fromCharCode(byte);
  });
  const base64 = btoa(binario).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `header.${base64}.firma`;
}

describe('utils/auth', () => {
  it('decodifica el payload de un JWT', () => {
    const payload = { userId: 1, email: 'cliente@test.com', rol: 'Cliente' };

    expect(decodificarPayload(crearToken(payload))).toMatchObject(payload);
  });

  it('devuelve null si no hay token', () => {
    expect(msHastaExpiracion()).toBeNull();
  });

  it('calcula los milisegundos restantes hasta el exp', () => {
    const exp = Math.floor(Date.now() / 1000) + 3600;
    const token = crearToken({ userId: 1, rol: 'Cliente', exp });

    const restante = msHastaExpiracion(token);

    expect(restante).toBeGreaterThan(3599 * 1000);
    expect(restante).toBeLessThanOrEqual(3600 * 1000);
  });

  it('devuelve un número negativo si el token ya venció', () => {
    const exp = Math.floor(Date.now() / 1000) - 10;
    const token = crearToken({ userId: 1, rol: 'Cliente', exp });

    expect(msHastaExpiracion(token)).toBeLessThan(0);
  });

  it('devuelve null si el token no tiene exp', () => {
    const token = crearToken({ userId: 1, rol: 'Cliente' });

    expect(msHastaExpiracion(token)).toBeNull();
  });

  it('devuelve null si el token es inválido', () => {
    expect(msHastaExpiracion('token-invalido')).toBeNull();
  });

  it('obtenerRol devuelve el rol de un token vigente', () => {
    const exp = Math.floor(Date.now() / 1000) + 3600;
    guardarToken(crearToken({ userId: 1, rol: 'Dueño', exp }));

    expect(obtenerRol()).toBe('Dueño');
  });

  it('obtenerRol devuelve null con un token vencido sin borrarlo (para poder refrescar)', () => {
    const exp = Math.floor(Date.now() / 1000) - 10;
    const token = crearToken({ userId: 1, rol: 'Dueño', exp });
    guardarToken(token);

    expect(obtenerRol()).toBeNull();
    expect(obtenerToken()).toBe(token);
  });
});
