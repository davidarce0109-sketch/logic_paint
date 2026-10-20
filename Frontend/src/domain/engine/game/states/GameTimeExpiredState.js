import GameState from './GameState.js';
import { GameStatus } from '../../constants.js';

export default class GameTimeExpiredState extends GameState {
  get status() { return GameStatus.TIME_EXPIRED; }
  get rejectionMessage() { return 'El tiempo de la partida se agotó.'; }

  isTerminal() { return true; }

  listQuestions(game) {
    return game.entries.map((entry) => entry.toPublic());
  }
}
