import { AnswerFormat } from '../../constants.js';
import MultipleChoiceStrategy from './MultipleChoiceStrategy.js';
import NumericAnswerStrategy from './NumericAnswerStrategy.js';
import LogicalExpressionStrategy from './LogicalExpressionStrategy.js';

export class StrategyRegistry {
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

export function createDefaultStrategyRegistry() {
  return new StrategyRegistry()
    .register(AnswerFormat.MULTIPLE_CHOICE, new MultipleChoiceStrategy())
    .register(AnswerFormat.NUMERIC, new NumericAnswerStrategy())
    .register(AnswerFormat.LOGICAL_EXPRESSION, new LogicalExpressionStrategy());
}
