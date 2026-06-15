import { createStateMachine, PHASES } from './state-machine.js';
import { getTimerPhase, getHeartColor, getBPM, renderTimerBar, createHeartBeatAnimation } from './timer.js';
import { renderBoot } from './screens/boot.js';
import { renderEnigma1 } from './screens/enigma-1.js';
import { renderEnigma2 } from './screens/enigma-2.js';
import { renderEnigma3 } from './screens/enigma-3.js';
import { renderResolution, renderGameOver } from './screens/resolution.js';
import { playHeartBeat, playFlatline } from './audio.js';
import { createNeuralParticles } from './particles.js';
import { createAnalytics } from './analytics.js';

const app = document.getElementById('app');
const stateMachine = createStateMachine();
const analytics = createAnalytics();
let heartBeatStop = null;
let timerInterval = null;
let startTime = Date.now();
let bootStarted = false;
let currentPhase = null;

// Create scanlines overlay
const scanlines = document.createElement('div');
scanlines.className = 'scanlines-overlay';
document.body.appendChild(scanlines);

// Create timer bar container
const timerContainer = document.createElement('div');
timerContainer.id = 'timer-container';
document.body.appendChild(timerContainer);

// Start neural particles
const stopParticles = createNeuralParticles(document.body);

function startTimer() {
  if (timerInterval) clearInterval(timerInterval);
  startTime = Date.now();
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const state = stateMachine.getState();
    stateMachine.updateTime(elapsed);

    const phase = stateMachine.getState().phase;
    const remaining = stateMachine.getState().timeRemaining;
    const totalTime = 1200 + stateMachine.getState().checkpoints.length * 180;
    const ratio = Math.max(0, remaining / totalTime);

    renderTimerBar(timerContainer, ratio, getTimerPhase(ratio));

    // Heartbeat audio during gameplay
    if (phase !== PHASES.GAMEOVER && phase !== PHASES.RESOLUTION && phase !== PHASES.BOOT) {
      try { playHeartBeat(); } catch(e) { /* audio context may not be ready */ }
    }

    // Check game over
    if (remaining <= 0 && phase !== PHASES.GAMEOVER && phase !== PHASES.RESOLUTION && phase !== PHASES.BOOT) {
      try { playFlatline(); } catch(e) {}
      stateMachine.setGameOver();
    }

    // Update heart beat animation speed
    if (heartBeatStop) heartBeatStop();
    const bpm = getBPM(getTimerPhase(ratio));
    const barEl = timerContainer.querySelector('.timer-bar');
    if (barEl) heartBeatStop = createHeartBeatAnimation(barEl, bpm);
  }, 1000);
}

function renderPhase(phase) {
  const state = stateMachine.getState();

  // Prevent re-rendering the same phase on timer ticks
  if (phase === currentPhase) return;
  currentPhase = phase;

  // Clear any stale timers from the previous screen before rendering
  if (heartBeatStop) {
    heartBeatStop();
    heartBeatStop = null;
  }

  switch (phase) {
    case PHASES.BOOT:
      if (!bootStarted) {
        bootStarted = true;
        renderBoot(app, stateMachine);
        setTimeout(startTimer, 5000);
      }
      break;
    case PHASES.ENIGMA1:
      analytics.record('phase-start', { phase: 'enigma1' });
      analytics.record('phase-change', { from: 'boot', to: 'enigma1' });
      renderEnigma1(app, stateMachine, analytics);
      break;
    case PHASES.ENIGMA2:
      analytics.record('phase-complete', { phase: 'enigma1' });
      analytics.record('phase-start', { phase: 'enigma2' });
      renderEnigma2(app, stateMachine, analytics);
      break;
    case PHASES.ENIGMA3:
      analytics.record('phase-complete', { phase: 'enigma2' });
      analytics.record('phase-start', { phase: 'enigma3' });
      renderEnigma3(app, stateMachine, analytics);
      break;
    case PHASES.RESOLUTION:
      if (timerInterval) clearInterval(timerInterval);
      timerInterval = null;
      analytics.record('phase-complete', { phase: 'enigma3' });
      renderResolution(app, state, analytics);
      break;
    case PHASES.GAMEOVER:
      if (timerInterval) clearInterval(timerInterval);
      timerInterval = null;
      renderGameOver(app, stateMachine);
      break;
    default:
      app.innerHTML = `<div style="color:var(--color-critical);font-family:var(--font-mono);padding:40px;">ERRO: Fase desconhecida "${phase}"</div>`;
  }
}

// Listen for state changes
stateMachine.onStateChange((newState) => {
  renderPhase(newState.phase);
});

// Start the game
renderPhase(stateMachine.getState().phase);
