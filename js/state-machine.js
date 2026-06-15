export const PHASES = Object.freeze({
  BOOT: 'boot',
  ENIGMA1: 'enigma1',
  ENIGMA2: 'enigma2',
  ENIGMA3: 'enigma3',
  RESOLUTION: 'resolution',
  GAMEOVER: 'gameover',
});

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
      const enigmaOrder = [PHASES.ENIGMA1, PHASES.ENIGMA2, PHASES.ENIGMA3];
      const currentIdx = enigmaOrder.indexOf(state.phase);
      state = {
        ...state,
        checkpoints: [...state.checkpoints, { phase: state.phase, timestamp: Date.now() }],
        heartRate: Math.max(40, state.heartRate - 20),
        timeRemaining: state.timeRemaining + 180,
      };
      if (currentIdx < enigmaOrder.length - 1) {
        state = { ...state, phase: enigmaOrder[currentIdx + 1] };
      } else {
        state = { ...state, phase: PHASES.RESOLUTION };
      }
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
      state = {
        ...state,
        timeElapsed: elapsed,
        timeRemaining: Math.max(0, total - elapsed),
        heartRate: calculateHeartRate(Math.max(0, total - elapsed), total),
      };
    },

    onStateChange: (fn) => {
      listeners.push(fn);
    },
  };
}

function calculateHeartRate(remaining, total) {
  const ratio = remaining / total;
  if (ratio > 0.5) return 60;
  if (ratio > 0.25) return 90;
  if (ratio > 0.1) return 130;
  return 180;
}
