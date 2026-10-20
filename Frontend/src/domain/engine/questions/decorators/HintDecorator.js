import QuestionDecorator from './QuestionDecorator.js';
import { SCORING } from '../../constants.js';

export default class HintDecorator extends QuestionDecorator {
  getHint() {
    return this.inner.hintText;
  }

  getPoints(context) {
    const base = this.inner.getPoints(context);
    return context.hintUsed ? Math.round(base * (1 - SCORING.HINT_PENALTY_RATIO)) : base;
  }

  toPublic() {
    return { ...this.inner.toPublic(), hintAvailable: true };
  }
}
