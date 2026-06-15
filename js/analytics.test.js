// js/analytics.test.js
import { describe, it, expect } from 'vitest';
import { createAnalytics } from './analytics.js';

describe('createAnalytics', () => {
  it('starts with empty store', () => {
    const a = createAnalytics();
    expect(a.store.actions).toEqual([]);
    expect(a.store.hintsUsed).toEqual({});
  });

  it('records actions', () => {
    const a = createAnalytics();
    a.record('click', { target: 'gate-AND', enigma: 'enigma1' });
    expect(a.store.actions).toHaveLength(1);
    expect(a.store.actions[0].type).toBe('click');
  });

  it('tracks time per enigma', () => {
    const a = createAnalytics();
    a.record('phase-start', { phase: 'enigma1', timestamp: 1000 });
    a.record('phase-complete', { phase: 'enigma1', timestamp: 45000 });
    expect(a.store.timePerEnigma.enigma1).toBe(44);
  });

  it('tracks errors by type', () => {
    const a = createAnalytics();
    a.record('error', { reason: 'wrong-gate', enigma: 'enigma1' });
    a.record('error', { reason: 'wrong-gate', enigma: 'enigma1' });
    a.record('error', { reason: 'wrong-entity', enigma: 'enigma2' });
    expect(a.store.errorsByType.wrongGate).toBe(2);
    expect(a.store.errorsByType.wrongEntity).toBe(1);
  });

  it('tracks hints used', () => {
    const a = createAnalytics();
    a.record('hint', { enigma: 'enigma1' });
    a.record('hint', { enigma: 'enigma1' });
    a.record('hint', { enigma: 'enigma2' });
    expect(a.store.hintsUsed.enigma1).toBe(2);
    expect(a.store.hintsUsed.enigma2).toBe(1);
  });

  it('tracks attempts per enigma', () => {
    const a = createAnalytics();
    a.record('attempt', { enigma: 'enigma1' });
    a.record('attempt', { enigma: 'enigma1' });
    a.record('attempt', { enigma: 'enigma2' });
    expect(a.store.attempts.enigma1).toBe(2);
    expect(a.store.attempts.enigma2).toBe(1);
  });

  it('exports data as JSON string', () => {
    const a = createAnalytics();
    a.record('click', { target: 'gate-AND', enigma: 'enigma1' });
    const json = a.exportJSON();
    const parsed = JSON.parse(json);
    expect(parsed.actions).toBeUndefined(); // exportJSON only exports summary, not raw actions
    expect(parsed.totalTime).toBeDefined();
  });

  it('returns store with all expected keys', () => {
    const a = createAnalytics();
    const store = a.store;
    expect(store).toHaveProperty('actions');
    expect(store).toHaveProperty('timePerEnigma');
    expect(store).toHaveProperty('errorsByType');
    expect(store).toHaveProperty('hintsUsed');
    expect(store).toHaveProperty('attempts');
  });
});
