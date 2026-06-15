const DIAGNOSTICS = {
  enigma1: {
    error: [
      'SINAL INTERMITENTE. PORTA LÓGICA INCORRETA.',
      'FLUXO DE DADOS INCOMPATÍVEL. TABELA VERDADE NÃO CORRESPONDE.',
      'RECALIBRANDO... VERIFICAR TABELA VERDADE DA PORTA SELECIONADA.',
      'DICA: A saída esperada determina qual porta completa o circuito. Compare bit a bit.',
    ],
    partial: [
      'MÓDULO PARCIALMENTE REATIVADO. 30% DE EFICIÊNCIA.',
      'CIRCUITO PARCIAL. 60% OPERACIONAL.',
      'CONEXÕES NEURAIS ESTABILIZANDO. 80% COMPLETO.',
    ],
  },
  enigma2: {
    error: [
      'RELACIONAMENTO ÓRFÃO DETECTADO. ENTIDADE AUSENTE.',
      'INCOMPATIBILIDADE DE CHAVES. ENTIDADE INVÁLIDA.',
      'MODELO CORROMPIDO. VERIFICAR CARDINALIDADE DOS RELACIONAMENTOS.',
      'DICA: Siga as chaves estrangeiras — elas revelam a entidade faltante.',
    ],
    partial: [
      'ENTIDADE POSICIONADA. 30% DO MAPA RECONSTRUÍDO.',
      'CONEXÕES PARCIALMENTE RESTAURADAS. 60% DE INTEGRIDADE.',
      'MAPEAMENTO QUASE COMPLETO. 80% DOS DADOS RECUPERADOS.',
    ],
  },
  enigma3: {
    error: [
      'LOOP RECURSIVO DETECTADO. CASO BASE INVÁLIDO.',
      'STACK TRACE PARCIAL. A CONDIÇÃO DE PARADA NUNCA É ATINGIDA.',
      'RECURSÃO INFINITA. VERIFICAR SE O CASO BASE RETORNA O VALOR CORRETO.',
      'DICA: Simule a execução manualmente — o erro está na condição de parada.',
    ],
    partial: [
      'MÓDULO COGNITIVO PARCIALMENTE ESTÁVEL. 30% DEPURADO.',
      'LOOP DESACELERANDO. 60% DO CÓDIGO VERIFICADO.',
      'RECURSÃO CONTROLADA. 80% DO ALGORITMO CORRETO.',
    ],
  },
};

export function getFeedbackLevel(progress, attempts) {
  if (attempts >= 4) return 4;
  if (progress >= 3) return 3;
  if (progress > 0 && attempts > 0) return 2;
  if (attempts > 0) return 1;
  return 0;
}

export function getFeedbackMessage(enigmaId, type, stepIndex) {
  const enigmaMsgs = DIAGNOSTICS[enigmaId];
  if (!enigmaMsgs) return 'SISTEMA INSTÁVEL. TENTE NOVAMENTE.';
  const messages = enigmaMsgs[type];
  if (!messages) return 'SISTEMA INSTÁVEL. TENTE NOVAMENTE.';
  const idx = Math.min(stepIndex, messages.length - 1);
  return messages[idx];
}

export function showFeedback(enigmaId, type, stepIndex, container) {
  const msg = getFeedbackMessage(enigmaId, type, stepIndex);
  const existing = container.querySelector('.feedback-text');
  if (existing) existing.remove();

  const el = document.createElement('div');
  el.className = `feedback-text feedback-${type}`;
  el.textContent = msg;
  el.setAttribute('aria-live', 'polite');
  el.setAttribute('role', 'status');
  container.appendChild(el);

  if (type === 'error' || type === 'partial') {
    setTimeout(() => { el.remove(); }, 4000);
  }
}
