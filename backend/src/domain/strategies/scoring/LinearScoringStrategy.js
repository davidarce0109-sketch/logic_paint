const ScoringStrategy = require('./ScoringStrategy');
const { SCORING } = require('../../constants');

/** Suma los puntos de la pregunta y resta una penalización fija por cada error. */
class LinearScoringStrategy extends ScoringStrategy {
  onCorrect(question, context) {
    return Math.round(question.getPoints(context));
  }

  onIncorrect() {
    return -SCORING.WRONG_PENALTY;
  }
}

module.exports = LinearScoringStrategy;
