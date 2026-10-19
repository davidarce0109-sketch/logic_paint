const Question = require('./Question');
const { QuestionType } = require('../constants');

class LogicQuestion extends Question {
  static TYPE = QuestionType.LOGIC;
  static LABEL = 'Lógica';
  static BASE_POINTS = 100;
  static BASE_SECONDS = 40;
}

class SequenceQuestion extends Question {
  static TYPE = QuestionType.SEQUENCE;
  static LABEL = 'Secuencia';
  static BASE_POINTS = 90;
  static BASE_SECONDS = 30;
}

class DeductionQuestion extends Question {
  static TYPE = QuestionType.DEDUCTION;
  static LABEL = 'Deducción';
  static BASE_POINTS = 110;
  static BASE_SECONDS = 40;
}

class PatternQuestion extends Question {
  static TYPE = QuestionType.PATTERN;
  static LABEL = 'Patrón';
  static BASE_POINTS = 90;
  static BASE_SECONDS = 30;
}

class MathematicalLogicQuestion extends Question {
  static TYPE = QuestionType.MATH_LOGIC;
  static LABEL = 'Razonamiento matemático';
  static BASE_POINTS = 100;
  static BASE_SECONDS = 40;
}

module.exports = { LogicQuestion, SequenceQuestion, DeductionQuestion, PatternQuestion, MathematicalLogicQuestion };
