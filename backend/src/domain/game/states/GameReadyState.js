const GameState = require('./GameState');
const { GameStatus, EventType } = require('../../constants');

class GameReadyState extends GameState {
  get status() { return GameStatus.READY; }
  get rejectionMessage() { return 'La partida aún no ha iniciado.'; }

  start(game) {
    game.timer.start(game.now());
    game.touch();
    game.transitionTo(GameStatus.PLAYING);
    game.emit(EventType.GAME_STARTED, { durationMs: game.timer.durationMs });
  }
}

module.exports = GameReadyState;
