import QuestionDecorator from './QuestionDecorator.js';
import { SCORING } from '../../constants.js';

export default class DifficultyDecorator extends QuestionDecorator {
  getPoints(context) {
    const factor = 1 + (this.difficulty - SCORING.DIFFICULTY_BASELINE) * SCORING.DIFFICULTY_STEP;
    return Math.round(this.inner.getPoints(context) * factor);
  }
}
