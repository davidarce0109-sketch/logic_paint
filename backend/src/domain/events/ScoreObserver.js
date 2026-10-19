const { EventType } = require('../constants');

/** Traduce cada respuesta en puntos usando el ScoreManager. */
class ScoreObserver {
  static EVENTS = [EventType.QUESTION_ANSWERED];

  constructor(scoreManager) {
    this.scoreManager = scoreManager;
  }

  update(event) {
    this.scoreManager.apply(event.payload.points);
  }
}

module.exports = ScoreObserver;
