export const ROUNDS = [
  {
    entities: ['aluno', 'professor', 'disciplina'],
    relationships: ['matricula', 'ministra'],
    missingEntity: 'disciplina',
  },
];

const ENTITY_ANSWERS = { 0: 'disciplina' };
const RELATIONSHIP_ANSWERS = { 0: 'matricula' };

export function validateEntity(roundIdx, entityName) {
  return {
    correct: ENTITY_ANSWERS[roundIdx] === entityName,
    feedbackLevel: ENTITY_ANSWERS[roundIdx] === entityName ? 2 : 1,
  };
}

export function validateRelationship(roundIdx, relName) {
  return {
    correct: RELATIONSHIP_ANSWERS[roundIdx] === relName,
    feedbackLevel: RELATIONSHIP_ANSWERS[roundIdx] === relName ? 3 : 1,
  };
}
