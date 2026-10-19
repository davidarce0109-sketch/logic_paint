const QuestionStrategy = require('./QuestionStrategy');

const NUMBER_PATTERN = /^-?\d+(\.\d+)?$/;
const EPSILON = 1e-9;

class NumericAnswerStrategy extends QuestionStrategy {
  parse(question, raw) {
    const text = String(raw).trim().replace(',', '.');
    if (!NUMBER_PATTERN.test(text)) return { valid: false, message: 'Escribe un número válido.' };
    return { valid: true, value: Number(text) };
  }

  matches(question, value) {
    return Math.abs(value - Number(question.correctAnswer)) < EPSILON;
  }
}

module.exports = NumericAnswerStrategy;
