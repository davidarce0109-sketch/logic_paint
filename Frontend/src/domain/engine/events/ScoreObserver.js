import { EventType } from '../constants.js';

export default class ScoreObserver {
  static EVENTS = [EventType.QUESTION_ANSWERED];

  constructor(scoreManager) {
    this.scoreManager = scoreManager;
  }

  update(event) {
    this.scoreManager.apply(event.payload.points);
  }
}
