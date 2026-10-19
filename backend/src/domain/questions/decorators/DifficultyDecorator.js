const QuestionDecorator = require('./QuestionDecorator');
const { SCORING } = require('../../constants');

/** Escala el puntaje según la dificultad, sin tocar las clases de pregunta. */
class DifficultyDecorator extends QuestionDecorator {
  getPoints(context) {
    const factor = 1 + (this.difficulty - SCORING.DIFFICULTY_BASELINE) * SCORING.DIFFICULTY_STEP;
    return Math.round(this.inner.getPoints(context) * factor);
  }
}

module.exports = DifficultyDecorator;
