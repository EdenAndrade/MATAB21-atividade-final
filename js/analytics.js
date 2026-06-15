// js/analytics.js
export function createAnalytics() {
  const store = {
    actions: [],
    timePerEnigma: {},
    errorsByType: {},
    hintsUsed: {},
    attempts: {},
    _phaseStart: null,
    _phaseName: null,
  };

  function record(type, data) {
    const action = { type, ...data, timestamp: data.timestamp ?? Date.now() };
    store.actions.push(action);

    switch (type) {
      case 'error': {
        const reason = data.reason || 'unknown';
        store.errorsByType[reason] = (store.errorsByType[reason] || 0) + 1;
        break;
      }
      case 'hint': {
        const enigma = data.enigma;
        if (enigma) store.hintsUsed[enigma] = (store.hintsUsed[enigma] || 0) + 1;
        break;
      }
      case 'attempt': {
        const enigma = data.enigma;
        if (enigma) store.attempts[enigma] = (store.attempts[enigma] || 0) + 1;
        break;
      }
      case 'phase-start': {
        store._phaseName = data.phase;
        store._phaseStart = action.timestamp;
        break;
      }
      case 'phase-complete': {
        const phase = data.phase;
        if (store._phaseName === phase && store._phaseStart !== null) {
          const elapsed = Math.round((action.timestamp - store._phaseStart) / 1000);
          store.timePerEnigma[phase] = elapsed;
        }
        break;
      }
    }
  }

  function exportJSON() {
    const totalTime = Object.values(store.timePerEnigma).reduce((a, b) => a + b, 0);
    return JSON.stringify({
      date: new Date().toISOString().split('T')[0],
      totalTime,
      timePerEnigma: { ...store.timePerEnigma },
      attempts: { ...store.attempts },
      errorsByType: { ...store.errorsByType },
      hintsUsed: { ...store.hintsUsed },
    }, null, 2);
  }

  return { store, record, exportJSON };
}
