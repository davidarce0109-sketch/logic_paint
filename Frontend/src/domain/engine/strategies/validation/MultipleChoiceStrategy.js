import QuestionStrategy from './QuestionStrategy.js';

export default class MultipleChoiceStrategy extends QuestionStrategy {
  parse(question, raw) {
    const value = String(raw).trim().toUpperCase();
    if (!question.hasOption(value)) return { valid: false, message: 'Selecciona una de las opciones disponibles.' };
    return { valid: true, value };
  }

  matches(question, value) {
    return value === String(question.correctAnswer).toUpperCase();
  }
}
