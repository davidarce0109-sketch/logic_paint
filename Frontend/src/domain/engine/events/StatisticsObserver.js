import { EventType } from '../constants.js';

export default class StatisticsObserver {
  static EVENTS = [EventType.QUESTION_ANSWERED, EventType.QUESTION_SKIPPED, EventType.HINT_USED];

  constructor({ answered = 0, correct = 0, incorrect = 0, skipped = 0, hintsUsed = 0 } = {}) {
    Object.assign(this, { answered, correct, incorrect, skipped, hintsUsed });
  }

  update(event) {
    if (event.type === EventType.QUESTION_ANSWERED) {
      this.answered += 1;
      if (event.payload.correct) this.correct += 1;
      else this.incorrect += 1;
    } else if (event.type === EventType.QUESTION_SKIPPED) {
      this.skipped += 1;
    } else if (event.type === EventType.HINT_USED) {
      this.hintsUsed += 1;
    }
  }

  accuracy() {
    return this.answered === 0 ? 0 : Math.round((this.correct / this.answered) * 100);
  }

  toPlain() {
    const { answered, correct, incorrect, skipped, hintsUsed } = this;
    return { answered, correct, incorrect, skipped, hintsUsed };
  }
}
