const QuestionDecorator = require('./QuestionDecorator');
const { SCORING } = require('../../constants');

/** Añade una pista opcional que cuesta puntos si el jugador la usa. */
class HintDecorator extends QuestionDecorator {
  getHint() {
    return this.inner.hintText;
  }

  getPoints(context) {
    const base = this.inner.getPoints(context);
    return context.hintUsed ? Math.round(base * (1 - SCORING.HINT_PENALTY_RATIO)) : base;
  }

  toPublic() {
    return { ...this.inner.toPublic(), hintAvailable: true };
  }
}

module.exports = HintDecorator;
