const GameState = require('./GameState');
const { GameStatus } = require('../../constants');

class GameFinishedState extends GameState {
  get status() { return GameStatus.FINISHED; }
  get rejectionMessage() { return 'La partida ya terminó.'; }

  isTerminal() { return true; }

  listQuestions(game) {
    return game.entries.map((entry) => entry.toPublic());
  }
}

module.exports = GameFinishedState;
