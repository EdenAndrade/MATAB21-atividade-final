import { describe, it, expect } from 'vitest';
import { validateEntity, validateRelationship, ROUNDS } from './enigma-2-logic.js';

describe('enigma 2 — DER corrompido', () => {
  it('validates correct entity', () => {
    expect(validateEntity(0, 'disciplina').correct).toBe(true);
  });

  it('rejects wrong entity', () => {
    expect(validateEntity(0, 'professor').correct).toBe(false);
  });

  it('validates correct relationship', () => {
    expect(validateRelationship(0, 'matricula').correct).toBe(true);
  });

  it('rejects invalid relationship', () => {
    expect(validateRelationship(0, 'ministra').correct).toBe(false);
  });

  it('has correct missing entity in round data', () => {
    expect(ROUNDS[0].missingEntity).toBe('disciplina');
  });
});
