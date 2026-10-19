const { QuestionType } = require('../constants');
const {
  LogicQuestion,
  SequenceQuestion,
  DeductionQuestion,
  PatternQuestion,
  MathematicalLogicQuestion,
} = require('./QuestionTypes');

/** Creator del Factory Method: cada subclase decide qué producto concreto instanciar. */
class QuestionCreator {
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

class LogicQuestionCreator extends creatorFor(LogicQuestion) {}
class SequenceQuestionCreator extends creatorFor(SequenceQuestion) {}
class DeductionQuestionCreator extends creatorFor(DeductionQuestion) {}
class PatternQuestionCreator extends creatorFor(PatternQuestion) {}
class MathematicalLogicQuestionCreator extends creatorFor(MathematicalLogicQuestion) {}

/**
 * Punto único de creación de preguntas. Para añadir un tipo nuevo basta con registrar un creator
 * (Open/Closed): ni el juego ni los servicios conocen las clases concretas.
 */
class QuestionFactory {
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

module.exports = { QuestionFactory, QuestionCreator };
