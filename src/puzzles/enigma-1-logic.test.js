import { describe, it, expect } from 'vitest';
import { validateGate } from './enigma-1-logic.js';

describe('enigma 1 — portas lógicas', () => {
  const round1 = { a: 1, b: 0, expected: 0, correctGate: 'AND' };

  it('accepts AND for round 1', () => {
    expect(validateGate(round1, 'AND').correct).toBe(true);
  });

  it('rejects OR for round 1', () => {
    expect(validateGate(round1, 'OR').correct).toBe(false);
  });

  it('rejects NAND for round 1', () => {
    expect(validateGate(round1, 'NAND').correct).toBe(false);
  });

  it('accepts NAND for inputs 1,1 expecting 0', () => {
    expect(validateGate({ a: 1, b: 1, expected: 0 }, 'NAND').correct).toBe(true);
  });
});
