const GameState = require('./GameState');
const { GameStatus } = require('../../constants');

class GameTimeExpiredState extends GameState {
  get status() { return GameStatus.TIME_EXPIRED; }
  get rejectionMessage() { return 'El tiempo de la partida se agotó.'; }

  isTerminal() { return true; }

  listQuestions(game) {
    return game.entries.map((entry) => entry.toPublic());
  }
}

module.exports = GameTimeExpiredState;
