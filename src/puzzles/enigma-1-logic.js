const GATE_FN = {
  AND: (a, b) => a & b,
  OR: (a, b) => a | b,
  NAND: (a, b) => (a & b) ? 0 : 1,
  NOR: (a, b) => (a | b) ? 0 : 1,
  XOR: (a, b) => a ^ b,
};

export const ROUNDS = [
  { a: 1, b: 0, expected: 0, correctGate: 'AND', options: ['AND', 'OR', 'NAND', 'XOR'] },
  { a: 1, b: 0, expected: 1, correctGate: 'OR', options: ['AND', 'OR', 'NOR', 'XOR'] },
  { a: 1, b: 1, expected: 0, correctGate: 'NAND', options: ['NAND', 'AND', 'NOR', 'XOR'] },
];

export function validateGate(round, selectedGate) {
  const gFn = GATE_FN[selectedGate];
  if (!gFn) return { correct: false, feedbackLevel: 1 };
  const output = gFn(round.a, round.b);
  const correct = output === round.expected;
  return { correct, feedbackLevel: correct ? 3 : 1, output, expected: round.expected };
}
