import QuestionDecorator from './QuestionDecorator.js';
import { SCORING } from '../../constants.js';

export default class TimedQuestionDecorator extends QuestionDecorator {
  getPoints(context) {
    const base = this.inner.getPoints(context);
    const withinBudget = context.thinkingMs != null && context.thinkingMs <= this.getSuggestedSeconds() * 1000;
    return withinBudget ? Math.round(base * (1 + SCORING.SPEED_BONUS_RATIO)) : base;
  }
}
