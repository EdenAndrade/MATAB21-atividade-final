import { ROUNDS, validateTrace, identifyErrorLine, validateFix } from '../../src/puzzles/enigma-3-logic.js';
import { showFeedback } from '../feedback.js';
import { playCorrectSound, playErrorSound, playHealSound } from '../audio.js';

export function renderEnigma3(container, stateMachine) {
  let currentRound = 0;
  let step = 0;
  let errorsInStep = 0;

  function renderStep() {
    const round = ROUNDS[currentRound];

    if (step === 0) {
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
            showFeedback('enigma3', 'error', Math.min(errorsInStep - 1, 3), feedbackZone);
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

      container.querySelectorAll('.code-line').forEach(el => {
        el.addEventListener('mouseenter', () => { el.style.background = 'rgba(255,0,51,0.1)'; });
        el.addEventListener('mouseleave', () => { el.style.background = 'transparent'; });
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
            showFeedback('enigma3', 'error', Math.min(errorsInStep - 1, 3), feedbackZone);
            el.style.background = 'rgba(255,0,51,0.15)';
            setTimeout(() => { el.style.background = 'transparent'; }, 800);
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
              setTimeout(() => { stateMachine.completeEnigma(); }, 2000);
            }
          } else {
            playErrorSound();
            errorsInStep++;
            showFeedback('enigma3', 'error', Math.min(errorsInStep - 1, 3), feedbackZone);
            btn.style.animation = 'shake 0.3s ease';
          }
        });
      });
    }
  }

  renderStep();
}
