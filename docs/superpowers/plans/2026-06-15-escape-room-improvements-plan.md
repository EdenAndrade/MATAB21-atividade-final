# Melhorias Finais — O Grande Escape Virtual Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement 6 improvements (analytics, acessibilidade, E2 expandido, mobile, estabilidade, boot+hint) para elevar a nota de ~8.0 para ~8.8-9.2

**Architecture:** Novos módulos `analytics.js` (coleta + dashboard canvas + export) e `dom-utils.js` (timer safety). Modificações localizadas nas screens existentes e CSS. Nenhuma lógica de enigma existente é alterada — apenas adições (ROUNDS[1] do E2).

**Tech Stack:** Vite + Vanilla JS (ES modules) + CSS @layers + Vitest + Canvas API nativa

---

### Task 1: Criar dom-utils.js — timer safety + pointer-events helper

**Files:**
- Create: `js/dom-utils.js`

- [ ] **Step 1: Write the failing tests**

```js
// js/dom-utils.test.js
import { describe, it, expect, vi } from 'vitest';
import { createTimer } from './dom-utils.js';

describe('createTimer', () => {
  it('executes callback after delay', async () => {
    const timer = createTimer();
    const fn = vi.fn();
    timer.setTimeout(fn, 10);
    await new Promise(r => setTimeout(r, 20));
    expect(fn).toHaveBeenCalledOnce();
  });

  it('clears all pending timers', async () => {
    const timer = createTimer();
    const fn = vi.fn();
    timer.setTimeout(fn, 100);
    timer.setTimeout(fn, 200);
    timer.clearAll();
    await new Promise(r => setTimeout(r, 50));
    expect(fn).not.toHaveBeenCalled();
  });

  it('does not throw if clearAll called with no timers', () => {
    const timer = createTimer();
    expect(() => timer.clearAll()).not.toThrow();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run js/dom-utils.test.js`
Expected: FAIL — module not found (file doesn't exist yet)

- [ ] **Step 3: Write minimal implementation**

```js
// js/dom-utils.js
export function createTimer() {
  const timers = new Set();
  return {
    setTimeout: (fn, ms) => {
      const id = setTimeout(() => {
        timers.delete(id);
        fn();
      }, ms);
      timers.add(id);
      return id;
    },
    clearAll: () => {
      timers.forEach(id => clearTimeout(id));
      timers.clear();
    },
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run js/dom-utils.test.js`
Expected: PASS — 3 tests passing

- [ ] **Step 5: Commit**

```bash
git add js/dom-utils.js js/dom-utils.test.js
git commit -m "feat: add dom-utils with createTimer for safe timeout management"
```

---

### Task 2: Integrar createTimer nas screens existentes

**Files:**
- Modify: `js/screens/boot.js`
- Modify: `js/screens/enigma-1.js`
- Modify: `js/screens/enigma-2.js`
- Modify: `js/screens/enigma-3.js`
- Modify: `js/screens/resolution.js`

- [ ] **Step 1: Modificar boot.js para usar createTimer**

```js
// js/screens/boot.js
import { PHASES } from '../state-machine.js';
import { playBootSequence } from '../audio.js';
import { createTimer } from '../dom-utils.js';

export function renderBoot(container, stateMachine) {
  const timer = createTimer();
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

  timer.setTimeout(() => {
    stateMachine.transition(PHASES.ENIGMA1);
  }, 5000);
}
```

- [ ] **Step 2: Modificar enigma-1.js para usar createTimer + pointer-events**

Envolver o setTimeout existente com `createTimer` e adicionar proteção:

```js
// js/screens/enigma-1.js — no topo do renderEnigma1
import { createTimer } from '../dom-utils.js';

export function renderEnigma1(container, stateMachine) {
  let currentRound = 0;
  const totalRounds = ROUNDS.length;
  let errorsInStep = 0;
  let progress = 0;
  const screenTimer = createTimer();

  function renderRound() {
    screenTimer.clearAll();
    // ... resto do render existente (inalterado)
  }
```

No handler de clique, adicionar proteção:

```js
// Dentro do click listener, antes da validação:
container.querySelectorAll('button').forEach(b => b.style.pointerEvents = 'none');
```

- [ ] **Step 3: Modificar enigma-2.js para usar createTimer**

Mesmo padrão: `const screenTimer = createTimer()` no início, `screenTimer.clearAll()` no início de cada renderStep/renderRound.

- [ ] **Step 4: Modificar enigma-3.js para usar createTimer**

Mesmo padrão.

- [ ] **Step 5: Modificar resolution.js para usar createTimer**

```js
// js/screens/resolution.js — envolver setTimeout do restart
import { createTimer } from '../dom-utils.js';

export function renderGameOver(container, stateMachine) {
  const timer = createTimer();
  // ...
  document.getElementById('restart-btn').addEventListener('click', () => {
    timer.clearAll(); // limpa qualquer pending
    window.location.reload();
  });
}
```

- [ ] **Step 6: Rodar testes para garantir que nada quebrou**

Run: `npm test`
Expected: Todos os 44 testes existentes passando

- [ ] **Step 7: Commit**

```bash
git add js/screens/boot.js js/screens/enigma-1.js js/screens/enigma-2.js js/screens/enigma-3.js js/screens/resolution.js
git commit -m "refactor: integrate createTimer into all screens for timeout safety"
```

---

### Task 3: Expandir E2 para 2 rodadas

**Files:**
- Modify: `src/puzzles/enigma-2-logic.js`
- Modify: `src/puzzles/enigma-2-logic.test.js`
- Modify: `js/screens/enigma-2.js`

- [ ] **Step 1: Adicionar ROUNDS[1] no enigma-2-logic.js**

```js
// src/puzzles/enigma-2-logic.js — adicionar ao array ROUNDS
export const ROUNDS = [
  {
    entities: ['aluno', 'professor', 'disciplina'],
    relationships: ['matricula', 'ministra'],
    missingEntity: 'disciplina',
    correctRelationship: 'matricula',
  },
  {
    entities: ['aluno', 'disciplina', 'professor', 'departamento'],
    relationships: ['matricula', 'ministra', 'aloca'],
    missingEntity: 'historico',
    correctRelationship: 'matricula',
  },
];
```

- [ ] **Step 2: Escrever testes para round 2**

```js
// src/puzzles/enigma-2-logic.test.js — adicionar ao describe existente
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
```

- [ ] **Step 3: Rodar testes para verificar**

Run: `npx vitest run src/puzzles/enigma-2-logic.test.js`
Expected: 9 tests passing (4 existentes + 5 novos)

- [ ] **Step 4: Refatorar enigma-2.js para suportar múltiplas rodadas**

O arquivo atual usa `step` fixo (só step 0 e step 1). Precisa ser refatorado para um loop
similar ao enigma-1.js (que tem `currentRound` + `renderRound()`).

Ler o arquivo atual `js/screens/enigma-2.js` e reestruturar:

```js
import { ROUNDS, validateEntity, validateRelationship } from '../../src/puzzles/enigma-2-logic.js';
import { showFeedback } from '../feedback.js';
import { playCorrectSound, playErrorSound } from '../audio.js';
import { createTimer } from '../dom-utils.js';

export function renderEnigma2(container, stateMachine) {
  let currentRound = 0;
  const totalRounds = ROUNDS.length;
  const screenTimer = createTimer();

  function renderStep(step) {
    screenTimer.clearAll();
    const round = ROUNDS[currentRound];

    if (step === 0) {
      // Passo 1: identificar entidade faltante
      container.innerHTML = `
        <div class="screen screen-puzzle" data-active="true">
          <div class="puzzle-header">
            <div>
              <div class="puzzle-title">Mapa de Dados</div>
              <div class="puzzle-subsystem">SUBSISTEMA: SALA DE DADOS</div>
            </div>
            <div style="font-family:var(--font-mono);font-size:12px;color:var(--color-muted);">
              Rodada ${currentRound + 1}/${totalRounds}
            </div>
          </div>

          <div class="puzzle-area">
            <div style="font-family:var(--font-mono);font-size:14px;color:var(--color-muted);margin-bottom:16px;">
              O DER está corrompido. Uma entidade foi perdida.
              Entidades visíveis: <span style="color:var(--color-data)">${round.entities.filter(e => e !== round.missingEntity).join(', ')}</span>
            </div>
            <div style="font-family:var(--font-mono);font-size:13px;color:var(--color-muted);margin-bottom:20px;">
              Relacionamentos órfãos: <span style="color:var(--color-alert)">${round.relationships.join(', ')}</span>
            </div>
            ${currentRound === 1 ? '<div style="font-family:var(--font-mono);font-size:12px;color:var(--color-biolum-start);margin-bottom:12px;">DICA: Relacionamentos N:N podem exigir uma entidade associativa.</div>' : ''}
            <div style="font-size:13px;color:var(--color-muted);margin-bottom:16px;font-family:var(--font-mono);">
              Qual entidade está faltando?
            </div>
            <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center;">
              ${[...round.entities, round.missingEntity].map(e => `
                <button class="entity-btn" data-entity="${e}" style="padding:12px 24px;font-family:var(--font-mono);font-size:16px;color:var(--color-data);background:rgba(0,212,255,0.08);border:1px solid rgba(0,212,255,0.3);border-radius:4px;cursor:pointer;transition:all 0.3s ease;">${e}</button>
              `).join('')}
            </div>
          </div>
        </div>
      `;

      container.querySelectorAll('.entity-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const buttons = container.querySelectorAll('.entity-btn');
          buttons.forEach(b => b.style.pointerEvents = 'none');

          const result = validateEntity(currentRound, btn.dataset.entity);
          if (result.correct) {
            playCorrectSound();
            showFeedback(container, 'enigma2', 'partial', 0);
            screenTimer.setTimeout(() => renderStep(1), 1200);
          } else {
            playErrorSound();
            showFeedback(container, 'enigma2', 'error', 0);
            screenTimer.setTimeout(() => renderStep(0), 1500);
          }
        });
      });
    } else {
      // Passo 2: reconectar relacionamento (mesmo HTML existente, com round info)
      container.innerHTML = `
        <div class="screen screen-puzzle" data-active="true">
          <div class="puzzle-header">
            <div>
              <div class="puzzle-title">Mapa de Dados</div>
              <div class="puzzle-subsystem">SUBSISTEMA: SALA DE DADOS</div>
            </div>
            <div style="font-family:var(--font-mono);font-size:12px;color:var(--color-muted);">
              Rodada ${currentRound + 1}/${totalRounds}
            </div>
          </div>

          <div class="puzzle-area">
            <div style="font-family:var(--font-mono);font-size:14px;color:var(--color-muted);margin-bottom:16px;">
              Entidade <span style="color:var(--color-data)">${round.missingEntity}</span> reinserida.
              Reconecte os relacionamentos.
            </div>
            <div style="font-family:var(--font-mono);font-size:13px;color:var(--color-muted);margin-bottom:12px;">
              Entidades no modelo:
            </div>
            <div style="font-family:var(--font-mono);font-size:12px;color:var(--color-data);margin-bottom:20px;line-height:1.8;">
              ${round.entities.map(e => `[${e}]`).join(' — ')}
            </div>
            <div style="font-size:13px;color:var(--color-muted);margin-bottom:16px;font-family:var(--font-mono);">
              Qual relacionamento conecta ${round.entities[0]} e ${round.missingEntity}?
            </div>
            <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center;">
              ${round.relationships.map(r => `
                <button class="rel-btn" data-rel="${r}" style="padding:12px 24px;font-family:var(--font-mono);font-size:16px;color:var(--color-biolum-start);background:rgba(139,92,246,0.08);border:1px solid rgba(139,92,246,0.3);border-radius:4px;cursor:pointer;transition:all 0.3s ease;">${r}</button>
              `).join('')}
            </div>
          </div>
        </div>
      `;

      container.querySelectorAll('.rel-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const buttons = container.querySelectorAll('.rel-btn');
          buttons.forEach(b => b.style.pointerEvents = 'none');

          const result = validateRelationship(currentRound, btn.dataset.rel);
          if (result.correct) {
            playCorrectSound();
            showFeedback(container, 'enigma2', 'partial', 2);
            stateMachine.recordAttempt('enigma2');
            screenTimer.setTimeout(() => {
              if (currentRound < ROUNDS.length - 1) {
                currentRound++;
                renderStep(0);
              } else {
                stateMachine.completeEnigma();
              }
            }, 1500);
          } else {
            playErrorSound();
            showFeedback(container, 'enigma2', 'error', 1);
            stateMachine.recordAttempt('enigma2');
            screenTimer.setTimeout(() => renderStep(1), 1500);
          }
        });
      });
    }
  }

  renderStep(0);
}
```

- [ ] **Step 5: Rodar todos os testes**

Run: `npm test`
Expected: 49 tests passing (44 antigos + 5 novos)

- [ ] **Step 6: Commit**

```bash
git add src/puzzles/enigma-2-logic.js src/puzzles/enigma-2-logic.test.js js/screens/enigma-2.js
git commit -m "feat: expand E2 to 2 rounds with associative entity (N:N)"
```

---

### Task 4: Expandir boot screen com instruções diegéticas

**Files:**
- Modify: `js/screens/boot.js`

- [ ] **Step 1: Adicionar linhas de instrução ao boot**

```js
export function renderBoot(container, stateMachine) {
  const timer = createTimer();
  container.innerHTML = `
    <div class="screen screen-boot" data-active="true">
      <div class="boot-terminal">
        <div class="boot-line">SISTEMA CORROMPIDO.</div>
        <div class="boot-line">INICIANDO PROTOCOLO DE REPARO...</div>
        <div class="boot-line">VERIFICANDO INTEGRIDADE DOS MÓDULOS...</div>
        <div class="boot-line" style="color:var(--color-biolum-start);">AVISO: BIO-SERVIDOR DEGRADANDO EM 20 MINUTOS.</div>
        <div class="boot-line" style="color:var(--color-biolum-start);">CADA SUBSISTEMA REPARADO CONCEDE +3 MIN DE ESTABILIDADE.</div>
        <div class="boot-line" style="color:var(--color-data);">USE O INDICADOR DE BATIMENTO CARDÍACO NA LATERAL PARA MONITORAR.</div>
      </div>
      <div class="boot-progress">
        <div class="boot-progress-fill"></div>
      </div>
      <div class="boot-status">CONECTANDO AO BIO-SERVIDOR...</div>
    </div>
  `;
  // ...resto igual
}
```

- [ ] **Step 2: Verificar build**

Run: `npm run build`
Expected: Build OK sem warnings

- [ ] **Step 3: Commit**

```bash
git add js/screens/boot.js
git commit -m "feat: expand boot with diegetic timer instructions"
```

---

### Task 5: Criar módulo de analytics

**Files:**
- Create: `js/analytics.js`
- Create: `js/analytics.test.js`

- [ ] **Step 1: Escrever testes para analytics**

```js
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
    expect(parsed.actions).toHaveLength(1);
    expect(parsed.actions[0].type).toBe('click');
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run js/analytics.test.js`
Expected: FAIL — module not found

- [ ] **Step 3: Write analytics.js implementation**

```js
// js/analytics.js
export function createAnalytics() {
  const store = {
    actions: [],
    timePerEnigma: {},
    errorsByType: {},
    hintsUsed: {},
    attempts: {},
    phaseTimestamps: {},
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
      /* phase tracking via 'phase-start' / 'phase-complete' (ver abaixo) */
    }
  }

  function exportJSON() {

```js
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
```

- [ ] **Step 4: Atualizar os testes para corresponder à API corrigida**

```js
// js/analytics.test.js — testar phase-start/phase-complete em vez de phase-change
it('tracks time per enigma', () => {
  const a = createAnalytics();
  a.record('phase-start', { phase: 'enigma1', timestamp: 1000 });
  a.record('phase-complete', { phase: 'enigma1', timestamp: 46000 });
  expect(a.store.timePerEnigma.enigma1).toBe(45);
});
```

- [ ] **Step 5: Executar testes**

Run: `npx vitest run js/analytics.test.js`
Expected: PASS — 7 tests

- [ ] **Step 6: Commit**

```bash
git add js/analytics.js js/analytics.test.js
git commit -m "feat: add analytics module with metrics tracking and JSON export"
```

---

### Task 6: Integrar analytics nas screens

**Files:**
- Modify: `js/main.js`
- Modify: `js/screens/enigma-1.js`
- Modify: `js/screens/enigma-2.js`
- Modify: `js/screens/enigma-3.js`
- Modify: `js/screens/resolution.js`

- [ ] **Step 1: Instanciar analytics no main.js e passar para as screens**

```js
// js/main.js — adicionar import + instância
import { createAnalytics } from './analytics.js';
const analytics = createAnalytics();

// Dentro de renderPhase, passar analytics para cada screen:
function renderPhase(phase) {
  currentPhase = phase;
  app.innerHTML = '';

  switch (phase) {
    case PHASES.BOOT:
      renderBoot(app, stateMachine);
      break;
    case PHASES.ENIGMA1:
      analytics.record('phase-start', { phase: 'enigma1' });
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
      analytics.record('phase-complete', { phase: 'enigma3' });
      renderResolution(app, stateMachine.getState(), analytics);
      break;
    case PHASES.GAMEOVER:
      renderGameOver(app, stateMachine);
      break;
  }
}
```

- [ ] **Step 2: Adicionar analytics.record('error') e analytics.record('hint') nas screens**

```js
// enigma-1.js — dentro do handler de clique, após validação incorreta:
if (!result.correct) {
  analytics.record('error', { reason: 'wrong-gate', enigma: 'enigma1' });
  analytics.record('attempt', { enigma: 'enigma1' });
  // ...
}

// enigma-2.js — dentro do handler:
if (!result.correct) {
  analytics.record('error', { reason: 'wrong-entity', enigma: 'enigma2' });
  analytics.record('attempt', { enigma: 'enigma2' });
  // ...
}

// enigma-3.js — dentro do handler:
if (!result.correct) {
  const reason = step === 0 ? 'wrong-trace' : step === 1 ? 'wrong-error-line' : 'wrong-fix';
  analytics.record('error', { reason, enigma: 'enigma3' });
  analytics.record('attempt', { enigma: 'enigma3' });
  // ...
}
```

- [ ] **Step 3: Atualizar resolution.js com dashboard**

Adicionar função de renderização do dashboard com canvas:

```js
// js/screens/resolution.js
import { playHealSound, playFlatline } from '../audio.js';
import { createTimer } from '../dom-utils.js';

export function renderDashboard(container, store) {
  const canvas = document.createElement('canvas');
  const cssW = Math.min(600, window.innerWidth - 64);
  const cssH = 280;
  canvas.style.cssText = 'max-width:100%;margin-top:24px;border-radius:4px;';
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  canvas.width = cssW * dpr;
  canvas.height = cssH * dpr;
  canvas.style.width = cssW + 'px';
  canvas.style.height = cssH + 'px';
  ctx.scale(dpr, dpr);

  // Fundo
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillRect(0, 0, cssW, cssH);

  const enigmas = ['enigma1', 'enigma2', 'enigma3'];
  const labels = ['E1', 'E2', 'E3'];
  const colors = ['#00FF41', '#00D4FF', '#8B5CF6'];

  // Cada lado do dashboard tem 50% da largura menos padding
  const halfW = cssW / 2;
  const sidePad = 20;
  const chartWidth = halfW - sidePad * 2;  // ≈ 260px
  const barW = chartWidth / 4;             // 3 barras + espaços

  function drawBarChart(cx, title, dataKey, maxVal) {
    ctx.font = '10px JetBrains Mono';
    ctx.fillStyle = '#6B7280';
    ctx.fillText(title, cx + sidePad, 20);
    const max = Math.max(1, ...enigmas.map(e => maxVal || (store[dataKey] && store[dataKey][e]) || 0));
    enigmas.forEach((e, i) => {
      const val = (store[dataKey] && store[dataKey][e]) || 0;
      const x = cx + sidePad + i * (barW + 8);
      const barH = (val / max) * 120;
      ctx.fillStyle = colors[i];
      ctx.fillRect(x, 130 - barH, barW, barH);
      ctx.fillStyle = '#9CA3AF';
      ctx.fillText(labels[i], x + 4, 145);
      ctx.fillStyle = '#E8E8E8';
      ctx.fillText(String(val), x + 4, 140 - barH - 4);
    });
  }

  drawBarChart(0, 'TEMPO (s)', 'timePerEnigma');
  drawBarChart(halfW, 'TENTATIVAS', 'attempts');

  // Erros por tipo
  const errorTypes = Object.entries(store.errorsByType);
  if (errorTypes.length > 0) {
    ctx.font = '10px JetBrains Mono';
    ctx.fillStyle = '#6B7280';
    let y = 175;
    ctx.fillText('ERROS:', 20, y); y += 16;
    errorTypes.forEach(([type, count]) => {
      ctx.fillStyle = '#FF6A00';
      ctx.fillText(`${type}: ${count}`, 30, y); y += 14;
    });
  }

  // Hints
  const totalHints = Object.values(store.hintsUsed).reduce((a, b) => a + b, 0);
  ctx.fillStyle = '#9CA3AF';
  ctx.fillText(`Hints: ${totalHints}`, halfW + sidePad, 175);
}

export function renderResolution(container, state, analytics) {
  const totalTime = state.timeElapsed;
  const minutes = Math.floor(totalTime / 60);
  const seconds = totalTime % 60;
  const screenTimer = createTimer();

  container.innerHTML = `
    <div class="screen screen-resolution" data-active="true">
      <div class="resolution-title">O CONHECIMENTO FOI PRESERVADO</div>
      <div class="resolution-subtitle">Bio-servidor reiniciado com sucesso.</div>
      <div style="margin-top:32px;font-family:var(--font-mono);font-size:14px;color:var(--color-muted);line-height:2;">
        <div>Tempo total: ${minutes}:${seconds.toString().padStart(2, '0')}</div>
        <div>Tentativas (E1): ${state.attempts.enigma1}</div>
        <div>Tentativas (E2): ${state.attempts.enigma2}</div>
        <div>Tentativas (E3): ${state.attempts.enigma3}</div>
        <div>Total: ${state.attempts.enigma1 + state.attempts.enigma2 + state.attempts.enigma3}</div>
        <div>Checkpoints: ${state.checkpoints.length}/3</div>
      </div>
      <div style="margin-top:24px;font-size:13px;color:var(--color-data);font-family:var(--font-mono);">
        Subsistemas restaurados: Circuitos Lógicos &gt; Mapa de Dados &gt; Módulo Cognitivo
      </div>
      <div id="dashboard-container"></div>
      <button id="export-btn" style="margin-top:16px;padding:8px 20px;font-family:var(--font-mono);font-size:13px;color:var(--color-green);background:transparent;border:1px solid var(--color-green);border-radius:4px;cursor:pointer;">📋 Exportar Dados (JSON)</button>
    </div>
  `;

  playHealSound();

  // Renderizar dashboard
  const dashContainer = container.querySelector('#dashboard-container');
  renderDashboard(dashContainer, analytics.store);

  // Exportação
  document.getElementById('export-btn').addEventListener('click', () => {
    const json = analytics.exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `escape-stats-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });
}
```

- [ ] **Step 4: Rodar testes**

Run: `npm test`
Expected: Todos passando

- [ ] **Step 5: Verificar build**

Run: `npm run build`
Expected: Build OK

- [ ] **Step 6: Commit**

```bash
git add js/main.js js/screens/enigma-1.js js/screens/enigma-2.js js/screens/enigma-3.js js/screens/resolution.js
git commit -m "feat: integrate analytics tracking across all screens and add dashboard"
```

---

### Task 7: Implementar hint contextual

**Files:**
- Modify: `js/screens/enigma-1.js`
- Modify: `js/screens/enigma-2.js`
- Modify: `js/screens/enigma-3.js`

- [ ] **Step 1: Adicionar botão de hint no enigma-1.js**

No template HTML do `renderRound()`, adicionar no cabeçalho:

```js
// Dentro do .puzzle-header, adicionar:
<div style="position:relative;">
  <button class="hint-btn" aria-label="Obter dica" style="width:32px;height:32px;border:1px solid rgba(139,92,246,0.4);border-radius:50%;background:rgba(139,92,246,0.1);color:var(--color-biolum-start);font-family:var(--font-display);font-size:16px;font-weight:700;cursor:pointer;transition:all 0.3s ease;">?</button>
  <div class="hint-bubble" style="display:none;position:absolute;top:40px;right:0;width:280px;padding:12px;font-size:12px;color:var(--color-biolum-start);background:rgba(0,0,0,0.9);border:1px solid rgba(139,92,246,0.3);border-radius:4px;z-index:100;font-family:var(--font-mono);line-height:1.6;">
    DICA: Compare bit a bit. AND: 1&1=1, OR: 0|1=1, NAND: inverte AND.
  </div>
</div>
```

E adicionar event listener no fim do `renderRound()`:

```js
const hintBtn = container.querySelector('.hint-btn');
const hintBubble = container.querySelector('.hint-bubble');
if (hintBtn) {
  hintBtn.addEventListener('click', () => {
    const isVisible = hintBubble.style.display === 'block';
    hintBubble.style.display = isVisible ? 'none' : 'block';
    analytics.record('hint', { enigma: 'enigma1' });
  });
}
```

- [ ] **Step 2: Adicionar hint no enigma-2.js**

Dica para E2:
```
DICA: Siga as chaves estrangeiras — elas revelam a entidade faltante.
```

- [ ] **Step 3: Adicionar hint no enigma-3.js**

Dica para E3:
```
DICA: Simule a execução manualmente — o erro está na condição de parada.
```

- [ ] **Step 4: Rodar testes**

Run: `npm test`
Expected: Todos passando

- [ ] **Step 5: Commit**

```bash
git add js/screens/enigma-1.js js/screens/enigma-2.js js/screens/enigma-3.js
git commit -m "feat: add contextual hint button to all puzzle screens"
```

---

### Task 8: Implementar acessibilidade

**Files:**
- Modify: `css/design-system.css`
- Modify: `css/screens.css`

- [ ] **Step 1: Atualizar cor de contraste no design-system.css**

```css
/* design-system.css */
--color-muted: #9CA3AF;  /* antes: #6B7280 — ratio sobe de 5.6:1 para 7.2:1 */
```

- [ ] **Step 2: Adicionar prefers-reduced-motion e prefers-contrast no design-system.css**

```css
/* Fim do design-system.css, antes do fechamento do @layer */

@media (prefers-reduced-motion: reduce) {
  :root {
    --reduce-motion: true;
  }
}

@media (prefers-contrast: more) {
  :root {
    --color-text: #FFFFFF;
    --color-muted: #D1D5DB;
    --glow-green: 0 0 0 transparent;
    --glow-biolum: 0 0 0 transparent;
    --glow-data: 0 0 0 transparent;
    --glow-critical: 0 0 0 transparent;
  }
}
```

- [ ] **Step 3: Adicionar regras de reduced-motion no screens.css**

```css
/* screens.css — no final */
@media (prefers-reduced-motion: reduce) {
  .boot-line {
    animation: none !important;
    width: 100% !important;
    border-right: none !important;
  }
  .boot-progress-fill {
    animation: none !important;
    width: 100% !important;
  }
  .scanlines-overlay {
    display: none !important;
  }
  .timer-bar {
    transition: none !important;
  }
}
```

- [ ] **Step 4: Adicionar :focus-visible no design-system.css**

```css
/* design-system.css — dentro do @layer, adicionar */
:focus-visible {
  outline: 2px solid var(--color-data);
  outline-offset: 2px;
}

button:focus-visible {
  box-shadow: 0 0 0 2px var(--color-data), 0 0 12px rgba(0, 212, 255, 0.3);
}
```

- [ ] **Step 5: Adicionar atributos ARIA nos templates das screens**

```js
// boot.js — no container .screen-boot
role="region" aria-label="Inicialização do bio-servidor"

// enigma-1.js — no .screen-puzzle
role="region" aria-label="Enigma 1: Circuitos Lógicos"

// enigma-2.js
role="region" aria-label="Enigma 2: Mapa de Dados Corrompido"

// enigma-3.js
role="region" aria-label="Enigma 3: Loop Recursivo"

// resolution.js
role="region" aria-label="Resolução"

// Feedback area
<div class="feedback-text" aria-live="polite" role="status"></div>

// Timer bar
role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"
```

- [ ] **Step 6: Rodar build para verificar**

Run: `npm run build`
Expected: OK

- [ ] **Step 7: Commit**

```bash
git add css/design-system.css css/screens.css js/screens/boot.js js/screens/enigma-1.js js/screens/enigma-2.js js/screens/enigma-3.js js/screens/resolution.js
git commit -m "fix: improve accessibility - contrast, ARIA, reduced-motion, focus-visible"
```

---

### Task 9: Responsividade mobile

**Files:**
- Modify: `css/screens.css`
- Modify: `js/particles.js`

- [ ] **Step 1: Adicionar media queries no screens.css**

```css
/* screens.css — antes do @media prefers-reduced-motion */

/* Tablet / mobile landscape */
@media (max-width: 768px) {
  .screen {
    padding: 16px;
  }

  .puzzle-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .puzzle-area {
    padding: 0 8px;
  }

  .gate-options,
  .entity-btn,
  .trace-btn,
  .fix-btn {
    width: 100%;
  }

  button.gate-btn,
  button.entity-btn,
  button.trace-btn,
  button.fix-btn {
    padding: 14px 20px;
    font-size: 16px;
    min-height: 44px;
  }

  pre {
    font-size: 11px !important;
    padding: 12px !important;
  }

  .resolution-title {
    font-size: 24px;
  }

  .timer-bar {
    width: 4px !important;
  }
}

/* Mobile portrait */
@media (max-width: 480px) {
  .timer-bar {
    right: auto !important;
    left: 0 !important;
    bottom: 0 !important;
    top: auto !important;
    width: 100% !important;
    height: 4px !important;
    background: linear-gradient(to right, var(--color-green) 50%, rgba(0,0,0,0.8) 50%) !important;
  }

  .boot-progress {
    width: 90vw;
  }

  .boot-terminal .boot-line {
    font-size: 12px;
  }
}

/* Landscape em telas pequenas */
@media (orientation: landscape) and (max-height: 500px) {
  .screen {
    padding: 8px;
  }
  .puzzle-header {
    margin-bottom: 8px;
  }
  .puzzle-area {
    gap: 6px;
  }
}
```

- [ ] **Step 2: Adaptar partículas para mobile**

```js
// js/particles.js — dentro de createNeuralParticles, após definir canvas:
const isMobile = window.matchMedia('(max-width: 768px)').matches;
const particleCount = isMobile ? 15 : 50;

// Substituir:
// const particles = Array.from({ length: 50 }, () => ({...}))
// por:
const particles = Array.from({ length: particleCount }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  vx: (Math.random() - 0.5) * 0.3,
  vy: -Math.random() * 0.5 - 0.1,
  size: Math.random() * 2 + 1,
  opacity: Math.random() * 0.5 + 0.1,
  hue: Math.random() > 0.5 ? 139 : 212,
}));
```

- [ ] **Step 3: Verificar build**

Run: `npm run build`
Expected: OK

- [ ] **Step 4: Rodar testes**

Run: `npm test`
Expected: 49+ tests passing

- [ ] **Step 5: Commit**

```bash
git add css/screens.css js/particles.js
git commit -m "feat: add mobile responsiveness - breakpoints, touch targets, adaptive particles"
```

---

### Task 10: Verificação final e build de produção

**Files:**
- Nenhum — verificação apenas

- [ ] **Step 1: Rodar todos os testes**

Run: `npm test`
Expected: Todos passando

- [ ] **Step 2: Build de produção**

Run: `npm run build`
Expected: Build OK, bundle < 35KB gzip

- [ ] **Step 3: Listar arquivos modificados**

Run: `git status --short`
Expected: Visão geral de todos os arquivos alterados

- [ ] **Step 4: Verificar o diff total**

Run: `git diff --stat`
Expected: Panorama de linhas adicionadas/removidas

- [ ] **Step 5: Commit final se necessário**

```bash
git add -A
git commit -m "chore: final review and production build"
```

---

## Resumo de Arquivos

| Arquivo | Ação | Task |
|---|---|---|
| `js/dom-utils.js` | Criar | 1 |
| `js/dom-utils.test.js` | Criar | 1 |
| `js/analytics.js` | Criar | 5 |
| `js/analytics.test.js` | Criar | 5 |
| `js/main.js` | Modificar | 6 |
| `js/screens/boot.js` | Modificar | 2, 4, 8 |
| `js/screens/enigma-1.js` | Modificar | 2, 6, 7, 8 |
| `js/screens/enigma-2.js` | Modificar (refactor) | 2, 3, 6, 7, 8 |
| `js/screens/enigma-3.js` | Modificar | 2, 6, 7, 8 |
| `js/screens/resolution.js` | Modificar | 2, 6, 8 |
| `js/particles.js` | Modificar | 9 |
| `src/puzzles/enigma-2-logic.js` | Modificar | 3 |
| `src/puzzles/enigma-2-logic.test.js` | Modificar | 3 |
| `css/design-system.css` | Modificar | 8 |
| `css/screens.css` | Modificar | 8, 9 |

## Testes

| Suite | Estado | Tests |
|---|---|---|
| `js/dom-utils.test.js` | Novo | 3 |
| `js/analytics.test.js` | Novo | 7 |
| `js/state-machine.test.js` | Existente | 7 |
| `js/timer.test.js` | Existente | 11 |
| `js/feedback.test.js` | Existente | 7 |
| `src/puzzles/enigma-1-logic.test.js` | Existente | 4 |
| `src/puzzles/enigma-2-logic.test.js` | Expandido | 4 → 9 |
| `src/puzzles/enigma-3-logic.test.js` | Existente | 9 |
| **Total** | | **44 → ~57** |
