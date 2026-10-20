import { SCORING, AnswerFormat } from '../constants.js';
import { pieceIdFor } from '../puzzle/pieceId.js';

export default class Question {
  static TYPE = 'generic';
  static LABEL = 'Lógica';
  static BASE_POINTS = SCORING.BASE_POINTS;
  static BASE_SECONDS = 60;

  constructor(definition, validationStrategy) {
    this.definition = Object.freeze({ options: [], hint: null, ...definition });
    this.strategy = validationStrategy;
  }

  get id() { return this.definition.id; }
  get number() { return this.definition.number; }
  get type() { return this.definition.type; }
  get difficulty() { return this.definition.difficulty; }
  get answerFormat() { return this.definition.answerFormat; }
  get statement() { return this.definition.statement; }
  get options() { return this.definition.options; }
  get explanation() { return this.definition.explanation; }
  get hintText() { return this.definition.hint; }
  get pieceId() { return pieceIdFor(this.number); }

  get correctAnswer() { return this.definition.correctAnswer; }

  hasOption(optionId) {
    return this.options.some((option) => option.id === optionId);
  }

  check(rawAnswer) {
    const parsed = this.strategy.parse(this, rawAnswer);
    if (!parsed.valid) return { valid: false, correct: false, message: parsed.message };
    return { valid: true, correct: this.strategy.matches(this, parsed.value) };
  }

  getPoints() { return this.constructor.BASE_POINTS; }
  getSuggestedSeconds() { return this.constructor.BASE_SECONDS; }
  getHint() { return null; }

  toPublic() {
    return {
      id: this.id,
      number: this.number,
      type: this.type,
      typeLabel: this.constructor.LABEL,
      answerFormat: this.answerFormat,
      statement: this.statement,
      options: this.options.map(({ id, text }) => ({ id, text })),
      difficulty: this.difficulty,
      suggestedSeconds: this.getSuggestedSeconds(),
      hintAvailable: false,
    };
  }

  toReview() {
    const isChoice = this.answerFormat === AnswerFormat.MULTIPLE_CHOICE;
    const option = isChoice ? this.options.find((o) => o.id === this.correctAnswer) : null;
    return { correctAnswer: option ? `${option.id}) ${option.text}` : String(this.correctAnswer) };
  }
}
