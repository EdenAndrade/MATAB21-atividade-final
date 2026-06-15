import { getTimerPhase, PHASE_BPM } from './timer.js';

export const PHASES = Object.freeze({
  BOOT: 'boot',
  ENIGMA1: 'enigma1',
  ENIGMA2: 'enigma2',
  ENIGMA3: 'enigma3',
  RESOLUTION: 'resolution',
  GAMEOVER: 'gameover',
});

const ENIGMA_ORDER = [PHASES.ENIGMA1, PHASES.ENIGMA2, PHASES.ENIGMA3];

const VALID_TRANSITIONS = {
  [PHASES.BOOT]: [PHASES.ENIGMA1],
  [PHASES.ENIGMA1]: [PHASES.ENIGMA2, PHASES.GAMEOVER],
  [PHASES.ENIGMA2]: [PHASES.ENIGMA3, PHASES.GAMEOVER],
  [PHASES.ENIGMA3]: [PHASES.RESOLUTION, PHASES.GAMEOVER],
  [PHASES.RESOLUTION]: [],
  [PHASES.GAMEOVER]: [],
};

export function createStateMachine() {
  let state = {
    phase: PHASES.BOOT,
    phaseData: {},
    attempts: { enigma1: 0, enigma2: 0, enigma3: 0 },
    heartRate: 60,
    timeElapsed: 0,
    timeRemaining: 1200,
    checkpoints: [],
  };

  const listeners = [];

  return {
    getState: () => ({ ...state }),

    transition: (targetPhase) => {
      const allowed = VALID_TRANSITIONS[state.phase];
      if (!allowed || !allowed.includes(targetPhase)) {
        throw new Error(`Invalid transition: ${state.phase} -> ${targetPhase}`);
      }
      state = { ...state, phase: targetPhase, phaseData: {} };
      listeners.forEach(fn => fn(state));
    },

    recordAttempt: (enigmaId) => {
      if (state.attempts[enigmaId] !== undefined) {
        state = { ...state, attempts: { ...state.attempts, [enigmaId]: state.attempts[enigmaId] + 1 } };
        listeners.forEach(fn => fn(state));
      }
    },

    completeEnigma: () => {
      if (!ENIGMA_ORDER.includes(state.phase)) {
        throw new Error(`Cannot complete enigma from phase: ${state.phase}`);
      }
      const currentIdx = ENIGMA_ORDER.indexOf(state.phase);
      const nextPhase = currentIdx < ENIGMA_ORDER.length - 1
        ? ENIGMA_ORDER[currentIdx + 1]
        : PHASES.RESOLUTION;
      state = {
        ...state,
        checkpoints: [...state.checkpoints, { phase: state.phase, timestamp: Date.now() }],
        heartRate: Math.max(40, state.heartRate - 20),
        timeRemaining: state.timeRemaining + 180,
        phase: nextPhase,
      };
      listeners.forEach(fn => fn(state));
    },

    setGameOver: () => {
      state = { ...state, phase: PHASES.GAMEOVER };
      listeners.forEach(fn => fn(state));
    },

    updateTime: (elapsed) => {
      const baseTotal = 1200;
      const bonus = state.checkpoints.length * 180;
      const total = baseTotal + bonus;
      const remaining = Math.max(0, total - elapsed);
      const phase = getTimerPhase(remaining / total);
      state = {
        ...state,
        timeElapsed: elapsed,
        timeRemaining: remaining,
        heartRate: PHASE_BPM[phase] || 60,
      };
      listeners.forEach(fn => fn(state));
    },

    onStateChange: (fn) => {
      listeners.push(fn);
    },
  };
}
