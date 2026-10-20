export default class ScoringStrategy {
  onCorrect() {
    throw new Error('ScoringStrategy.onCorrect() debe implementarse');
  }

  onIncorrect() {
    throw new Error('ScoringStrategy.onIncorrect() debe implementarse');
  }
}
