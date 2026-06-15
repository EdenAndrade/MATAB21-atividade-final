import { describe, it, expect } from 'vitest';
import { validateTrace, identifyErrorLine, validateFix, ROUNDS } from './enigma-3-logic.js';

describe('enigma 3 — loop recursivo', () => {
  it('validates correct trace output (round 0)', () => {
    expect(validateTrace(0, 0).correct).toBe(true);
  });

  it('rejects wrong trace output', () => {
    expect(validateTrace(0, 120).correct).toBe(false);
  });

  it('identifies correct error line (round 0)', () => {
    expect(identifyErrorLine(0, 2).correct).toBe(true);
  });

  it('rejects wrong error line', () => {
    expect(identifyErrorLine(0, 1).correct).toBe(false);
  });

  it('validates correct fix (round 0)', () => {
    expect(validateFix(0, 'if (n <= 1) return 1;').correct).toBe(true);
  });

  it('rejects wrong fix', () => {
    expect(validateFix(0, 'if (n === 0) return 0;').correct).toBe(false);
  });
});
