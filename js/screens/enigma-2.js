import { ROUNDS, validateEntity, validateRelationship } from '../../src/puzzles/enigma-2-logic.js';
import { showFeedback } from '../feedback.js';
import { playCorrectSound, playErrorSound } from '../audio.js';
import { createTimer } from '../dom-utils.js';

export function renderEnigma2(container, stateMachine) {
  const screenTimer = createTimer();
  const round = ROUNDS[0];
  let step = 0;
  let errorsInStep = 0;

  function renderStep() {
    screenTimer.clearAll();
    if (step === 0) {
      container.innerHTML = `
        <div class="screen screen-puzzle" data-active="true">
          <div class="puzzle-header">
            <div>
              <div class="puzzle-title">Mapa de Dados</div>
              <div class="puzzle-subsystem">SUBSISTEMA: SALA DE DADOS</div>
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
            <div style="font-size:13px;color:var(--color-muted);margin-bottom:16px;font-family:var(--font-mono);">
              Qual entidade está faltando?
            </div>
            <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center;">
              ${[...round.entities, round.missingEntity].map(e => `
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

      container.querySelectorAll('.entity-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          container.querySelectorAll('button').forEach(b => b.style.pointerEvents = 'none');
          stateMachine.recordAttempt('enigma2');
          const result = validateEntity(0, btn.dataset.entity);
          const feedbackZone = container.querySelector('#feedback-zone');

          if (result.correct) {
            playCorrectSound();
            showFeedback('enigma2', 'success', 0, feedbackZone);
            errorsInStep = 0;
            step = 1;
            screenTimer.setTimeout(renderStep, 1200);
          } else {
            playErrorSound();
            errorsInStep++;
            showFeedback('enigma2', 'error', Math.min(errorsInStep - 1, 3), feedbackZone);
            btn.style.animation = 'shake 0.3s ease';
          }
        });
      });
    } else if (step === 1) {
      container.innerHTML = `
        <div class="screen screen-puzzle" data-active="true">
          <div class="puzzle-header">
            <div>
              <div class="puzzle-title">Mapa de Dados</div>
              <div class="puzzle-subsystem">SUBSISTEMA: SALA DE DADOS</div>
            </div>
          </div>

          <div class="puzzle-area">
            <div style="font-family:var(--font-mono);font-size:14px;color:var(--color-green);margin-bottom:16px;">
              Entidade "disciplina" restaurada. ✓
            </div>
            <div style="font-size:13px;color:var(--color-muted);margin-bottom:16px;font-family:var(--font-mono);">
              Agora reconecte os relacionamentos. Qual relacionamento liga "aluno" a "disciplina"?
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
            <div class="feedback-zone" id="feedback-zone"></div>
          </div>

          <div class="puzzle-footer">
            <div style="font-family:var(--font-mono);font-size:12px;color:var(--color-muted);">
              Passo 2/2: Conectar relacionamentos
            </div>
          </div>
        </div>
      `;

      container.querySelectorAll('.rel-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          container.querySelectorAll('button').forEach(b => b.style.pointerEvents = 'none');
          stateMachine.recordAttempt('enigma2');
          const result = validateRelationship(0, btn.dataset.rel);
          const feedbackZone = container.querySelector('#feedback-zone');

          if (result.correct) {
            playCorrectSound();
            showFeedback('enigma2', 'success', 0, feedbackZone);
            screenTimer.setTimeout(() => { stateMachine.completeEnigma(); }, 1500);
          } else {
            playErrorSound();
            errorsInStep++;
            showFeedback('enigma2', 'error', Math.min(errorsInStep - 1, 3), feedbackZone);
            btn.style.animation = 'shake 0.3s ease';
          }
        });
      });
    }
  }

  renderStep();
}
