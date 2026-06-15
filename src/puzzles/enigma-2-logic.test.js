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

  it('validates correct entity associativa (round 2)', () => {
    expect(validateEntity(1, 'historico').correct).toBe(true);
  });

  it('rejects wrong entity associativa (round 2)', () => {
    expect(validateEntity(1, 'aluno').correct).toBe(false);
  });

  it('validates relationship matricula (round 2)', () => {
    expect(validateRelationship(1, 'matricula').correct).toBe(true);
  });

  it('rejects relationship ministra (round 2)', () => {
    expect(validateRelationship(1, 'ministra').correct).toBe(false);
  });

  it('round 2 has historico as missing entity', () => {
    expect(ROUNDS[1].missingEntity).toBe('historico');
  });
});
