const { EventType } = require('../constants');

/** Acumula los registros que el repositorio persistirá (tablas answers y game_progress). */
class AuditLogObserver {
  static EVENTS = [EventType.QUESTION_ANSWERED, EventType.PIECE_PAINTED];

  constructor() {
    this.answers = [];
    this.progress = [];
  }

  update(event) {
    const { payload, at } = event;
    if (event.type === EventType.QUESTION_ANSWERED) {
      this.answers.push({
        questionId: payload.questionId,
        answer: payload.answer,
        correct: payload.correct,
        points: payload.points,
        attempt: payload.attempts,
        at,
      });
    } else {
      this.progress.push({ questionId: payload.questionId, number: payload.number, at });
    }
  }

  drain() {
    const drained = { answers: this.answers, progress: this.progress };
    this.answers = [];
    this.progress = [];
    return drained;
  }
}

module.exports = AuditLogObserver;
