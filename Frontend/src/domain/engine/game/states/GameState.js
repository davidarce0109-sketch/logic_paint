import { GameStateError } from '../../utils/AppError.js';

export default class GameState {
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
