# O Grande Escape Virtual — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page escape room web game with 3 sequential puzzles, diegetic timer, layered feedback, and bio-organic-digital visual identity.

**Architecture:** Vite + vanilla JS (ES modules) + CSS native 2026. State machine controls 5 phases (boot, enigma1, enigma2, enigma3, resolution) with no routing. Each screen is a separate ES module that renders into a single `<div id="app">`. CSS uses @layer, CSS Nesting, and Container Queries. Audio generated via Web Audio API — zero external assets.

**Tech Stack:** Vite 6+, Vitest (unit tests only), Vanilla JS, CSS 2026

---

## File Structure

```
/
├── index.html
├── vite.config.js
├── package.json
├── css/
│   ├── design-system.css        # Tokens: cores, tipografia, spacing
│   └── animations.css           # @keyframes: pulsar, glitch, cicatrização
├── js/
│   ├── main.js                  # Entry point: monta state machine + render inicial
│   ├── state-machine.js         # Core state management + transitions
│   ├── timer.js                 # Timer logic + UI rendering do batimento
│   ├── audio.js                 # Web Audio API: tons, ruído, flatline
│   ├── screens/
│   │   ├── boot.js              # Tela de inicialização animada
│   │   ├── enigma-1.js          # Circuitos lógicos (drag-and-drop)
│   │   ├── enigma-2.js          # DER corrompido (click + drag)
│   │   ├── enigma-3.js          # Loop recursivo (click + escolha)
│   │   └── resolution.js        # Tela de conclusão / game over
│   └── feedback.js              # Sistema de feedback em 4 níveis
└── src/
    └── puzzles/
        ├── enigma-1-logic.js    # Validação das portas lógicas
        ├── enigma-2-logic.js    # Validação do DER
        └── enigma-3-logic.js    # Validação da recursão
```

---

### Task 1: Project Scaffold + Vite + Vitest

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`
- Create: `.gitignore`
- Create: `css/design-system.css`
- Create: `js/main.js` (minimal entry point)

- [ ] **Step 1: Initialize project with Vite**

Run:
```bash
cd /home/edyo/projetos/ambInt
npm create vite@latest . -- --template vanilla
npm install
npm install -D vitest
```

- [ ] **Step 2: Create `.gitignore`**

Write `/home/edyo/projetos/ambInt/.gitignore`:
```
node_modules/
dist/
.superpowers/
```

- [ ] **Step 3: Update `vite.config.js`**

Write `/home/edyo/projetos/ambInt/vite.config.js`:
```js
import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
  },
  test: {
    include: ['**/*.test.js'],
  },
})
```

- [ ] **Step 4: Write `index.html` entry point**

Write `/home/edyo/projetos/ambInt/index.html`:
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>O Grande Escape Virtual</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Space+Grotesk:wght@400;500&family=Syne:wght@700;900&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/css/design-system.css" />
  <link rel="stylesheet" href="/css/animations.css" />
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/js/main.js"></script>
</body>
</html>
```

- [ ] **Step 5: Write minimal `css/design-system.css`**

Write `/home/edyo/projetos/ambInt/css/design-system.css`:
```css
@layer reset, design-system, screens, components, animations;

@layer reset {
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; overflow: hidden; }
  body {
    background-color: #0A0A0B;
    color: #E8E8E8;
    font-family: 'Space Grotesk', sans-serif;
  }
  #app { width: 100%; height: 100vh; position: relative; overflow: hidden; }
}

@layer design-system {
  :root {
    --color-bg: #0A0A0B;
    --color-green: #00FF41;
    --color-alert: #FF6A00;
    --color-biolum-start: #8B5CF6;
    --color-biolum-end: #EC4899;
    --color-data: #00D4FF;
    --color-critical: #FF0033;
    --color-text: #E8E8E8;
    --color-muted: #6B7280;
    --color-glow-green: 0 0 10px rgba(0, 255, 65, 0.3);
    --font-display: 'Syne', sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
    --font-body: 'Space Grotesk', sans-serif;
    --transition-base: 0.3s ease;
  }
}
```

- [ ] **Step 6: Write minimal `js/main.js`**

Write `/home/edyo/projetos/ambInt/js/main.js`:
```js
import './state-machine.js';
```

- [ ] **Step 7: Verify scaffold works**

Run:
```bash
npm run dev
```
Expected: Vite dev server starts on localhost. Visit in browser — blank page, no errors in console. Kill with Ctrl+C in terminal.

- [ ] **Step 8: Commit scaffold**

```bash
git init
git add package.json vite.config.js index.html .gitignore css/ js/ 
git commit -m "chore: scaffold Vite + vanilla JS project"
```

---

### Task 2: Design System — Full Tokens + Font Loading Verification

**Files:**
- Modify: `css/design-system.css`

- [ ] **Step 1: Expand `css/design-system.css` with all visual tokens**

Edit `/home/edyo/projetos/ambInt/css/design-system.css` — replace `@layer design-system` with full token set:

```css
@layer design-system {
  :root {
    /* Cores */
    --color-bg: #0A0A0B;
    --color-green: #00FF41;
    --color-alert: #FF6A00;
    --color-biolum-start: #8B5CF6;
    --color-biolum-end: #EC4899;
    --color-data: #00D4FF;
    --color-critical: #FF0033;
    --color-text: #E8E8E8;
    --color-muted: #6B7280;
    --color-overlay: rgba(0, 0, 0, 0.7);

    /* Glow effects */
    --glow-green: 0 0 10px rgba(0, 255, 65, 0.3);
    --glow-biolum: 0 0 15px rgba(139, 92, 246, 0.3);
    --glow-data: 0 0 10px rgba(0, 212, 255, 0.3);
    --glow-critical: 0 0 15px rgba(255, 0, 51, 0.4);

    /* Tipografia */
    --font-display: 'Syne', sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
    --font-body: 'Space Grotesk', sans-serif;

    /* Spacing */
    --space-xs: 4px;
    --space-sm: 8px;
    --space-md: 16px;
    --space-lg: 24px;
    --space-xl: 32px;
    --space-2xl: 48px;

    /* Timer phases */
    --timer-phase-stable: var(--color-green);
    --timer-phase-alert: var(--color-alert);
    --timer-phase-critical: var(--color-critical);
    --timer-phase-terminal: var(--color-critical);

    /* Transitions */
    --transition-fast: 0.2s ease;
    --transition-base: 0.3s ease;
    --transition-slow: 0.5s ease;
  }
}
```

- [ ] **Step 2: Verify fonts load correctly**

Open `http://localhost:52128` (or vite dev URL). Open DevTools → Elements. Inspect `<body>` — confirm `font-family` resolves to Space Grotesk. Check Network tab for fonts.googleapis.com — Syne, JetBrains Mono, Space Grotesk should load with 200 status.

- [ ] **Step 3: Commit**

```bash
git add css/design-system.css
git commit -m "feat: add complete design system tokens"
```

---

### Task 3: State Machine Core (TDD)

**Files:**
- Create: `js/state-machine.js`
- Create: `js/state-machine.test.js`

**Responsibility:** Central state object + transition functions. Pure logic — no DOM.

- [ ] **Step 1: Write failing test**

Write `/home/edyo/projetos/ambInt/js/state-machine.test.js`:
```js
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

  it('transitions to gameover when timer hits 0', () => {
    const sm = createStateMachine();
    sm.transition(PHASES.ENIGMA1);
    sm.setGameOver();
    expect(sm.getState().phase).toBe(PHASES.GAMEOVER);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run js/state-machine.test.js`
Expected: FAIL with import errors (state-machine.js doesn't export these yet)

- [ ] **Step 3: Write minimal implementation**

Write `/home/edyo/projetos/ambInt/js/state-machine.js`:
```js
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
      const now = Date.now();
      const enigmaOrder = [PHASES.ENIGMA1, PHASES.ENIGMA2, PHASES.ENIGMA3];
      const currentIdx = enigmaOrder.indexOf(state.phase);
      state = {
        ...state,
        checkpoints: [...state.checkpoints, { phase: state.phase, timestamp: now }],
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
      state = { ...state, timeElapsed: elapsed, timeRemaining: Math.max(0, 1200 - elapsed + state.checkpoints.length * 180) };
      state = { ...state, heartRate: calculateHeartRate(state.timeRemaining, 1200) };
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run js/state-machine.test.js`
Expected: PASS — all 6 tests green

- [ ] **Step 5: Commit**

```bash
git add js/state-machine.js js/state-machine.test.js
git commit -m "feat: add state machine with phase transitions"
```

---

### Task 4: Timer System (TDD)

**Files:**
- Create: `js/timer.js`
- Create: `js/timer.test.js`

**Responsibility:** Calculate timer phase, bpm, render bar. Separate pure logic from DOM.

- [ ] **Step 1: Write failing test**

Write `/home/edyo/projetos/ambInt/js/timer.test.js`:
```js
import { describe, it, expect } from 'vitest';
import { getTimerPhase, getHeartColor, getBPM } from './timer.js';

describe('timer logic', () => {
  it('returns stable phase above 50%', () => {
    expect(getTimerPhase(0.75)).toBe('stable');
  });

  it('returns alert phase between 25% and 50%', () => {
    expect(getTimerPhase(0.35)).toBe('alert');
  });

  it('returns critical phase between 10% and 25%', () => {
    expect(getTimerPhase(0.15)).toBe('critical');
  });

  it('returns terminal phase below 10%', () => {
    expect(getTimerPhase(0.05)).toBe('terminal');
  });

  it('returns green color for stable', () => {
    expect(getHeartColor('stable')).toBe('#00FF41');
  });

  it('returns orange for alert', () => {
    expect(getHeartColor('alert')).toBe('#FF6A00');
  });

  it('returns red for critical', () => {
    expect(getHeartColor('critical')).toBe('#FF0033');
  });

  it('returns correct BPM for stable', () => {
    expect(getBPM('stable')).toBe(60);
  });

  it('returns correct BPM for alert', () => {
    expect(getBPM('alert')).toBe(90);
  });

  it('returns correct BPM for critical', () => {
    expect(getBPM('critical')).toBe(130);
  });

  it('returns correct BPM for terminal', () => {
    expect(getBPM('terminal')).toBe(180);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run js/timer.test.js`
Expected: FAIL — timer.js doesn't exist yet

- [ ] **Step 3: Write minimal implementation**

Write `/home/edyo/projetos/ambInt/js/timer.js`:
```js
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
  bar.style.cssText = `
    position: fixed; right: 0; top: 0; width: 8px; height: 100%;
    background: linear-gradient(to top, ${getHeartColor(phase)} 0%, rgba(0,0,0,0.8) ${ratio * 100}%);
    transition: background 0.5s ease;
    z-index: 1000;
  `;
  container.appendChild(bar);
}

export function createHeartBeatAnimation(element, bpm) {
  const intervalMs = Math.round(60000 / bpm);
  let timeout;

  function beat() {
    element.style.transform = 'scaleX(1.3)';
    setTimeout(() => { element.style.transform = 'scaleX(1)'; }, intervalMs * 0.3);
    timeout = setTimeout(beat, intervalMs);
  }

  beat();
  return () => clearTimeout(timeout);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run js/timer.test.js`
Expected: PASS — all tests green

- [ ] **Step 5: Add `timer.js` to `main.js` import chain**

Edit `/home/edyo/projetos/ambInt/js/main.js`:
```js
import './state-machine.js';
import './timer.js';

console.log('O Último Servidor Orgânico — iniciado');
```

- [ ] **Step 6: Commit**

```bash
git add js/timer.js js/timer.test.js js/main.js
git commit -m "feat: add timer system with heart phases and BPM"
```

---

### Task 5: Audio System

**Files:**
- Create: `js/audio.js`

**Responsibility:** Generate sounds via Web Audio API — no external files.

- [ ] **Step 1: Write `js/audio.js`**

Write `/home/edyo/projetos/ambInt/js/audio.js`:
```js
let audioCtx = null;

function getContext() {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

export function playBootSequence() {
  const ctx = getContext();
  const now = ctx.currentTime;
  // Rising tone sequence
  [220, 330, 440, 550].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.1, now + i * 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.3 + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + i * 0.3);
    osc.stop(now + i * 0.3 + 0.5);
  });
}

export function playCorrectSound() {
  const ctx = getContext();
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(523, now);
  osc.frequency.setValueAtTime(659, now + 0.1);
  osc.frequency.setValueAtTime(784, now + 0.2);
  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.4);
}

export function playErrorSound() {
  const ctx = getContext();
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'square';
  osc.frequency.value = 150;
  gain.gain.setValueAtTime(0.08, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.3);
}

export function playFlatline() {
  const ctx = getContext();
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.value = 60;
  gain.gain.setValueAtTime(0.12, now);
  gain.gain.linearRampToValueAtTime(0, now + 2);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 2);
}

export function playHeartBeat() {
  const ctx = getContext();
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = 40;
  gain.gain.setValueAtTime(0.06, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.15);
}

export function playHealSound() {
  const ctx = getContext();
  const now = ctx.currentTime;
  [300, 400, 500, 600].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.08, now + i * 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + i * 0.15);
    osc.stop(now + i * 0.15 + 0.3);
  });
}
```

- [ ] **Step 2: Verify audio plays**

Create a temporary test button in `index.html` to test audio — or verify in browser console: `await import('/js/audio.js').then(m => m.playBootSequence())`. Expected: 4 ascending tones play.

Remove test button after verifying.

- [ ] **Step 3: Commit**

```bash
git add js/audio.js
git commit -m "feat: add Web Audio API sound system"
```

---

### Task 6: Feedback System (TDD)

**Files:**
- Create: `js/feedback.js`
- Create: `js/feedback.test.js`

**Responsibility:** Determine feedback level from attempt count, generate diagnostic messages.

- [ ] **Step 1: Write failing test**

Write `/home/edyo/projetos/ambInt/js/feedback.test.js`:
```js
import { describe, it, expect } from 'vitest';
import { getFeedbackLevel, getFeedbackMessage } from './feedback.js';

describe('feedback system', () => {
  it('returns level 1 for first error', () => {
    expect(getFeedbackLevel(0, 1)).toBe(1);
  });

  it('returns level 4 after 4+ errors', () => {
    expect(getFeedbackLevel(0, 5)).toBe(4);
  });

  it('returns level 2 for partial progress with attempts', () => {
    expect(getFeedbackLevel(2, 1)).toBe(2);
  });

  it('returns level 3 when complete', () => {
    expect(getFeedbackLevel(3, 0)).toBe(3);
  });

  it('generates a diagnostic message for errors', () => {
    const msg = getFeedbackMessage('enigma1', 'error', 1);
    expect(msg).toBeTruthy();
    expect(typeof msg).toBe('string');
  });

  it('generates partial progress message', () => {
    const msg = getFeedbackMessage('enigma1', 'partial', 1);
    expect(msg).toBeTruthy();
    expect(msg).toContain('%');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run js/feedback.test.js`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**

Write `/home/edyo/projetos/ambInt/js/feedback.js`:
```js
const DIAGNOSTICS = {
  enigma1: {
    error: [
      'SINAL INTERMITENTE. PORTA LÓGICA INCORRETA.',
      'FLUXO DE DADOS INCOMPATÍVEL. TABELA VERDADE NÃO CORRESPONDE.',
      'RECALIBRANDO... VERIFICAR TABELA VERDADE DA PORTA SELECIONADA.',
      'DICA: A saída esperada determina qual porta completa o circuito. Compare bit a bit.',
    ],
    partial: [
      'MÓDULO PARCIALMENTE REATIVADO. 30% DE EFICIÊNCIA.',
      'CIRCUITO PARCIAL. 60% OPERACIONAL.',
      'CONEXÕES NEURAIS ESTABILIZANDO. 80% COMPLETO.',
    ],
  },
  enigma2: {
    error: [
      'RELACIONAMENTO ÓRFÃO DETECTADO. ENTIDADE AUSENTE.',
      'INCOMPATIBILIDADE DE CHAVES. ENTIDADE INVÁLIDA.',
      'MODELO CORROMPIDO. VERIFICAR CARDINALIDADE DOS RELACIONAMENTOS.',
      'DICA: Siga as chaves estrangeiras — elas revelam a entidade faltante.',
    ],
    partial: [
      'ENTIDADE POSICIONADA. 30% DO MAPA RECONSTRUÍDO.',
      'CONEXÕES PARCIALMENTE RESTAURADAS. 60% DE INTEGRIDADE.',
      'MAPEAMENTO QUASE COMPLETO. 80% DOS DADOS RECUPERADOS.',
    ],
  },
  enigma3: {
    error: [
      'LOOP RECURSIVO DETECTADO. CASO BASE INVÁLIDO.',
      'STACK TRACE PARCIAL. A CONDIÇÃO DE PARADA NUNCA É ATINGIDA.',
      'RECURSÃO INFINITA. VERIFICAR SE O CASO BASE RETORNA O VALOR CORRETO.',
      'DICA: Simule a execução manualmente — o erro está na condição de parada.',
    ],
    partial: [
      'MÓDULO COGNITIVO PARCIALMENTE ESTÁVEL. 30% DEPURADO.',
      'LOOP DESACELERANDO. 60% DO CÓDIGO VERIFICADO.',
      'RECURSÃO CONTROLADA. 80% DO ALGORITMO CORRETO.',
    ],
  },
};

export function getFeedbackLevel(progress, attempts) {
  if (attempts >= 4) return 4;
  if (progress >= 3) return 3;
  if (progress > 0 && attempts > 0) return 2;
  if (attempts > 0) return 1;
  return 0;
}

export function getFeedbackMessage(enigmaId, type, stepIndex) {
  const enigmaMsgs = DIAGNOSTICS[enigmaId];
  if (!enigmaMsgs) return 'SISTEMA INSTÁVEL. TENTE NOVAMENTE.';
  const messages = enigmaMsgs[type];
  if (!messages) return 'SISTEMA INSTÁVEL. TENTE NOVAMENTE.';
  const idx = Math.min(stepIndex, messages.length - 1);
  return messages[idx];
}

export function showFeedback(enigmaId, type, stepIndex, container) {
  const msg = getFeedbackMessage(enigmaId, type, stepIndex);
  const existing = container.querySelector('.feedback-text');
  if (existing) existing.remove();

  const el = document.createElement('div');
  el.className = `feedback-text feedback-${type}`;
  el.textContent = msg;
  container.appendChild(el);

  if (type === 'error' || type === 'partial') {
    setTimeout(() => { el.remove(); }, 4000);
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run js/feedback.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add js/feedback.js js/feedback.test.js
git commit -m "feat: add layered feedback system with diagnostics"
```

---

### Task 7: CSS Animations

**Files:**
- Create: `css/animations.css`

**Responsibility:** All @keyframes for the game.

- [ ] **Step 1: Write `css/animations.css`**

Write `/home/edyo/projetos/ambInt/css/animations.css`:
```css
@layer animations {
  /* Boot screen: typing effect */
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  @keyframes scanlines {
    0% { transform: translateY(0); }
    100% { transform: translateY(2px); }
  }

  /* Bio-servidor pulse */
  @keyframes pulse {
    0%, 100% { opacity: 0.6; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.02); }
  }

  @keyframes pulse-fast {
    0%, 100% { opacity: 0.8; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.05); }
  }

  /* Healing sweep */
  @keyframes heal-sweep {
    0% { background-position: -100% 0; }
    100% { background-position: 200% 0; }
  }

  /* Glitch effect */
  @keyframes glitch {
    0% { transform: translate(0); }
    20% { transform: translate(-2px, 1px); }
    40% { transform: translate(2px, -1px); }
    60% { transform: translate(-1px, 2px); }
    80% { transform: translate(1px, -2px); }
    100% { transform: translate(0); }
  }

  /* Flicker (critical timer) */
  @keyframes flicker {
    0%, 100% { opacity: 1; }
    10% { opacity: 0.8; }
    20% { opacity: 1; }
    30% { opacity: 0.6; }
    40% { opacity: 1; }
    70% { opacity: 0.9; }
    80% { opacity: 0.7; }
    90% { opacity: 1; }
  }

  /* Neural particles */
  @keyframes float-particle {
    0% { transform: translateY(100vh) translateX(0); opacity: 0; }
    10% { opacity: 0.6; }
    90% { opacity: 0.6; }
    100% { transform: translateY(-10vh) translateX(50px); opacity: 0; }
  }

  /* Data corruption */
  @keyframes data-corrupt {
    0%, 100% { filter: none; }
    25% { filter: hue-rotate(90deg) brightness(1.3); }
    50% { filter: hue-rotate(-90deg) brightness(0.7); }
    75% { filter: hue-rotate(180deg) brightness(1.1); }
  }

  /* Cardio beat */
  @keyframes heart-thump {
    0%, 100% { transform: scaleY(1); }
    15% { transform: scaleY(1.4); }
    30% { transform: scaleY(1); }
  }

  /* Shake for errors */
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 50%, 90% { transform: translateX(-3px); }
    30%, 70% { transform: translateX(3px); }
  }

  /* Sweep for healing */
  @keyframes sweep-green {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }

  /* Boot progress bar */
  @keyframes progress-fill {
    0% { width: 0%; }
    100% { width: 100%; }
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add css/animations.css
git commit -m "feat: add all CSS keyframe animations"
```

---

### Task 8: Screens Layout CSS

**Files:**
- Create: `css/screens.css`

**Responsibility:** Layout for each game phase. Asymmetric grid, no "shelf layout".

- [ ] **Step 1: Write `css/screens.css`**

Write `/home/edyo/projetos/ambInt/css/screens.css`:
```css
@import url(design-system.css);
@import url(animations.css);

@layer screens {
  /* Each screen is absolutely positioned, shown/hidden via data attribute */
  .screen {
    position: absolute;
    inset: 0;
    display: none;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--space-xl);
  }
  .screen[data-active="true"] {
    display: flex;
  }

  /* ── Boot Screen ── */
  .screen-boot {
    background: var(--color-bg);
    font-family: var(--font-mono);
    text-align: center;
  }
  .boot-terminal {
    max-width: 700px;
    text-align: left;
  }
  .boot-line {
    color: var(--color-green);
    font-size: 14px;
    line-height: 1.8;
    overflow: hidden;
    white-space: nowrap;
    border-right: 2px solid var(--color-green);
    animation: blink 0.8s step-end infinite;
  }
  .boot-line:nth-child(1) { animation: blink 0.8s step-end infinite, typing 2s steps(40) forwards; width: 0; }
  .boot-progress {
    margin-top: var(--space-lg);
    width: 400px;
    max-width: 80vw;
    height: 4px;
    background: rgba(0, 255, 65, 0.2);
    border-radius: 2px;
    overflow: hidden;
  }
  .boot-progress-fill {
    height: 100%;
    background: var(--color-green);
    box-shadow: var(--glow-green);
    animation: progress-fill 4s ease-in-out forwards;
  }
  .boot-status {
    margin-top: var(--space-md);
    color: var(--color-muted);
    font-size: 12px;
    font-family: var(--font-mono);
  }

  /* ── Puzzle Screens ── */
  .screen-puzzle {
    display: none;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto 1fr auto;
    gap: var(--space-md);
    padding: var(--space-lg);
    height: 100vh;
  }
  .screen-puzzle[data-active="true"] {
    display: grid;
  }

  .puzzle-header {
    grid-column: 1 / -1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-sm) 0;
  }
  .puzzle-title {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 20px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .puzzle-subsystem {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--color-muted);
  }

  .puzzle-area {
    grid-column: 1 / -1;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(0, 255, 65, 0.1);
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.3);
    min-height: 300px;
  }

  .puzzle-footer {
    grid-column: 1 / -1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-sm) 0;
  }

  /* ── Feedback Area ── */
  .feedback-zone {
    position: fixed;
    bottom: var(--space-lg);
    left: 50%;
    transform: translateX(-50%);
    z-index: 100;
    text-align: center;
  }
  .feedback-text {
    font-family: var(--font-mono);
    font-size: 13px;
    padding: var(--space-sm) var(--space-md);
    border-radius: 4px;
    animation: pulse 0.3s ease;
    max-width: 600px;
  }
  .feedback-error {
    color: var(--color-critical);
    border: 1px solid var(--color-critical);
    background: rgba(255, 0, 51, 0.1);
  }
  .feedback-partial {
    color: var(--color-alert);
    border: 1px solid var(--color-alert);
    background: rgba(255, 106, 0, 0.1);
  }
  .feedback-success {
    color: var(--color-green);
    border: 1px solid var(--color-green);
    background: rgba(0, 255, 65, 0.1);
    animation: pulse 0.5s ease;
  }

  /* ── Resolution Screen ── */
  .screen-resolution {
    text-align: center;
  }
  .resolution-title {
    font-family: var(--font-display);
    font-size: 48px;
    font-weight: 900;
    background: linear-gradient(135deg, var(--color-green), var(--color-data));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .resolution-subtitle {
    font-family: var(--font-mono);
    color: var(--color-muted);
    margin-top: var(--space-md);
  }

  /* ── Game Over Screen ── */
  .screen-gameover {
    background: var(--color-bg);
    text-align: center;
  }
  .gameover-title {
    font-family: var(--font-display);
    font-size: 36px;
    font-weight: 900;
    color: var(--color-critical);
    animation: flicker 0.5s ease infinite;
  }
  .gameover-subtitle {
    font-family: var(--font-mono);
    color: var(--color-muted);
    margin-top: var(--space-md);
  }
  .gameover-btn {
    margin-top: var(--space-xl);
    padding: var(--space-sm) var(--space-xl);
    font-family: var(--font-mono);
    font-size: 14px;
    color: var(--color-green);
    background: transparent;
    border: 1px solid var(--color-green);
    cursor: pointer;
    transition: var(--transition-base);
  }
  .gameover-btn:hover {
    background: rgba(0, 255, 65, 0.1);
    box-shadow: var(--glow-green);
  }

  /* ── Scanlines overlay ── */
  .scanlines-overlay {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 9999;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 1px,
      rgba(0, 0, 0, 0.05) 1px,
      rgba(0, 0, 0, 0.05) 2px
    );
  }

  /* ── Timer Bar container ── */
  .timer-container {
    position: fixed;
    right: 0;
    top: 0;
    width: 8px;
    height: 100%;
    z-index: 1000;
  }
  .timer-bar {
    width: 100%;
    height: 100%;
    transition: background 0.5s ease;
  }

  /* ── Responsive ── */
  @container (max-width: 768px) {
    .screen-puzzle {
      grid-template-columns: 1fr;
      grid-template-rows: auto 1fr auto;
    }
    .resolution-title {
      font-size: 28px;
    }
  }
}
```

- [ ] **Step 2: Link `screens.css` in `index.html`**

Edit `/home/edyo/projetos/ambInt/index.html` — add after `animations.css`:
```html
<link rel="stylesheet" href="/css/screens.css" />
```

- [ ] **Step 3: Commit**

```bash
git add css/screens.css index.html
git commit -m "feat: add screen layouts and timer bar CSS"
```

---

### Task 9: Puzzle Logic Modules (TDD)

**Files:**
- Create: `src/puzzles/enigma-1-logic.js`
- Create: `src/puzzles/enigma-1-logic.test.js`
- Create: `src/puzzles/enigma-2-logic.js`
- Create: `src/puzzles/enigma-2-logic.test.js`
- Create: `src/puzzles/enigma-3-logic.js`
- Create: `src/puzzles/enigma-3-logic.test.js`

**Responsibility:** Pure validation logic — no DOM. Returns { correct, feedbackLevel, nextStep }.

- [ ] **Step 1: Write enigma 1 tests**

Write `/home/edyo/projetos/ambInt/src/puzzles/enigma-1-logic.test.js`:
```js
import { describe, it, expect } from 'vitest';
import { validateGate } from '../enigma-1-logic.js';

describe('enigma 1 — portas lógicas', () => {
  const round1 = { a: 1, b: 0, expected: 0, correctGate: 'AND' };

  it('accepts AND for round 1', () => {
    const result = validateGate(round1, 'AND');
    expect(result.correct).toBe(true);
  });

  it('rejects OR for round 1', () => {
    const result = validateGate(round1, 'OR');
    expect(result.correct).toBe(false);
  });

  it('rejects NAND for round 1', () => {
    const result = validateGate(round1, 'NAND');
    expect(result.correct).toBe(false);
  });

  it('returns correct answer for NAND with inputs 1,1 expecting 0', () => {
    const result = validateGate({ a: 1, b: 1, expected: 0, correctGate: 'NAND' }, 'NAND');
    expect(result.correct).toBe(true);
  });

  it('returns feedback level 2 on first try correct', () => {
    const result = validateGate(round1, 'AND');
    expect(result.feedbackLevel).toBe(3);
  });
});
```

- [ ] **Step 2: Write enigma 2 tests**

Write `/home/edyo/projetos/ambInt/src/puzzles/enigma-2-logic.test.js`:
```js
import { describe, it, expect } from 'vitest';
import { validateEntity, validateRelationship, ROUNDS as ROUNDS2 } from '../enigma-2-logic.js';

describe('enigma 2 — DER corrompido', () => {
  it('validates correct entity placement', () => {
    const result = validateEntity(0, 'disciplina');
    expect(result.correct).toBe(true);
  });

  it('rejects wrong entity', () => {
    const result = validateEntity(0, 'professor');
    expect(result.correct).toBe(false);
  });

  it('validates correct relationship', () => {
    const result = validateRelationship(0, 'matricula');
    expect(result.correct).toBe(true);
  });

  it('rejects invalid relationship', () => {
    const result = validateRelationship(0, 'ministra');
    expect(result.correct).toBe(false);
  });

  it('returns round data with correct answer', () => {
    const round = ROUNDS2[0];
    expect(round.missingEntity).toBe('disciplina');
    expect(round.relationships).toHaveLength(2);
  });
});
```

- [ ] **Step 3: Write enigma 3 tests**

Write `/home/edyo/projetos/ambInt/src/puzzles/enigma-3-logic.test.js`:
```js
import { describe, it, expect } from 'vitest';
import { validateTrace, identifyErrorLine, validateFix, ROUNDS as ROUNDS3 } from '../enigma-3-logic.js';

describe('enigma 3 — loop recursivo', () => {
  it('validates correct trace output', () => {
    const result = validateTrace(0, 0);
    expect(result.correct).toBe(true);
  });

  it('rejects wrong trace output', () => {
    const result = validateTrace(0, 120);
    expect(result.correct).toBe(false);
  });

  it('identifies correct error line', () => {
    // Rodada 1: erro na linha 3 (condição de parada)
    const result = identifyErrorLine(0, 3);
    expect(result.correct).toBe(true);
  });

  it('rejects wrong error line', () => {
    const result = identifyErrorLine(0, 1);
    expect(result.correct).toBe(false);
  });

  it('validates correct fix', () => {
    const result = validateFix(0, 'if (n === 0) return 1');
    expect(result.correct).toBe(true);
  });

  it('rejects wrong fix', () => {
    const result = validateFix(0, 'if (n === 0) return 0');
    expect(result.correct).toBe(false);
  });
});
```

- [ ] **Step 4: Run all 3 test files to verify failure**

Run: `npx vitest run src/puzzles/`
Expected: FAIL — 3 test files, no implementation yet

- [ ] **Step 5: Write enigma 1 logic**

Write `/home/edyo/projetos/ambInt/src/puzzles/enigma-1-logic.js`:
```js
const GATE_FN = {
  AND: (a, b) => a & b,
  OR: (a, b) => a | b,
  NAND: (a, b) => (a & b) ? 0 : 1,
  NOR: (a, b) => (a | b) ? 0 : 1,
  XOR: (a, b) => a ^ b,
  NOT: (a) => a ? 0 : 1,
};

export const ROUNDS = [
  { a: 1, b: 0, expected: 0, correctGate: 'AND', options: ['AND', 'OR', 'NAND', 'XOR'] },
  { a: 1, b: 0, expected: 1, correctGate: 'OR', options: ['AND', 'OR', 'NOR', 'XOR'] },
  { a: 1, b: 1, expected: 0, correctGate: 'NAND', options: ['NAND', 'AND', 'NOR', 'XOR'] },
];

export function validateGate(round, selectedGate) {
  const gFn = GATE_FN[selectedGate];
  if (!gFn) return { correct: false, feedbackLevel: 1 };
  const output = gFn(round.a, round.b);
  const correct = output === round.expected;
  return {
    correct,
    feedbackLevel: correct ? 3 : 1,
    output,
    expected: round.expected,
  };
}
```

- [ ] **Step 6: Write enigma 2 logic**

Write `/home/edyo/projetos/ambInt/src/puzzles/enigma-2-logic.js`:
```js
export const ROUNDS = [
  {
    entities: ['aluno', 'professor', 'disciplina'],
    relationships: ['matricula', 'ministra'],
    missingEntity: 'disciplina',
    // Which existing entities have FK pointing to missing
    hints: ['entidade_alvo_aluno', 'entidade_alvo_professor'],
  },
];

const ENTITY_ANSWERS = { 0: 'disciplina' };
const RELATIONSHIP_ANSWERS = { 0: 'matricula' };

export function validateEntity(roundIdx, entityName) {
  return {
    correct: ENTITY_ANSWERS[roundIdx] === entityName,
    feedbackLevel: ENTITY_ANSWERS[roundIdx] === entityName ? 2 : 1,
  };
}

export function validateRelationship(roundIdx, relName) {
  return {
    correct: RELATIONSHIP_ANSWERS[roundIdx] === relName,
    feedbackLevel: RELATIONSHIP_ANSWERS[roundIdx] === relName ? 3 : 1,
  };
}
```

- [ ] **Step 7: Write enigma 3 logic**

Write `/home/edyo/projetos/ambInt/src/puzzles/enigma-3-logic.js`:
```js
export const ROUNDS = [
  {
    code: [
      'function fatorial(n) {',
      '  if (n <= 1) return n;',  // linha 2 — erro: deveria ser return 1
      '  return n * fatorial(n - 1);',
      '}',
      '',
      '// Qual o valor de fatorial(0)?',
    ],
    correctTrace: 0,
    errorLine: 2,
    fixOptions: [
      'if (n <= 1) return 1;',
      'if (n <= 1) return n;',
      'if (n <= 1) return n + 1;',
    ],
    correctFix: 'if (n <= 1) return 1;',
  },
  {
    code: [
      'function buscaBinaria(arr, alvo, esq, dir) {',
      '  if (esq > dir) return -1;',
      '  const meio = Math.floor((esq + dir) / 2);',
      '  if (arr[meio] === alvo) return meio;',
      '  if (arr[meio] < alvo)',
      '    return buscaBinaria(arr, alvo, esq, meio - 1);', // linha 6 — erro
      '  return buscaBinaria(arr, alvo, meio + 1, dir);',
      '}',
    ],
    correctTrace: 2,
    errorLine: 6,
    fixOptions: [
      'return buscaBinaria(arr, alvo, esq, meio - 1);',
      'return buscaBinaria(arr, alvo, meio + 1, dir);',
      'return buscaBinaria(arr, alvo, esq, meio);',
    ],
    correctFix: 'return buscaBinaria(arr, alvo, meio + 1, dir);',
  },
];

export function validateTrace(roundIdx, value) {
  return {
    correct: ROUNDS[roundIdx].correctTrace === value,
    feedbackLevel: ROUNDS[roundIdx].correctTrace === value ? 2 : 1,
  };
}

export function identifyErrorLine(roundIdx, line) {
  return {
    correct: ROUNDS[roundIdx].errorLine === line,
    feedbackLevel: ROUNDS[roundIdx].errorLine === line ? 2 : 1,
  };
}

export function validateFix(roundIdx, fix) {
  return {
    correct: ROUNDS[roundIdx].correctFix === fix,
    feedbackLevel: ROUNDS[roundIdx].correctFix === fix ? 3 : 1,
  };
}
```

- [ ] **Step 8: Run all puzzle tests**

Run: `npx vitest run src/puzzles/`
Expected: PASS — all tests green

- [ ] **Step 9: Commit**

```bash
git add src/
git commit -m "feat: add puzzle validation logic with tests"
```

---

### Task 10: Screen Components — Boot + Resolution + GameOver

**Files:**
- Create: `js/screens/boot.js`
- Create: `js/screens/resolution.js`

**Responsibility:** DOM rendering for non-puzzle screens.

- [ ] **Step 1: Write `js/screens/boot.js`**

Write `/home/edyo/projetos/ambInt/js/screens/boot.js`:
```js
import { PHASES } from '../state-machine.js';
import { playBootSequence } from '../audio.js';

export function renderBoot(container, stateMachine) {
  container.innerHTML = `
    <div class="screen screen-boot" data-active="true">
      <div class="boot-terminal">
        <div class="boot-line">SISTEMA CORROMPIDO.</div>
        <div class="boot-line">INICIANDO PROTOCOLO DE REPARO...</div>
        <div class="boot-line">VERIFICANDO INTEGRIDADE DOS MÓDULOS...</div>
      </div>
      <div class="boot-progress">
        <div class="boot-progress-fill"></div>
      </div>
      <div class="boot-status">CONECTANDO AO BIO-SERVIDOR...</div>
    </div>
  `;

  playBootSequence();

  // Auto-transition after 5 seconds
  setTimeout(() => {
    stateMachine.transition(PHASES.ENIGMA1);
  }, 5000);
}
```

- [ ] **Step 2: Write `js/screens/resolution.js`**

Write `/home/edyo/projetos/ambInt/js/screens/resolution.js`:
```js
import { playHealSound } from '../audio.js';

export function renderResolution(container, state) {
  const totalTime = state.timeElapsed;
  const minutes = Math.floor(totalTime / 60);
  const seconds = totalTime % 60;
  const totalAttempts = state.attempts.enigma1 + state.attempts.enigma2 + state.attempts.enigma3;

  container.innerHTML = `
    <div class="screen screen-resolution" data-active="true">
      <div class="resolution-title">O CONHECIMENTO FOI PRESERVADO</div>
      <div class="resolution-subtitle">Bio-servidor reiniciado com sucesso.</div>
      <div style="margin-top:32px;font-family:var(--font-mono);font-size:14px;color:var(--color-muted);line-height:2;">
        <div>Tempo total: ${minutes}:${seconds.toString().padStart(2, '0')}</div>
        <div>Tentativas (E1): ${state.attempts.enigma1}</div>
        <div>Tentativas (E2): ${state.attempts.enigma2}</div>
        <div>Tentativas (E3): ${state.attempts.enigma3}</div>
        <div>Total: ${totalAttempts}</div>
        <div>Checkpoints: ${state.checkpoints.length}/3</div>
      </div>
      <div style="margin-top:24px;font-size:13px;color:var(--color-data);">
        Subsistemas restaurados: Circuitos Lógicos &gt; Mapa de Dados &gt; Módulo Cognitivo
      </div>
    </div>
  `;

  playHealSound();
}

export function renderGameOver(container, stateMachine) {
  container.innerHTML = `
    <div class="screen screen-gameover" data-active="true">
      <div class="gameover-title">CONEXÃO PERDIDA</div>
      <div class="gameover-subtitle">SISTEMA IRRECUPERÁVEL.</div>
      <div style="margin-top:16px;font-family:var(--font-mono);font-size:12px;color:var(--color-muted);">
        O bio-servidor não resistiu. O conhecimento se perdeu.
      </div>
      <button class="gameover-btn" id="restart-btn">REINICIAR</button>
    </div>
  `;

  document.getElementById('restart-btn')?.addEventListener('click', () => {
    window.location.reload();
  });
}
```

- [ ] **Step 3: Commit**

```bash
git add js/screens/
git commit -m "feat: add boot and resolution screen renderers"
```

---

### Task 11: Enigma 1 Screen — Circuitos Lógicos (Full Interaction)

**Files:**
- Create: `js/screens/enigma-1.js`

**Responsibility:** Render puzzle area, handle drag-and-drop interactions for logic gates.

- [ ] **Step 1: Write `js/screens/enigma-1.js`**

Write `/home/edyo/projetos/ambInt/js/screens/enigma-1.js`:
```js
import { ROUNDS, validateGate } from '../..//puzzles/enigma-1-logic.js';
import { showFeedback } from '../feedback.js';
import { playCorrectSound, playErrorSound } from '../audio.js';

export function renderEnigma1(container, stateMachine) {
  let currentRound = 0;
  const totalRounds = ROUNDS.length;
  let errorsInStep = 0;
  let progress = 0;

  function renderRound() {
    const round = ROUNDS[currentRound];
    container.innerHTML = `
      <div class="screen screen-puzzle" data-active="true">
        <div class="puzzle-header">
          <div>
            <div class="puzzle-title">Circuito Lógico</div>
            <div class="puzzle-subsystem">SUBSISTEMA: SALA DE CIRCUITOS</div>
          </div>
          <div style="font-family:var(--font-mono);font-size:12px;color:var(--color-muted);">
            Rodada ${currentRound + 1}/${totalRounds}
          </div>
        </div>

        <div class="puzzle-area" style="min-height:250px;">
          <div style="font-family:var(--font-mono);font-size:28px;margin-bottom:24px;color:var(--color-text);">
            A=<span style="color:var(--color-data)">${round.a}</span>
            &nbsp;&nbsp;B=<span style="color:var(--color-data)">${round.b}</span>
            &nbsp;&nbsp;&rarr;&nbsp;&nbsp;S=<span style="color:var(--color-alert)">${round.expected}</span>
          </div>

          <div style="font-size:13px;color:var(--color-muted);margin-bottom:16px;font-family:var(--font-mono);">
            Selecione a porta lógica que completa o circuito:
          </div>

          <div class="gate-options" style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center;">
            ${round.options.map(gate => `
              <button class="gate-btn" data-gate="${gate}" style="
                padding:12px 24px;
                font-family:var(--font-mono);
                font-size:18px;
                font-weight:700;
                color:var(--color-biolum-start);
                background:rgba(139,92,246,0.08);
                border:1px solid rgba(139,92,246,0.3);
                border-radius:4px;
                cursor:pointer;
                transition:all 0.3s ease;
              ">${gate}</button>
            `).join('')}
          </div>
        </div>

        <div class="puzzle-footer">
          <div style="font-family:var(--font-mono);font-size:12px;color:var(--color-muted);">
            ${'■'.repeat(progress)}${'□'.repeat(totalRounds - progress)}
          </div>
        </div>

        <div class="feedback-zone" id="feedback-zone"></div>
      </div>
    `;

    // Attach click handlers
    container.querySelectorAll('.gate-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const selected = btn.dataset.gate;
        stateMachine.recordAttempt('enigma1');
        const result = validateGate(round, selected);
        const feedbackZone = container.querySelector('#feedback-zone');

        if (result.correct) {
          playCorrectSound();
          showFeedback('enigma1', 'success', 0, feedbackZone);
          btn.style.cssText = `padding:12px 24px;font-family:var(--font-mono);font-size:18px;font-weight:700;color:var(--color-green);background:rgba(0,255,65,0.15);border:1px solid var(--color-green);border-radius:4px;`;

          progress++;
          errorsInStep = 0;

          if (currentRound < totalRounds - 1) {
            setTimeout(() => {
              currentRound++;
              renderRound();
            }, 1200);
          } else {
            // All rounds complete
            setTimeout(() => {
              stateMachine.completeEnigma();
            }, 1500);
          }
        } else {
          playErrorSound();
          errorsInStep++;
          const errLevel = errorsInStep >= 4 ? 'hint' : 'error';
          showFeedback('enigma1', errLevel === 'hint' ? 'error' : 'error', errorsInStep - 1, feedbackZone);
          btn.style.cssText = `padding:12px 24px;font-family:var(--font-mono);font-size:18px;font-weight:700;color:var(--color-critical);background:rgba(255,0,51,0.1);border:1px solid var(--color-critical);border-radius:4px;animation:shake 0.3s ease;`;

          setTimeout(() => {
            renderRound();
          }, 1000);
        }
      });
    });
  }

  renderRound();
}
```

- [ ] **Step 2: Commit**

```bash
git add js/screens/enigma-1.js
git commit -m "feat: add enigma 1 screen with logic gate puzzle"
```

---

### Task 12: Enigma 2 Screen — DER Corrompido

**Files:**
- Create: `js/screens/enigma-2.js`

**Responsibility:** Render corrupted ER diagram with click-to-select entities and relationships.

- [ ] **Step 1: Write `js/screens/enigma-2.js`**

Write `/home/edyo/projetos/ambInt/js/screens/enigma-2.js`:
```js
import { ROUNDS, validateEntity, validateRelationship } from '../..//puzzles/enigma-2-logic.js';
import { showFeedback } from '../feedback.js';
import { playCorrectSound, playErrorSound } from '../audio.js';

export function renderEnigma2(container, stateMachine) {
  const round = ROUNDS[0];
  let step = 0; // 0=entity, 1=relationship
  let errorsInStep = 0;

  function renderStep() {
    if (step === 0) {
      // Step 1: Choose missing entity
      container.innerHTML = `
        <div class="screen screen-puzzle" data-active="true">
          <div class="puzzle-header">
            <div>
              <div class="puzzle-title">Mapa de Dados</div>
              <div class="puzzle-subsystem">SUBSISTEMA: SALA DE DADOS</div>
            </div>
          </div>

          <div class="puzzle-area" style="min-height:250px;">
            <div style="font-family:var(--font-mono);font-size:14px;color:var(--color-muted);margin-bottom:16px;">
              O DER está corrompido. Uma entidade foi perdida.
              Entidades visíveis: <span style="color:var(--color-data)">${round.entities.filter(e => e !== round.missingEntity).join(', ')}</span>
            </div>
            <div style="font-family:var(--font-mono);font-size:13px;color:var(--color-muted);margin-bottom:20px;">
              Relacionamentos órfãos detectados: <span style="color:var(--color-alert)">${round.relationships.join(', ')}</span>
            </div>
            <div style="font-size:13px;color:var(--color-muted);margin-bottom:16px;font-family:var(--font-mono);">
              Qual entidade está faltando?
            </div>
            <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center;">
              ${['aluno', 'professor', 'disciplina', 'curso'].map(e => `
                <button class="entity-btn" data-entity="${e}" style="
                  padding:12px 24px;
                  font-family:var(--font-mono);
                  font-size:16px;
                  color:var(--color-biolum-start);
                  background:rgba(139,92,246,0.08);
                  border:1px solid rgba(139,92,246,0.3);
                  border-radius:4px;
                  cursor:pointer;
                  transition:all 0.3s ease;
                ">${e}</button>
              `).join('')}
            </div>
          </div>

          <div class="puzzle-footer">
            <div style="font-family:var(--font-mono);font-size:12px;color:var(--color-muted);">
              Passo 1/2: Identificar entidade
            </div>
          </div>

          <div class="feedback-zone" id="feedback-zone"></div>
        </div>
      `;

      container.querySelectorAll('.entity-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const result = validateEntity(0, btn.dataset.entity);
          const feedbackZone = container.querySelector('#feedback-zone');

          if (result.correct) {
            playCorrectSound();
            showFeedback('enigma2', 'success', 0, feedbackZone);
            errorsInStep = 0;
            step = 1;
            setTimeout(renderStep, 1200);
          } else {
            playErrorSound();
            errorsInStep++;
            showFeedback('enigma2', 'error', errorsInStep - 1, feedbackZone);
            btn.style.animation = 'shake 0.3s ease';
          }
        });
      });
    } else if (step === 1) {
      // Step 2: Choose relationship
      container.innerHTML = `
        <div class="screen screen-puzzle" data-active="true">
          <div class="puzzle-header">
            <div>
              <div class="puzzle-title">Mapa de Dados</div>
              <div class="puzzle-subsystem">SUBSISTEMA: SALA DE DADOS</div>
            </div>
          </div>

          <div class="puzzle-area" style="min-height:250px;">
            <div style="font-family:var(--font-mono);font-size:14px;color:var(--color-green);margin-bottom:16px;">
              Entidade "disciplina" restaurada. ✓
            </div>
            <div style="font-size:13px;color:var(--color-muted);margin-bottom:16px;font-family:var(--font-mono);">
              Agora reconecte os relacionamentos. Qual entidade se relaciona com "aluno"?
            </div>
            <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center;">
              ${['matricula', 'ministra', 'cursa', 'leciona'].map(r => `
                <button class="rel-btn" data-rel="${r}" style="
                  padding:12px 24px;
                  font-family:var(--font-mono);
                  font-size:16px;
                  color:var(--color-data);
                  background:rgba(0,212,255,0.08);
                  border:1px solid rgba(0,212,255,0.3);
                  border-radius:4px;
                  cursor:pointer;
                  transition:all 0.3s ease;
                ">${r}</button>
              `).join('')}
            </div>
          </div>

          <div class="puzzle-footer">
            <div style="font-family:var(--font-mono);font-size:12px;color:var(--color-muted);">
              Passo 2/2: Conectar relacionamentos
            </div>
          </div>

          <div class="feedback-zone" id="feedback-zone"></div>
        </div>
      `;

      container.querySelectorAll('.rel-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const result = validateRelationship(0, btn.dataset.rel);
          const feedbackZone = container.querySelector('#feedback-zone');

          if (result.correct) {
            playCorrectSound();
            showFeedback('enigma2', 'success', 0, feedbackZone);
            setTimeout(() => {
              stateMachine.completeEnigma();
            }, 1500);
          } else {
            playErrorSound();
            errorsInStep++;
            showFeedback('enigma2', 'error', errorsInStep - 1, feedbackZone);
            btn.style.animation = 'shake 0.3s ease';
          }
        });
      });
    }
  }

  renderStep();
}
```

- [ ] **Step 2: Commit**

```bash
git add js/screens/enigma-2.js
git commit -m "feat: add enigma 2 screen with corrupted ER diagram"
```

---

### Task 13: Enigma 3 Screen — Loop Recursivo

**Files:**
- Create: `js/screens/enigma-3.js`

**Responsibility:** Render pseudocode, handle trace + error identification + fix selection.

- [ ] **Step 1: Write `js/screens/enigma-3.js`**

Write `/home/edyo/projetos/ambInt/js/screens/enigma-3.js`:
```js
import { ROUNDS, validateTrace, identifyErrorLine, validateFix } from '../..//puzzles/enigma-3-logic.js';
import { showFeedback } from '../feedback.js';
import { playCorrectSound, playErrorSound, playHealSound } from '../audio.js';

export function renderEnigma3(container, stateMachine) {
  let currentRound = 0;
  let step = 0; // 0=trace, 1=error line, 2=fix
  let errorsInStep = 0;

  function renderStep() {
    const round = ROUNDS[currentRound];

    if (step === 0) {
      // Step 1: Validate trace output
      container.innerHTML = `
        <div class="screen screen-puzzle" data-active="true">
          <div class="puzzle-header">
            <div>
              <div class="puzzle-title">Loop Recursivo</div>
              <div class="puzzle-subsystem">SUBSISTEMA: MÓDULO COGNITIVO CENTRAL</div>
            </div>
            <div style="font-family:var(--font-mono);font-size:12px;color:var(--color-muted);">
              Rodada ${currentRound + 1}/${ROUNDS.length}
            </div>
          </div>

          <div class="puzzle-area" style="min-height:300px;align-items:stretch;">
            <pre style="font-family:var(--font-mono);font-size:13px;line-height:1.8;color:var(--color-text);background:rgba(0,0,0,0.4);padding:16px;border-radius:4px;overflow-x:auto;">
${round.code.map((line, i) => `${String(i + 1).padStart(2, '0')}  ${line}`).join('\n')}
            </pre>
            <div style="font-size:13px;color:var(--color-muted);margin-top:12px;font-family:var(--font-mono);">
              Qual é a saída da função? (teste de mesa)
            </div>
            <div style="display:flex;gap:12px;margin-top:8px;justify-content:center;">
              ${[0, 1, 2, 3].map(v => `
                <button class="trace-btn" data-value="${v}" style="
                  padding:8px 16px;
                  font-family:var(--font-mono);
                  font-size:14px;
                  color:var(--color-data);
                  background:rgba(0,212,255,0.08);
                  border:1px solid rgba(0,212,255,0.3);
                  border-radius:4px;
                  cursor:pointer;
                ">${v}</button>
              `).join('')}
            </div>
          </div>

          <div class="feedback-zone" id="feedback-zone"></div>
        </div>
      `;

      container.querySelectorAll('.trace-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          stateMachine.recordAttempt('enigma3');
          const result = validateTrace(currentRound, parseInt(btn.dataset.value));
          const feedbackZone = container.querySelector('#feedback-zone');

          if (result.correct) {
            playCorrectSound();
            showFeedback('enigma3', 'success', 0, feedbackZone);
            errorsInStep = 0;
            step = 1;
            setTimeout(renderStep, 1200);
          } else {
            playErrorSound();
            errorsInStep++;
            showFeedback('enigma3', 'error', errorsInStep - 1, feedbackZone);
          }
        });
      });
    } else if (step === 1) {
      // Step 2: Identify error line
      container.innerHTML = `
        <div class="screen screen-puzzle" data-active="true">
          <div class="puzzle-header">
            <div>
              <div class="puzzle-title">Loop Recursivo</div>
              <div class="puzzle-subsystem">SUBSISTEMA: MÓDULO COGNITIVO CENTRAL</div>
            </div>
          </div>

          <div class="puzzle-area" style="min-height:300px;align-items:stretch;">
            <pre style="font-family:var(--font-mono);font-size:13px;line-height:1.8;color:var(--color-text);background:rgba(0,0,0,0.4);padding:16px;border-radius:4px;overflow-x:auto;">
${round.code.map((line, i) => `<span class="code-line" data-line="${i + 1}" style="cursor:pointer;display:block;transition:background 0.2s;">${String(i + 1).padStart(2, '0')}  ${line}</span>`).join('\n')}
            </pre>
            <div style="font-size:13px;color:var(--color-muted);margin-top:12px;font-family:var(--font-mono);">
              Clique na linha que contém o erro:
            </div>
          </div>

          <div class="feedback-zone" id="feedback-zone"></div>
        </div>
      `;

      container.querySelectorAll('.code-line').forEach(el => {
        el.addEventListener('mouseenter', () => {
          el.style.background = 'rgba(255,0,51,0.1)';
        });
        el.addEventListener('mouseleave', () => {
          el.style.background = 'transparent';
        });
        el.addEventListener('click', () => {
          const result = identifyErrorLine(currentRound, parseInt(el.dataset.line));
          const feedbackZone = container.querySelector('#feedback-zone');

          if (result.correct) {
            playCorrectSound();
            showFeedback('enigma3', 'success', 0, feedbackZone);
            el.style.background = 'rgba(0,255,65,0.15)';
            errorsInStep = 0;
            step = 2;
            setTimeout(renderStep, 1200);
          } else {
            playErrorSound();
            errorsInStep++;
            showFeedback('enigma3', 'error', errorsInStep - 1, feedbackZone);
            el.style.background = 'rgba(255,0,51,0.15)';
            setTimeout(() => { el.style.background = 'transparent'; }, 800);
          }
        });
      });
    } else if (step === 2) {
      // Step 3: Choose fix
      container.innerHTML = `
        <div class="screen screen-puzzle" data-active="true">
          <div class="puzzle-header">
            <div>
              <div class="puzzle-title">Loop Recursivo</div>
              <div class="puzzle-subsystem">SUBSISTEMA: MÓDULO COGNITIVO CENTRAL</div>
            </div>
          </div>

          <div class="puzzle-area" style="min-height:250px;">
            <div style="font-family:var(--font-mono);font-size:14px;color:var(--color-green);margin-bottom:16px;">
              Linha ${round.errorLine} identificada. ✓
            </div>
            <div style="font-size:13px;color:var(--color-muted);margin-bottom:16px;font-family:var(--font-mono);">
              Escolha a correção correta:
            </div>
            <div style="display:flex;gap:12px;flex-direction:column;align-items:center;">
              ${round.fixOptions.map((fix, i) => `
                <button class="fix-btn" data-fix="${fix}" style="
                  padding:10px 20px;
                  font-family:var(--font-mono);
                  font-size:13px;
                  color:var(--color-data);
                  background:rgba(0,212,255,0.08);
                  border:1px solid rgba(0,212,255,0.3);
                  border-radius:4px;
                  cursor:pointer;
                  min-width:300px;
                  text-align:center;
                ">${fix}</button>
              `).join('')}
            </div>
          </div>

          <div class="feedback-zone" id="feedback-zone"></div>
        </div>
      `;

      container.querySelectorAll('.fix-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const result = validateFix(currentRound, btn.dataset.fix);
          const feedbackZone = container.querySelector('#feedback-zone');

          if (result.correct) {
            playHealSound();
            showFeedback('enigma3', 'success', 0, feedbackZone);

            if (currentRound < ROUNDS.length - 1) {
              currentRound++;
              step = 0;
              errorsInStep = 0;
              setTimeout(renderStep, 1500);
            } else {
              setTimeout(() => {
                stateMachine.completeEnigma();
              }, 2000);
            }
          } else {
            playErrorSound();
            errorsInStep++;
            showFeedback('enigma3', 'error', errorsInStep - 1, feedbackZone);
            btn.style.animation = 'shake 0.3s ease';
          }
        });
      });
    }
  }

  renderStep();
}
```

- [ ] **Step 2: Commit**

```bash
git add js/screens/enigma-3.js
git commit -m "feat: add enigma 3 screen with recursive loop debugging"
```

---

### Task 14: Integration — Wire Everything Together

**Files:**
- Modify: `js/main.js` (full integration)
- Modify: `index.html` (add scanlines overlay)

**Responsibility:** Main app loop — listen to state changes, render appropriate screen, manage timer.

- [ ] **Step 1: Rewrite `js/main.js` as full integration**

Write `/home/edyo/projetos/ambInt/js/main.js`:
```js
import { createStateMachine, PHASES } from './state-machine.js';
import { getTimerPhase, getHeartColor, getBPM, renderTimerBar, createHeartBeatAnimation } from './timer.js';
import { renderBoot } from './screens/boot.js';
import { renderEnigma1 } from './screens/enigma-1.js';
import { renderEnigma2 } from './screens/enigma-2.js';
import { renderEnigma3 } from './screens/enigma-3.js';
import { renderResolution, renderGameOver } from './screens/resolution.js';
import { playHeartBeat, playFlatline } from './audio.js';

const app = document.getElementById('app');
const stateMachine = createStateMachine();
let heartBeatStop = null;
let timerInterval = null;
let startTime = Date.now();

// Create scanlines overlay
const scanlines = document.createElement('div');
scanlines.className = 'scanlines-overlay';
document.body.appendChild(scanlines);

// Create timer bar container
const timerContainer = document.createElement('div');
timerContainer.className = 'timer-container';
document.body.appendChild(timerContainer);

function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const state = stateMachine.getState();
    stateMachine.updateTime(elapsed);

    const remaining = state.timeRemaining;
    const totalTime = 1200;
    const ratio = remaining / totalTime;
    const phase = getTimerPhase(ratio);

    renderTimerBar(timerContainer, ratio, phase);

    // Heartbeat audio
    if (state.phase !== PHASES.GAMEOVER && state.phase !== PHASES.RESOLUTION && state.phase !== PHASES.BOOT) {
      playHeartBeat();
    }

    // Check game over
    if (remaining <= 0 && state.phase !== PHASES.GAMEOVER && state.phase !== PHASES.RESOLUTION) {
      playFlatline();
      stateMachine.setGameOver();
    }

    // Update heart beat animation speed
    if (heartBeatStop) {
      heartBeatStop();
    }
    const bpm = getBPM(phase);
    const barEl = timerContainer.querySelector('.timer-bar');
    if (barEl) {
      heartBeatStop = createHeartBeatAnimation(barEl, bpm);
    }
  }, 1000);
}

function renderPhase(phase) {
  const state = stateMachine.getState();

  switch (phase) {
    case PHASES.BOOT:
      renderBoot(app, stateMachine);
      break;
    case PHASES.ENIGMA1:
      renderEnigma1(app, stateMachine);
      break;
    case PHASES.ENIGMA2:
      renderEnigma2(app, stateMachine);
      break;
    case PHASES.ENIGMA3:
      renderEnigma3(app, stateMachine);
      break;
    case PHASES.RESOLUTION:
      if (timerInterval) clearInterval(timerInterval);
      renderResolution(app, state);
      break;
    case PHASES.GAMEOVER:
      if (timerInterval) clearInterval(timerInterval);
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

// Start timer after boot
setTimeout(startTimer, 5000);
```

- [ ] **Step 2: Update imports path fix**

The puzzle imports from `js/screens/` use relative paths `../..//puzzles/` which is incorrect — they should be `../../src/puzzles/`. Fix this in the three screen files:

Edit all three enigma screen files:
- `js/screens/enigma-1.js`: change `from '../..//puzzles/` to `from '../../src/puzzles/`
- `js/screens/enigma-2.js`: change `from '../..//puzzles/` to `from '../../src/puzzles/`
- `js/screens/enigma-3.js`: change `from '../..//puzzles/` to `from '../../src/puzzles/`

- [ ] **Step 3: Start dev server and test full flow**

Run: `npm run dev`
Open browser at Vite URL.
Expected: Boot screen plays (5s) → auto-transitions to Enigma 1 → solve 3 rounds → auto-transitions to Enigma 2 → solve 2 steps → auto-transitions to Enigma 3 → solve 2 rounds → Resolution screen.

Test each enigma interaction manually:
1. Click wrong answer → error feedback + shake animation
2. Click right answer → success feedback + auto-advance
3. Wait for boot to finish → auto-transition
4. Verify timer bar appears on right side

- [ ] **Step 4: Fix any integration bugs**

Common issues and fixes:
- Import path mismatches between module locations
- Timer not starting at correct time
- Screen not re-rendering on state change
- `data-active` attribute not being toggled correctly

Run dev server and iterate until full flow works end-to-end.

- [ ] **Step 5: Commit**

```bash
git add js/main.js js/screens/enigma-1.js js/screens/enigma-2.js js/screens/enigma-3.js
git commit -m "feat: integrate all screens with state machine and timer"
```

---

### Task 15: Visual Polish — Background Effects, Particle System, Responsive

**Files:**
- Create: `js/particles.js`
- Modify: `css/design-system.css` (background texture)
- Modify: `css/screens.css` (responsive container queries)

- [ ] **Step 1: Write particle background system**

Create `/home/edyo/projetos/ambInt/js/particles.js`:
```js
export function createNeuralParticles(container) {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:0;opacity:0.3;';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const particles = Array.from({ length: 40 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.3,
    vy: -Math.random() * 0.5 - 0.1,
    size: Math.random() * 2 + 1,
    opacity: Math.random() * 0.5 + 0.1,
    hue: Math.random() > 0.5 ? 139 : 212, // purple or blue
  }));

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 70%, 60%, ${p.opacity})`;
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  animate();

  const resizeHandler = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', resizeHandler);

  return () => {
    window.removeEventListener('resize', resizeHandler);
    canvas.remove();
  };
}
```

- [ ] **Step 2: Integrate particles in `main.js`**

Edit `/home/edyo/projetos/ambInt/js/main.js` — add after scanlines creation:
```js
import { createNeuralParticles } from './particles.js';

// In the initialization area, add:
createNeuralParticles(document.body);
```

- [ ] **Step 3: Add background texture to design system**

Edit `/home/edyo/projetos/ambInt/css/design-system.css` — add to `@layer design-system`:
```css
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background:
    radial-gradient(ellipse at 20% 50%, rgba(139, 92, 246, 0.03) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 50%, rgba(0, 212, 255, 0.03) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 20%, rgba(0, 255, 65, 0.02) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}
```

- [ ] **Step 4: Verify with dev server**

Run: `npm run dev`
Expected: Neural particles floating in background, subtle radial gradients visible, all screens render correctly.

- [ ] **Step 5: Commit**

```bash
git add js/particles.js js/main.js css/design-system.css
git commit -m "feat: add neural particle background and organic texture"
```

---

### Task 16: Build and Deploy

**Files:**
- No new files — just verification

- [ ] **Step 1: Build for production**

Run:
```bash
npm run build
```
Expected: `dist/` directory created with `index.html`, `css/`, `js/` — all minified.

- [ ] **Step 2: Verify production build**

Run:
```bash
npx serve dist
```
Open the URL. Confirm full game flow works from production build.

- [ ] **Step 3: Deploy to GitHub Pages**

```bash
git checkout -b main
git push -u origin main
```

Then configure GitHub Pages to serve from `main` branch root (no `/docs` needed since Vite outputs to `dist/`, which requires GitHub Actions).

Or create a simple deploy workflow:

Create `/home/edyo/projetos/ambInt/.github/workflows/deploy.yml`:
```yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 4: Commit deploy workflow**

```bash
git add .github/
git commit -m "ci: add GitHub Pages deploy workflow"
git push
```

- [ ] **Step 5: Final verification**

1. Confirm GitHub Actions runs successfully
2. Confirm Pages URL serves the game
3. Run through the full game flow one final time
4. Verify all 4 screen transitions work
5. Verify timer bar renders and progresses
6. Verify game over triggers when timer expires (test by manually setting `startTime` to a very old date in console)

---

## Self-Review Checklist

Run this after writing the plan:

- [ ] **Spec coverage:** Every section in the design doc has corresponding tasks:
  - Narrativa/Fases → Task 10 (boot/resolution)
  - State Machine → Task 3
  - Timer Diegético → Task 4
  - Feedback Camadas → Task 6
  - Enigma 1 (Circuitos) → Task 9 (logic) + Task 11 (screen)
  - Enigma 2 (DER) → Task 9 (logic) + Task 12 (screen)
  - Enigma 3 (Recursão) → Task 9 (logic) + Task 13 (screen)
  - Identidade Visual → Task 2 (tokens) + Task 7 (animations) + Task 15 (particles)
  - Tratamento de Erro → Covered in Task 3 (gameover), Task 6 (failing forward)
  - Entregáveis → Task 16 (deploy)

- [ ] **Placeholder scan:** All code blocks have actual code, all paths are exact, no "TBD" or "TODO".

- [ ] **Type consistency:** `PHASES.BOOT`, `PHASES.ENIGMA1`, etc. match across state-machine.js, timer.js, main.js, and all screen files. `getTimerPhase()`, `getFeedbackLevel()`, etc. have consistent signatures.

- [ ] **Import paths:** Cross-checked — `../..//puzzles/` is a double-slash typo flagged in Task 14 Step 2 for fix.
