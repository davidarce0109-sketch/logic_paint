import GameState from './GameState.js';
import { GameStatus, EventType } from '../../constants.js';

export default class GamePausedState extends GameState {
  get status() { return GameStatus.PAUSED; }
  get rejectionMessage() { return 'La partida está en pausa.'; }

  pause() {}

  resume(game) {
    game.timer.resume(game.now());
    game.touch();
    game.transitionTo(GameStatus.PLAYING);
    game.emit(EventType.GAME_RESUMED);
  }
}
