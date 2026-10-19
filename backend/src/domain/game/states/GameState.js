const { GameStateError } = require('../../../utils/AppError');

/**
 * Contrato del patrón State. Por defecto cada operación se rechaza;
 * cada estado concreto solo implementa lo que le está permitido.
 */
class GameState {
  get status() { throw new Error('GameState.status debe implementarse'); }
  get rejectionMessage() { return 'Operación no permitida en el estado actual de la partida.'; }

  isTerminal() { return false; }

  start() { this.reject(); }
  pause() { this.reject(); }
  resume() { this.reject(); }
  submitAnswer() { this.reject(); }
  skipQuestion() { this.reject(); }
  useHint() { this.reject(); }
  listQuestions() { this.reject(); }
  tick() {}

  reject() {
    throw new GameStateError(this.rejectionMessage, `GAME_${this.status.toUpperCase()}`);
  }
}

module.exports = GameState;
