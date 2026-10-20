export default class ScoreManager {
  constructor(strategy, score = 0) {
    this.strategy = strategy;
    this.score = score;
  }

  points(question, context, correct) {
    return correct ? this.strategy.onCorrect(question, context) : this.strategy.onIncorrect(question, context);
  }

  apply(points) {
    this.score = Math.max(0, this.score + points);
  }
}
