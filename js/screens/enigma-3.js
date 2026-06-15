import { ROUNDS, validateTrace, identifyErrorLine, validateFix } from '../../src/puzzles/enigma-3-logic.js';
import { showFeedback } from '../feedback.js';
import { playCorrectSound, playErrorSound, playHealSound } from '../audio.js';
import { createTimer } from '../dom-utils.js';

export function renderEnigma3(container, stateMachine, analytics) {
  const screenTimer = createTimer();
  let currentRound = 0;
  let step = 0;
  let errorsInStep = 0;

  function renderStep() {
    screenTimer.clearAll();
    const round = ROUNDS[currentRound];

    if (step === 0) {
      container.innerHTML = `
        <div class="screen screen-puzzle" data-active="true">
          <div class="puzzle-header">
            <div>
              <div class="puzzle-title">Loop Recursivo</div>
              <div class="puzzle-subsystem">SUBSISTEMA: MÓDULO COGNITIVO CENTRAL</div>
            </div>
            <div style="display:flex;align-items:center;gap:8px;">
              <div style="font-family:var(--font-mono);font-size:12px;color:var(--color-muted);">
                Rodada ${currentRound + 1}/${ROUNDS.length}
              </div>
              <div style="position:relative;">
                <button class="hint-btn" aria-label="Obter dica" style="width:32px;height:32px;border:1px solid rgba(139,92,246,0.4);border-radius:50%;background:rgba(139,92,246,0.1);color:#a855f7;font-family:var(--font-display);font-size:16px;font-weight:700;cursor:pointer;transition:all 0.3s ease;">?</button>
                <div class="hint-bubble" style="display:none;position:absolute;top:40px;right:0;width:280px;padding:12px;font-size:12px;color:#a855f7;background:rgba(0,0,0,0.9);border:1px solid rgba(139,92,246,0.3);border-radius:4px;z-index:100;font-family:var(--font-mono);line-height:1.6;">
                  DICA: Simule a execução manualmente. Rastreie o valor de cada variável a cada iteração.
                </div>
              </div>
            </div>
          </div>

          <div class="puzzle-area" style="align-items:stretch;">
            <pre style="font-family:var(--font-mono);font-size:13px;line-height:1.8;color:var(--color-text);background:rgba(0,0,0,0.4);padding:16px;border-radius:4px;overflow-x:auto;">
${round.code.map((line, i) => `${String(i + 1).padStart(2, '0')}  ${line}`).join('\n')}
            </pre>
            <div style="font-size:13px;color:var(--color-muted);margin-top:12px;font-family:var(--font-mono);">
              Qual é a saída da função?
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

      const hintBtn = container.querySelector('.hint-btn');
      const hintBubble = container.querySelector('.hint-bubble');
      if (hintBtn && analytics) {
        hintBtn.addEventListener('click', () => {
          const isVisible = hintBubble.style.display === 'block';
          hintBubble.style.display = isVisible ? 'none' : 'block';
          analytics.record('hint', { enigma: 'enigma3' });
        });
      }

      container.querySelectorAll('.trace-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          container.querySelectorAll('button').forEach(b => b.style.pointerEvents = 'none');
          stateMachine.recordAttempt('enigma3');
          const result = validateTrace(currentRound, parseInt(btn.dataset.value));
          const feedbackZone = container.querySelector('#feedback-zone');

          if (result.correct) {
            playCorrectSound();
            showFeedback('enigma3', 'success', 0, feedbackZone);
            errorsInStep = 0;
            step = 1;
            screenTimer.setTimeout(renderStep, 1200);
          } else {
            analytics.record('error', { reason: 'wrong-trace', enigma: 'enigma3' });
            analytics.record('attempt', { enigma: 'enigma3' });
            playErrorSound();
            errorsInStep++;
            showFeedback('enigma3', 'error', Math.min(errorsInStep - 1, 3), feedbackZone);
            container.querySelectorAll('button').forEach(b => b.style.pointerEvents = '');
          }
        });
      });
    } else if (step === 1) {
      container.innerHTML = `
        <div class="screen screen-puzzle" data-active="true">
          <div class="puzzle-header">
            <div>
              <div class="puzzle-title">Loop Recursivo</div>
              <div class="puzzle-subsystem">SUBSISTEMA: MÓDULO COGNITIVO CENTRAL</div>
            </div>
            <div style="position:relative;">
              <button class="hint-btn" aria-label="Obter dica" style="width:32px;height:32px;border:1px solid rgba(139,92,246,0.4);border-radius:50%;background:rgba(139,92,246,0.1);color:#a855f7;font-family:var(--font-display);font-size:16px;font-weight:700;cursor:pointer;transition:all 0.3s ease;">?</button>
              <div class="hint-bubble" style="display:none;position:absolute;top:40px;right:0;width:280px;padding:12px;font-size:12px;color:#a855f7;background:rgba(0,0,0,0.9);border:1px solid rgba(139,92,246,0.3);border-radius:4px;z-index:100;font-family:var(--font-mono);line-height:1.6;">
                DICA: Simule a execução manualmente. Rastreie o valor de cada variável a cada iteração.
              </div>
            </div>
          </div>

          <div class="puzzle-area" style="align-items:stretch;">
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

      const hintBtn = container.querySelector('.hint-btn');
      const hintBubble = container.querySelector('.hint-bubble');
      if (hintBtn && analytics) {
        hintBtn.addEventListener('click', () => {
          const isVisible = hintBubble.style.display === 'block';
          hintBubble.style.display = isVisible ? 'none' : 'block';
          analytics.record('hint', { enigma: 'enigma3' });
        });
      }

      container.querySelectorAll('.code-line').forEach(el => {
        el.addEventListener('mouseenter', () => { el.style.background = 'rgba(255,0,51,0.1)'; });
        el.addEventListener('mouseleave', () => { el.style.background = 'transparent'; });
        el.addEventListener('click', () => {
          container.querySelectorAll('.code-line').forEach(s => s.style.pointerEvents = 'none');
          const result = identifyErrorLine(currentRound, parseInt(el.dataset.line));
          const feedbackZone = container.querySelector('#feedback-zone');

          if (result.correct) {
            playCorrectSound();
            showFeedback('enigma3', 'success', 0, feedbackZone);
            el.style.background = 'rgba(0,255,65,0.15)';
            errorsInStep = 0;
            step = 2;
            screenTimer.setTimeout(renderStep, 1200);
          } else {
            analytics.record('error', { reason: 'wrong-error-line', enigma: 'enigma3' });
            analytics.record('attempt', { enigma: 'enigma3' });
            playErrorSound();
            errorsInStep++;
            showFeedback('enigma3', 'error', Math.min(errorsInStep - 1, 3), feedbackZone);
            el.style.background = 'rgba(255,0,51,0.15)';
            screenTimer.setTimeout(() => { el.style.background = 'transparent'; }, 800);
            container.querySelectorAll('.code-line').forEach(s => s.style.pointerEvents = '');
          }
        });
      });
    } else if (step === 2) {
      container.innerHTML = `
        <div class="screen screen-puzzle" data-active="true">
          <div class="puzzle-header">
            <div>
              <div class="puzzle-title">Loop Recursivo</div>
              <div class="puzzle-subsystem">SUBSISTEMA: MÓDULO COGNITIVO CENTRAL</div>
            </div>
            <div style="position:relative;">
              <button class="hint-btn" aria-label="Obter dica" style="width:32px;height:32px;border:1px solid rgba(139,92,246,0.4);border-radius:50%;background:rgba(139,92,246,0.1);color:#a855f7;font-family:var(--font-display);font-size:16px;font-weight:700;cursor:pointer;transition:all 0.3s ease;">?</button>
              <div class="hint-bubble" style="display:none;position:absolute;top:40px;right:0;width:280px;padding:12px;font-size:12px;color:#a855f7;background:rgba(0,0,0,0.9);border:1px solid rgba(139,92,246,0.3);border-radius:4px;z-index:100;font-family:var(--font-mono);line-height:1.6;">
                DICA: Simule a execução manualmente. Rastreie o valor de cada variável a cada iteração.
              </div>
            </div>
          </div>

          <div class="puzzle-area">
            <div style="font-family:var(--font-mono);font-size:14px;color:var(--color-green);margin-bottom:16px;">
              Linha ${round.errorLine} identificada. ✓
            </div>
            <div style="font-size:13px;color:var(--color-muted);margin-bottom:16px;font-family:var(--font-mono);">
              Escolha a correção correta:
            </div>
            <div style="display:flex;gap:12px;flex-direction:column;align-items:center;">
              ${round.fixOptions.map(fix => `
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

      const hintBtn = container.querySelector('.hint-btn');
      const hintBubble = container.querySelector('.hint-bubble');
      if (hintBtn && analytics) {
        hintBtn.addEventListener('click', () => {
          const isVisible = hintBubble.style.display === 'block';
          hintBubble.style.display = isVisible ? 'none' : 'block';
          analytics.record('hint', { enigma: 'enigma3' });
        });
      }

      container.querySelectorAll('.fix-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          container.querySelectorAll('button').forEach(b => b.style.pointerEvents = 'none');
          stateMachine.recordAttempt('enigma3');
          const result = validateFix(currentRound, btn.dataset.fix);
          const feedbackZone = container.querySelector('#feedback-zone');

          if (result.correct) {
            playHealSound();
            showFeedback('enigma3', 'success', 0, feedbackZone);

            if (currentRound < ROUNDS.length - 1) {
              currentRound++;
              step = 0;
              errorsInStep = 0;
              screenTimer.setTimeout(renderStep, 1500);
            } else {
              screenTimer.setTimeout(() => { stateMachine.completeEnigma(); }, 2000);
            }
          } else {
            analytics.record('error', { reason: 'wrong-fix', enigma: 'enigma3' });
            analytics.record('attempt', { enigma: 'enigma3' });
            playErrorSound();
            errorsInStep++;
            showFeedback('enigma3', 'error', Math.min(errorsInStep - 1, 3), feedbackZone);
            btn.style.animation = 'shake 0.3s ease';
            container.querySelectorAll('button').forEach(b => b.style.pointerEvents = '');
          }
        });
      });
    }
  }

  renderStep();
}
