export const PHASE_COLORS = {
  stable: '#00FF41',
  alert: '#FF6A00',
  critical: '#FF0033',
  terminal: '#FF0033',
};

export const PHASE_BPM = {
  stable: 60,
  alert: 90,
  critical: 130,
  terminal: 180,
};

export function getTimerPhase(ratio) {
  if (ratio > 0.5) return 'stable';
  if (ratio > 0.25) return 'alert';
  if (ratio > 0.1) return 'critical';
  return 'terminal';
}

export function getHeartColor(phase) {
  return PHASE_COLORS[phase] || '#00FF41';
}

export function getBPM(phase) {
  return PHASE_BPM[phase] || 60;
}

export function renderTimerBar(container, ratio, phase) {
  const existing = container.querySelector('.timer-bar');
  if (existing) existing.remove();

  const bar = document.createElement('div');
  bar.className = 'timer-bar';
  const color = getHeartColor(phase);
  const pct = Math.max(5, ratio * 100);
  bar.style.cssText = `
    position: fixed; right: 0; top: 0; width: 8px; height: 100%;
    background: linear-gradient(to top, ${color} ${pct}%, rgba(0,0,0,0.8) ${pct}%);
    transition: background 0.5s ease;
    z-index: 1000;
  `;
  container.appendChild(bar);
}

export function createHeartBeatAnimation(element, bpm) {
  const intervalMs = Math.round(60000 / bpm);
  let timeout;
  let running = true;

  function beat() {
    if (!running) return;
    element.style.transform = 'scaleX(1.3)';
    setTimeout(() => { element.style.transform = 'scaleX(1)'; }, intervalMs * 0.3);
    timeout = setTimeout(beat, intervalMs);
  }

  beat();
  return () => { running = false; clearTimeout(timeout); };
}
