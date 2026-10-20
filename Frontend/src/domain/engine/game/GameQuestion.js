import { QuestionStatus } from '../constants.js';

const OPEN_STATUSES = [QuestionStatus.PENDING, QuestionStatus.PASSED, QuestionStatus.INCORRECT];
const CLOSED_STATUSES = [QuestionStatus.PLACED, QuestionStatus.LOCKED];
const PUBLIC_SOLVED = 'solved';

export default class GameQuestion {
  constructor({ question, status = QuestionStatus.PENDING, attempts = 0, hintUsed = false, displayOrder = 0 }) {
    this.question = question;
    this.status = status;
    this.attempts = attempts;
    this.hintUsed = hintUsed;
    this.displayOrder = displayOrder;
  }

  get id() { return this.question.id; }
  get number() { return this.question.number; }

  canBeAnswered() { return OPEN_STATUSES.includes(this.status); }
  registerAttempt() { this.attempts += 1; }
  markIncorrect() { this.status = QuestionStatus.INCORRECT; }
  markPassed() { this.status = QuestionStatus.PASSED; }
  markPlaced() { this.status = QuestionStatus.PLACED; }
  markLocked() { this.status = QuestionStatus.LOCKED; }
  markHintUsed() { this.hintUsed = true; }

  publicStatus() {
    return CLOSED_STATUSES.includes(this.status) ? PUBLIC_SOLVED : this.status;
  }

  toPublic() {
    return {
      ...this.question.toPublic(),
      status: this.publicStatus(),
      attempts: this.attempts,
      hintUsed: this.hintUsed,
      hint: this.hintUsed ? this.question.getHint() : null,
      displayOrder: this.displayOrder,
    };
  }

  toReview() {
    return {
      number: this.number,
      status: this.status,
      attempts: this.attempts,
      explanation: this.question.explanation,
      ...this.question.toReview(),
    };
  }

  toSnapshot() {
    return {
      questionId: this.id,
      number: this.number,
      status: this.status,
      attempts: this.attempts,
      hintUsed: this.hintUsed,
      displayOrder: this.displayOrder,
    };
  }
}
