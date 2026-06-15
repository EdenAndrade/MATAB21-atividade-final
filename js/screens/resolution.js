import { playHealSound, playFlatline } from '../audio.js';

function renderDashboard(container, store) {
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

  const halfW = cssW / 2;
  const sidePad = 20;
  const chartWidth = halfW - sidePad * 2;
  const barW = chartWidth / 4;

  function drawBarChart(cx, title, dataSource, maxFn) {
    ctx.font = '10px JetBrains Mono';
    ctx.fillStyle = '#6B7280';
    ctx.fillText(title, cx + sidePad, 20);
    const max = Math.max(1, ...enigmas.map(e => dataSource[e] || 0));
    enigmas.forEach((e, i) => {
      const val = dataSource[e] || 0;
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

  drawBarChart(0, 'TEMPO (s)', store.timePerEnigma);
  drawBarChart(halfW, 'TENTATIVAS', store.attempts);

  // Erros por tipo
  const errorEntries = Object.entries(store.errorsByType);
  if (errorEntries.length > 0) {
    ctx.font = '10px JetBrains Mono';
    ctx.fillStyle = '#6B7280';
    let y = 175;
    ctx.fillText('ERROS:', 20, y); y += 16;
    errorEntries.forEach(([type, count]) => {
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
  const totalAttempts = state.attempts.enigma1 + state.attempts.enigma2 + state.attempts.enigma3;

  container.innerHTML = `
    <div class="screen screen-resolution" data-active="true" role="region" aria-label="Resolução do bio-servidor">
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
      <div id="dashboard-container"></div>
      <button id="export-btn" style="margin-top:16px;padding:8px 20px;font-family:var(--font-mono);font-size:13px;color:var(--color-green);background:transparent;border:1px solid var(--color-green);border-radius:4px;cursor:pointer;">📋 Exportar Dados (JSON)</button>
      <div style="margin-top:24px;font-size:13px;color:var(--color-data);font-family:var(--font-mono);">
        Subsistemas restaurados: Circuitos Lógicos &gt; Mapa de Dados &gt; Módulo Cognitivo
      </div>
    </div>
  `;

  playHealSound();

  // Renderizar dashboard
  const dashContainer = container.querySelector('#dashboard-container');
  renderDashboard(dashContainer, analytics.store);

  // Exportação
  container.querySelector('#export-btn').addEventListener('click', () => {
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

export function renderGameOver(container, stateMachine) {
  playFlatline();

  container.innerHTML = `
    <div class="screen screen-gameover" data-active="true" role="region" aria-label="Game Over: Conexão Perdida">
      <div class="gameover-title">CONEXÃO PERDIDA</div>
      <div class="gameover-subtitle">SISTEMA IRRECUPERÁVEL.</div>
      <div style="margin-top:16px;font-family:var(--font-mono);font-size:12px;color:var(--color-muted);">
        O bio-servidor não resistiu. O conhecimento se perdeu.
      </div>
      <button class="gameover-btn" id="restart-btn">REINICIAR</button>
    </div>
  `;

  container.querySelector('#restart-btn')?.addEventListener('click', () => {
    window.location.reload();
  });
}
