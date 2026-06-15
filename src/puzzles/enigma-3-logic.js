export const ROUNDS = [
  {
    code: [
      'function fatorial(n) {',
      '  if (n <= 1) return n;',
      '  return n * fatorial(n - 1);',
      '}',
    ],
    correctTrace: 0,
    errorLine: 2,
    fixOptions: [
      'if (n <= 1) return 1;',
      'if (n <= 1) return n;',
      'if (n <= 1) return n + 1;',
    ],
    correctFix: 'if (n <= 1) return 1;',
  },
  {
    code: [
      'function buscaBinaria(arr, alvo, esq, dir) {',
      '  if (esq > dir) return -1;',
      '  const meio = Math.floor((esq + dir) / 2);',
      '  if (arr[meio] === alvo) return meio;',
      '  if (arr[meio] < alvo)',
      '    return buscaBinaria(arr, alvo, esq, meio - 1);',
      '  return buscaBinaria(arr, alvo, meio + 1, dir);',
      '}',
    ],
    correctTrace: 2,
    errorLine: 6,
    fixOptions: [
      'return buscaBinaria(arr, alvo, esq, meio - 1);',
      'return buscaBinaria(arr, alvo, meio + 1, dir);',
      'return buscaBinaria(arr, alvo, esq, meio);',
    ],
    correctFix: 'return buscaBinaria(arr, alvo, meio + 1, dir);',
  },
];

export function validateTrace(roundIdx, value) {
  return {
    correct: ROUNDS[roundIdx].correctTrace === value,
    feedbackLevel: ROUNDS[roundIdx].correctTrace === value ? 2 : 1,
  };
}

export function identifyErrorLine(roundIdx, line) {
  return {
    correct: ROUNDS[roundIdx].errorLine === line,
    feedbackLevel: ROUNDS[roundIdx].errorLine === line ? 2 : 1,
  };
}

export function validateFix(roundIdx, fix) {
  return {
    correct: ROUNDS[roundIdx].correctFix === fix,
    feedbackLevel: ROUNDS[roundIdx].correctFix === fix ? 3 : 1,
  };
}
