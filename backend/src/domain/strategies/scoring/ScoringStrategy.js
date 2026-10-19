/** Contrato de Strategy para puntuar respuestas. */
class ScoringStrategy {
  onCorrect() {
    throw new Error('ScoringStrategy.onCorrect() debe implementarse');
  }

  onIncorrect() {
    throw new Error('ScoringStrategy.onIncorrect() debe implementarse');
  }
}

module.exports = ScoringStrategy;
