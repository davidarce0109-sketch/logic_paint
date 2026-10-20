import ScoringStrategy from './ScoringStrategy.js';
import { SCORING } from '../../constants.js';

export default class LinearScoringStrategy extends ScoringStrategy {
  onCorrect(question, context) {
    return Math.round(question.getPoints(context));
  }

  onIncorrect() {
    return -SCORING.WRONG_PENALTY;
  }
}
