import { ROUNDS, validateEntity, validateRelationship } from '../../src/puzzles/enigma-2-logic.js';
import { showFeedback } from '../feedback.js';
import { playCorrectSound, playErrorSound } from '../audio.js';
import { createTimer } from '../dom-utils.js';

export function renderEnigma2(container, stateMachine, analytics) {
  const screenTimer = createTimer();
  let currentRound = 0;
  let step = 0;
  let errorsInStep = 0;

  function renderStep() {
    screenTimer.clearAll();
    const round = ROUNDS[currentRound];
    if (step === 0) {
      container.innerHTML = `
        <div class="screen screen-puzzle" data-active="true" role="region" aria-label="Enigma 2: Mapa de Dados Corrompido">
          <div class="puzzle-header">
            <div>
              <div class="puzzle-title">Mapa de Dados</div>
              <div class="puzzle-subsystem">SUBSISTEMA: SALA DE DADOS</div>
            </div>
            <div style="display:flex;align-items:center;gap:8px;">
              <div style="font-family:var(--font-mono);font-size:12px;color:var(--color-muted);">
                Rodada ${currentRound + 1}/${ROUNDS.length}
              </div>
              <div style="position:relative;">
                <button class="hint-btn" aria-label="Obter dica" style="width:32px;height:32px;border:1px solid rgba(139,92,246,0.4);border-radius:50%;background:rgba(139,92,246,0.1);color:#a855f7;font-family:var(--font-display);font-size:16px;font-weight:700;cursor:pointer;transition:all 0.3s ease;">?</button>
                <div class="hint-bubble" style="display:none;position:absolute;top:40px;right:0;width:280px;padding:12px;font-size:12px;color:#a855f7;background:rgba(0,0,0,0.9);border:1px solid rgba(139,92,246,0.3);border-radius:4px;z-index:100;font-family:var(--font-mono);line-height:1.6;">
                  DICA: Relacionamentos N:N podem exigir uma entidade associativa.
                </div>
              </div>
            </div>
          </div>

          <div class="puzzle-area">
            <div class="round-indicator" style="font-family:var(--font-mono);font-size:12px;color:var(--color-muted);text-align:center;margin-bottom:12px;">
              Rodada ${currentRound + 1} de ${ROUNDS.length}
            </div>
            <div style="font-family:var(--font-mono);font-size:14px;color:var(--color-muted);margin-bottom:16px;">
              O DER está corrompido. Uma entidade foi perdida.
              Entidades visíveis: <span style="color:var(--color-data)">${round.entities.filter(e => e !== round.missingEntity).join(', ')}</span>
            </div>
            <div style="font-family:var(--font-mono);font-size:13px;color:var(--color-muted);margin-bottom:20px;">
              Relacionamentos órfãos: <span style="color:var(--color-alert)">${round.relationships.join(', ')}</span>
            </div>
            ${currentRound === 1 ? '<div style="font-family:var(--font-mono);font-size:13px;color:#a855f7;margin-bottom:12px;">DICA: Relacionamentos N:N podem exigir uma entidade associativa.</div>' : ''}
            <div style="font-size:13px;color:var(--color-muted);margin-bottom:16px;font-family:var(--font-mono);">
              Qual entidade está faltando?
            </div>
            <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center;">
              ${[...new Set([...round.entities, round.missingEntity])].map(e => `
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
            <div class="feedback-zone" id="feedback-zone"></div>
          </div>

          <div class="puzzle-footer">
            <div style="font-family:var(--font-mono);font-size:12px;color:var(--color-muted);">
              Passo 1/2: Identificar entidade
            </div>
          </div>
        </div>
      `;

      const hintBtn = container.querySelector('.hint-btn');
      const hintBubble = container.querySelector('.hint-bubble');
      if (hintBtn && analytics) {
        hintBtn.addEventListener('click', () => {
          const isVisible = hintBubble.style.display === 'block';
          hintBubble.style.display = isVisible ? 'none' : 'block';
          analytics.record('hint', { enigma: 'enigma2' });
        });
      }

      container.querySelectorAll('.entity-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          container.querySelectorAll('button').forEach(b => b.style.pointerEvents = 'none');
          stateMachine.recordAttempt('enigma2');
          const result = validateEntity(currentRound, btn.dataset.entity);
          const feedbackZone = container.querySelector('#feedback-zone');

          if (result.correct) {
            playCorrectSound();
            showFeedback('enigma2', 'success', 0, feedbackZone);
            errorsInStep = 0;
            step = 1;
            const continueBtn = document.createElement('button');
            continueBtn.className = 'continue-btn';
            continueBtn.textContent = '[ Enter ] Continuar';
            feedbackZone.appendChild(continueBtn);
            continueBtn.focus();
            continueBtn.addEventListener('click', renderStep);
          } else {
            analytics.record('error', { reason: 'wrong-entity', enigma: 'enigma2' });
            analytics.record('attempt', { enigma: 'enigma2' });
            playErrorSound();
            errorsInStep++;
            showFeedback('enigma2', 'error', Math.min(errorsInStep - 1, 3), feedbackZone);
            const explanationEl = document.createElement('div');
            explanationEl.className = 'error-explanation';
            explanationEl.textContent = `"${btn.dataset.entity}" não é a entidade ausente. A entidade faltante é "${round.missingEntity}".`;
            feedbackZone.appendChild(explanationEl);
            btn.style.animation = 'shake 0.3s ease';
            screenTimer.setTimeout(() => {
              explanationEl.remove();
              container.querySelectorAll('button').forEach(b => b.style.pointerEvents = '');
            }, 2500);
          }
        });
      });
    } else if (step === 1) {
      container.innerHTML = `
        <div class="screen screen-puzzle" data-active="true" role="region" aria-label="Enigma 2: Mapa de Dados Corrompido">
          <div class="puzzle-header">
            <div>
              <div class="puzzle-title">Mapa de Dados</div>
              <div class="puzzle-subsystem">SUBSISTEMA: SALA DE DADOS</div>
            </div>
            <div style="display:flex;align-items:center;gap:8px;">
              <div style="font-family:var(--font-mono);font-size:12px;color:var(--color-muted);">
                Rodada ${currentRound + 1}/${ROUNDS.length}
              </div>
              <div style="position:relative;">
                <button class="hint-btn" aria-label="Obter dica" style="width:32px;height:32px;border:1px solid rgba(139,92,246,0.4);border-radius:50%;background:rgba(139,92,246,0.1);color:#a855f7;font-family:var(--font-display);font-size:16px;font-weight:700;cursor:pointer;transition:all 0.3s ease;">?</button>
                <div class="hint-bubble" style="display:none;position:absolute;top:40px;right:0;width:280px;padding:12px;font-size:12px;color:#a855f7;background:rgba(0,0,0,0.9);border:1px solid rgba(139,92,246,0.3);border-radius:4px;z-index:100;font-family:var(--font-mono);line-height:1.6;">
                  DICA: Relacionamentos N:N podem exigir uma entidade associativa.
                </div>
              </div>
            </div>
          </div>

          <div class="puzzle-area">
            <div class="round-indicator" style="font-family:var(--font-mono);font-size:12px;color:var(--color-muted);text-align:center;margin-bottom:12px;">
              Rodada ${currentRound + 1} de ${ROUNDS.length}
            </div>
            <div style="font-family:var(--font-mono);font-size:14px;color:var(--color-green);margin-bottom:16px;">
              Entidade "${round.missingEntity}" restaurada. ✓
            </div>
            <div style="font-size:13px;color:var(--color-muted);margin-bottom:16px;font-family:var(--font-mono);">
              Agora reconecte os relacionamentos. Qual relacionamento liga "aluno" a "${round.missingEntity}"?
            </div>
            <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center;">
              ${round.relationships.map(r => `
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
            <div class="feedback-zone" id="feedback-zone"></div>
          </div>

          <div class="puzzle-footer">
            <div style="font-family:var(--font-mono);font-size:12px;color:var(--color-muted);">
              Passo 2/2: Conectar relacionamentos
            </div>
          </div>
        </div>
      `;

      const hintBtn = container.querySelector('.hint-btn');
      const hintBubble = container.querySelector('.hint-bubble');
      if (hintBtn && analytics) {
        hintBtn.addEventListener('click', () => {
          const isVisible = hintBubble.style.display === 'block';
          hintBubble.style.display = isVisible ? 'none' : 'block';
          analytics.record('hint', { enigma: 'enigma2' });
        });
      }

      container.querySelectorAll('.rel-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          container.querySelectorAll('button').forEach(b => b.style.pointerEvents = 'none');
          stateMachine.recordAttempt('enigma2');
          const result = validateRelationship(currentRound, btn.dataset.rel);
          const feedbackZone = container.querySelector('#feedback-zone');

          if (result.correct) {
            playCorrectSound();
            showFeedback('enigma2', 'success', 0, feedbackZone);
            if (currentRound < ROUNDS.length - 1) {
              currentRound++;
              step = 0;
              errorsInStep = 0;
              const continueBtn = document.createElement('button');
              continueBtn.className = 'continue-btn';
              continueBtn.textContent = '[ Enter ] Continuar';
              feedbackZone.appendChild(continueBtn);
              continueBtn.focus();
              continueBtn.addEventListener('click', renderStep);
            } else {
              const continueBtn = document.createElement('button');
              continueBtn.className = 'continue-btn';
              continueBtn.textContent = '[ Enter ] Ver resultado';
              feedbackZone.appendChild(continueBtn);
              continueBtn.focus();
              continueBtn.addEventListener('click', () => stateMachine.completeEnigma());
            }
          } else {
            analytics.record('error', { reason: 'wrong-relation', enigma: 'enigma2' });
            analytics.record('attempt', { enigma: 'enigma2' });
            playErrorSound();
            errorsInStep++;
            showFeedback('enigma2', 'error', Math.min(errorsInStep - 1, 3), feedbackZone);
            const explanationEl = document.createElement('div');
            explanationEl.className = 'error-explanation';
            explanationEl.textContent = `"${btn.dataset.rel}" não conecta "aluno" a "${round.missingEntity}". O relacionamento correto é "${round.correctRelationship}".`;
            feedbackZone.appendChild(explanationEl);
            btn.style.animation = 'shake 0.3s ease';
            screenTimer.setTimeout(() => {
              explanationEl.remove();
              container.querySelectorAll('button').forEach(b => b.style.pointerEvents = '');
            }, 3000);
          }
        });
      });
    }
  }

  renderStep();
}
