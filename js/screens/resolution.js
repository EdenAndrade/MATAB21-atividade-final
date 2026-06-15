import { playHealSound, playFlatline } from '../audio.js';

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
      <div style="margin-top:24px;font-size:13px;color:var(--color-data);font-family:var(--font-mono);">
        Subsistemas restaurados: Circuitos Lógicos &gt; Mapa de Dados &gt; Módulo Cognitivo
      </div>
    </div>
  `;

  playHealSound();
}

export function renderGameOver(container, stateMachine) {
  playFlatline();

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
