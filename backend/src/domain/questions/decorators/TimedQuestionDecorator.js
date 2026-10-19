const QuestionDecorator = require('./QuestionDecorator');
const { SCORING } = require('../../constants');

/** Bonifica responder dentro del tiempo sugerido (medido desde la última acción del jugador). */
class TimedQuestionDecorator extends QuestionDecorator {
  getPoints(context) {
    const base = this.inner.getPoints(context);
    const withinBudget = context.thinkingMs != null && context.thinkingMs <= this.getSuggestedSeconds() * 1000;
    return withinBudget ? Math.round(base * (1 + SCORING.SPEED_BONUS_RATIO)) : base;
  }
}

module.exports = TimedQuestionDecorator;
