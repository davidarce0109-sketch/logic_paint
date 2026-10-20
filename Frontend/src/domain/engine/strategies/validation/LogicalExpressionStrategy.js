import QuestionStrategy from './QuestionStrategy.js';

const SEPARATORS = /[\s,;.\-/]/g;

export default class LogicalExpressionStrategy extends QuestionStrategy {
  parse(question, raw) {
    const value = String(raw).toUpperCase().replace(SEPARATORS, '');
    const expectedLength = String(question.correctAnswer).length;
    if (!/^[VF]+$/.test(value) || value.length !== expectedLength) {
      return { valid: false, message: `Escribe ${expectedLength} letras usando solo V (verdadero) o F (falso).` };
    }
    return { valid: true, value };
  }

  matches(question, value) {
    return value === String(question.correctAnswer).toUpperCase();
  }
}
