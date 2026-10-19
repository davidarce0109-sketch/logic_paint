const { AnswerFormat } = require('../../constants');
const MultipleChoiceStrategy = require('./MultipleChoiceStrategy');
const NumericAnswerStrategy = require('./NumericAnswerStrategy');
const LogicalExpressionStrategy = require('./LogicalExpressionStrategy');

/** Registro de estrategias por formato de respuesta (abierto a extensión). */
class StrategyRegistry {
  constructor() {
    this.strategies = new Map();
  }

  register(answerFormat, strategy) {
    this.strategies.set(answerFormat, strategy);
    return this;
  }

  resolve(answerFormat) {
    const strategy = this.strategies.get(answerFormat);
    if (!strategy) throw new Error(`No hay estrategia de validación para el formato "${answerFormat}"`);
    return strategy;
  }
}

function createDefaultStrategyRegistry() {
  return new StrategyRegistry()
    .register(AnswerFormat.MULTIPLE_CHOICE, new MultipleChoiceStrategy())
    .register(AnswerFormat.NUMERIC, new NumericAnswerStrategy())
    .register(AnswerFormat.LOGICAL_EXPRESSION, new LogicalExpressionStrategy());
}

module.exports = { StrategyRegistry, createDefaultStrategyRegistry };
