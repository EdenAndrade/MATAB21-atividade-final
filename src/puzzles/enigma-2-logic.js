export const ROUNDS = [
  {
    entities: ['aluno', 'professor', 'disciplina'],
    relationships: ['matricula', 'ministra'],
    missingEntity: 'disciplina',
    correctRelationship: 'matricula',
  },
  {
    entities: ['aluno', 'disciplina', 'professor', 'departamento'],
    relationships: ['matricula', 'ministra', 'aloca'],
    missingEntity: 'historico',
    correctRelationship: 'matricula',
  },
];

export function validateEntity(roundIdx, entityName) {
  const correct = ROUNDS[roundIdx].missingEntity === entityName;
  return { correct, feedbackLevel: correct ? 2 : 1 };
}

export function validateRelationship(roundIdx, relName) {
  const correct = ROUNDS[roundIdx].correctRelationship === relName;
  return { correct, feedbackLevel: correct ? 3 : 1 };
}
