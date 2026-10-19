const GameState = require('./GameState');
const { GameStatus, EventType } = require('../../constants');

class GamePausedState extends GameState {
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

module.exports = GamePausedState;
