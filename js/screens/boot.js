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
