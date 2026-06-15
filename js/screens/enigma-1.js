import { ROUNDS, validateGate } from '../../src/puzzles/enigma-1-logic.js';
import { showFeedback } from '../feedback.js';
import { playCorrectSound, playErrorSound } from '../audio.js';
import { createTimer } from '../dom-utils.js';

export function renderEnigma1(container, stateMachine) {
  const screenTimer = createTimer();
  let currentRound = 0;
  const totalRounds = ROUNDS.length;
  let errorsInStep = 0;
  let progress = 0;

  function renderRound() {
    screenTimer.clearAll();
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

        <div class="puzzle-area">
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

    container.querySelectorAll('.gate-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const selected = btn.dataset.gate;
        container.querySelectorAll('button').forEach(b => b.style.pointerEvents = 'none');
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
            screenTimer.setTimeout(() => { currentRound++; renderRound(); }, 1200);
          } else {
            screenTimer.setTimeout(() => { stateMachine.completeEnigma(); }, 1500);
          }
        } else {
          playErrorSound();
          errorsInStep++;
          const errIdx = Math.min(errorsInStep - 1, 3);
          showFeedback('enigma1', 'error', errIdx, feedbackZone);
          btn.style.cssText = `padding:12px 24px;font-family:var(--font-mono);font-size:18px;font-weight:700;color:var(--color-critical);background:rgba(255,0,51,0.1);border:1px solid var(--color-critical);border-radius:4px;animation:shake 0.3s ease;`;

          screenTimer.setTimeout(() => { renderRound(); }, 1000);
        }
      });
    });
  }

  renderRound();
}
