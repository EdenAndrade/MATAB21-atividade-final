import { ROUNDS, validateGate } from '../../src/puzzles/enigma-1-logic.js';
import { showFeedback } from '../feedback.js';
import { playCorrectSound, playErrorSound } from '../audio.js';
import { createTimer } from '../dom-utils.js';

export function renderEnigma1(container, stateMachine, analytics) {
  const screenTimer = createTimer();
  let currentRound = 0;
  const totalRounds = ROUNDS.length;
  let errorsInStep = 0;
  let progress = 0;

  function renderRound() {
    screenTimer.clearAll();
    const round = ROUNDS[currentRound];
    container.innerHTML = `
      <div class="screen screen-puzzle" data-active="true" role="region" aria-label="Enigma 1: Circuitos Lógicos">
        <div class="puzzle-header">
          <div>
            <div class="puzzle-title">Circuito Lógico</div>
            <div class="puzzle-subsystem">SUBSISTEMA: SALA DE CIRCUITOS</div>
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            <div style="font-family:var(--font-mono);font-size:12px;color:var(--color-muted);">
              Rodada ${currentRound + 1}/${totalRounds}
            </div>
            <div style="position:relative;">
              <button class="hint-btn" aria-label="Obter dica" style="width:32px;height:32px;border:1px solid rgba(139,92,246,0.4);border-radius:50%;background:rgba(139,92,246,0.1);color:#a855f7;font-family:var(--font-display);font-size:16px;font-weight:700;cursor:pointer;transition:all 0.3s ease;">?</button>
              <div class="hint-bubble" style="display:none;position:absolute;top:40px;right:0;width:280px;padding:12px;font-size:12px;color:#a855f7;background:rgba(0,0,0,0.9);border:1px solid rgba(139,92,246,0.3);border-radius:4px;z-index:100;font-family:var(--font-mono);line-height:1.6;">
                DICA: Compare bit a bit. AND: 1&amp;1=1, OR: 0|1=1, NAND: inverte AND.
              </div>
            </div>
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

    const hintBtn = container.querySelector('.hint-btn');
    const hintBubble = container.querySelector('.hint-bubble');
    if (hintBtn && analytics) {
      hintBtn.addEventListener('click', () => {
        const isVisible = hintBubble.style.display === 'block';
        hintBubble.style.display = isVisible ? 'none' : 'block';
        analytics.record('hint', { enigma: 'enigma1' });
      });
    }

    container.querySelectorAll('.gate-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const selected = btn.dataset.gate;
        container.querySelectorAll('button').forEach(b => b.style.pointerEvents = 'none');
        stateMachine.recordAttempt('enigma1');
        const result = validateGate(round, selected);
        const feedbackZone = container.querySelector('#feedback-zone');

        if (result.correct) {
          playCorrectSound();
          showFeedback('enigma1', 'success', progress, feedbackZone);
          btn.style.cssText = `padding:12px 24px;font-family:var(--font-mono);font-size:18px;font-weight:700;color:var(--color-green);background:rgba(0,255,65,0.15);border:1px solid var(--color-green);border-radius:4px;`;

          progress++;
          errorsInStep = 0;

          // Show Continue button instead of auto-advance
          const continueBtn = document.createElement('button');
          continueBtn.className = 'continue-btn';
          continueBtn.textContent = '[ Enter ] Continuar';
          feedbackZone.appendChild(continueBtn);
          continueBtn.focus();
          continueBtn.addEventListener('click', () => {
            if (currentRound < totalRounds - 1) {
              currentRound++;
              renderRound();
            } else {
              stateMachine.completeEnigma();
            }
          });
        } else {
          analytics.record('error', { reason: 'wrong-gate', enigma: 'enigma1' });
          analytics.record('attempt', { enigma: 'enigma1' });
          playErrorSound();
          errorsInStep++;
          const errIdx = Math.min(errorsInStep - 1, 3);
          showFeedback('enigma1', 'error', errIdx, feedbackZone);
          btn.style.cssText = `padding:12px 24px;font-family:var(--font-mono);font-size:18px;font-weight:700;color:var(--color-critical);background:rgba(255,0,51,0.1);border:1px solid var(--color-critical);border-radius:4px;animation:shake 0.3s ease;`;

          // Add error explanation
          const explanationEl = document.createElement('div');
          explanationEl.className = 'error-explanation';
          explanationEl.textContent = `"${selected}" retorna ${result.output} para A=${round.a}, B=${round.b}. A saída esperada é ${result.expected}. A porta correta é "${round.correctGate}".`;
          feedbackZone.appendChild(explanationEl);

          screenTimer.setTimeout(() => { renderRound(); }, 2500);
        }
      });
    });
  }

  renderRound();
}
