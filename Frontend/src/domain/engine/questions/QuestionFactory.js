import { QuestionType } from '../constants.js';
import {
  LogicQuestion,
  SequenceQuestion,
  DeductionQuestion,
  PatternQuestion,
  MathematicalLogicQuestion,
} from './QuestionTypes.js';

export class QuestionCreator {
  createQuestion() {
    throw new Error('QuestionCreator.createQuestion() debe implementarse');
  }
}

const creatorFor = (QuestionClass) =>
  class extends QuestionCreator {
    createQuestion(definition, strategy) {
      return new QuestionClass(definition, strategy);
    }
  };

export class LogicQuestionCreator extends creatorFor(LogicQuestion) {}
export class SequenceQuestionCreator extends creatorFor(SequenceQuestion) {}
export class DeductionQuestionCreator extends creatorFor(DeductionQuestion) {}
export class PatternQuestionCreator extends creatorFor(PatternQuestion) {}
export class MathematicalLogicQuestionCreator extends creatorFor(MathematicalLogicQuestion) {}

export class QuestionFactory {
  constructor({ strategies, creators = {} }) {
    this.strategies = strategies;
    this.creators = new Map();
    this.register(QuestionType.LOGIC, new LogicQuestionCreator());
    this.register(QuestionType.SEQUENCE, new SequenceQuestionCreator());
    this.register(QuestionType.DEDUCTION, new DeductionQuestionCreator());
    this.register(QuestionType.PATTERN, new PatternQuestionCreator());
    this.register(QuestionType.MATH_LOGIC, new MathematicalLogicQuestionCreator());
    Object.entries(creators).forEach(([type, creator]) => this.register(type, creator));
  }

  register(type, creator) {
    this.creators.set(type, creator);
    return this;
  }

  create(definition) {
    const creator = this.creators.get(definition.type);
    if (!creator) throw new Error(`Tipo de pregunta no soportado: "${definition.type}"`);
    return creator.createQuestion(definition, this.strategies.resolve(definition.answerFormat));
  }
}
