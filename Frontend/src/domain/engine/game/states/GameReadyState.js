import GameState from './GameState.js';
import { GameStatus, EventType } from '../../constants.js';

export default class GameReadyState extends GameState {
  get status() { return GameStatus.READY; }
  get rejectionMessage() { return 'La partida aún no ha iniciado.'; }

  start(game) {
    game.timer.start(game.now());
    game.touch();
    game.transitionTo(GameStatus.PLAYING);
    game.emit(EventType.GAME_STARTED, { durationMs: game.timer.durationMs });
  }
}
