import { PHASES } from '../state-machine.js';
import { playBootSequence } from '../audio.js';
import { createTimer } from '../dom-utils.js';

export function renderBoot(container, stateMachine) {
  const timer = createTimer();

  container.innerHTML = `
    <div class="screen screen-boot" data-active="true" role="region" aria-label="Inicialização do bio-servidor">
      <div class="boot-terminal">
        <div class="boot-title">NÚCLEO EM COLAPSO</div>
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

  playBootSequence();

  timer.setTimeout(() => {
    stateMachine.transition(PHASES.ENIGMA1);
  }, 5500);
}
