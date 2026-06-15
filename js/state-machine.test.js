import { describe, it, expect } from 'vitest';
import { createStateMachine, PHASES } from './state-machine.js';

describe('state machine', () => {
  it('initializes with boot phase', () => {
    const sm = createStateMachine();
    expect(sm.getState().phase).toBe(PHASES.BOOT);
  });

  it('transitions from boot to enigma1', () => {
    const sm = createStateMachine();
    sm.transition(PHASES.ENIGMA1);
    expect(sm.getState().phase).toBe(PHASES.ENIGMA1);
  });

  it('tracks attempt count per enigma', () => {
    const sm = createStateMachine();
    sm.recordAttempt('enigma1');
    sm.recordAttempt('enigma1');
    expect(sm.getState().attempts.enigma1).toBe(2);
  });

  it('prevents invalid transitions', () => {
    const sm = createStateMachine();
    expect(() => sm.transition('INVALID')).toThrow('Invalid transition');
  });

  it('adds checkpoint on enigma completion', () => {
    const sm = createStateMachine();
    sm.transition(PHASES.ENIGMA1);
    sm.completeEnigma();
    expect(sm.getState().checkpoints).toHaveLength(1);
    expect(sm.getState().phase).toBe(PHASES.ENIGMA2);
  });

  it('transitions to gameover when set', () => {
    const sm = createStateMachine();
    sm.transition(PHASES.ENIGMA1);
    sm.setGameOver();
    expect(sm.getState().phase).toBe(PHASES.GAMEOVER);
  });
});
