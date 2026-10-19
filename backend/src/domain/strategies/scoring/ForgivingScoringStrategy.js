const ScoringStrategy = require('./ScoringStrategy');

/** Igual que la lineal, pero los errores no restan puntos. */
class ForgivingScoringStrategy extends ScoringStrategy {
  onCorrect(question, context) {
    return Math.round(question.getPoints(context));
  }

  onIncorrect() {
    return 0;
  }
}

module.exports = ForgivingScoringStrategy;
