import ScoringStrategy from './ScoringStrategy.js';

export default class ForgivingScoringStrategy extends ScoringStrategy {
  onCorrect(question, context) {
    return Math.round(question.getPoints(context));
  }

  onIncorrect() {
    return 0;
  }
}
