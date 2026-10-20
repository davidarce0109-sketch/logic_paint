import Question from './Question.js';
import { QuestionType } from '../constants.js';

export class LogicQuestion extends Question {
  static TYPE = QuestionType.LOGIC;
  static LABEL = 'Lógica';
  static BASE_POINTS = 100;
  static BASE_SECONDS = 40;
}

export class SequenceQuestion extends Question {
  static TYPE = QuestionType.SEQUENCE;
  static LABEL = 'Secuencia';
  static BASE_POINTS = 90;
  static BASE_SECONDS = 30;
}

export class DeductionQuestion extends Question {
  static TYPE = QuestionType.DEDUCTION;
  static LABEL = 'Deducción';
  static BASE_POINTS = 110;
  static BASE_SECONDS = 40;
}

export class PatternQuestion extends Question {
  static TYPE = QuestionType.PATTERN;
  static LABEL = 'Patrón';
  static BASE_POINTS = 90;
  static BASE_SECONDS = 30;
}

export class MathematicalLogicQuestion extends Question {
  static TYPE = QuestionType.MATH_LOGIC;
  static LABEL = 'Razonamiento matemático';
  static BASE_POINTS = 100;
  static BASE_SECONDS = 40;
}
