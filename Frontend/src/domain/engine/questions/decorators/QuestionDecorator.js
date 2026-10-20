export default class QuestionDecorator {
  constructor(inner) {
    this.inner = inner;
  }

  get id() { return this.inner.id; }
  get number() { return this.inner.number; }
  get type() { return this.inner.type; }
  get difficulty() { return this.inner.difficulty; }
  get answerFormat() { return this.inner.answerFormat; }
  get statement() { return this.inner.statement; }
  get explanation() { return this.inner.explanation; }
  get hintText() { return this.inner.hintText; }
  get pieceId() { return this.inner.pieceId; }

  check(rawAnswer) { return this.inner.check(rawAnswer); }
  getPoints(context) { return this.inner.getPoints(context); }
  getSuggestedSeconds() { return this.inner.getSuggestedSeconds(); }
  getHint() { return this.inner.getHint(); }
  toPublic() { return this.inner.toPublic(); }
  toReview() { return this.inner.toReview(); }
}
