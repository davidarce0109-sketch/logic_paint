import { GameStatus } from '../../constants.js';
import GameReadyState from './GameReadyState.js';
import GamePlayingState from './GamePlayingState.js';
import GamePausedState from './GamePausedState.js';
import GameFinishedState from './GameFinishedState.js';
import GameTimeExpiredState from './GameTimeExpiredState.js';

const STATE_CLASSES = Object.freeze({
  [GameStatus.READY]: GameReadyState,
  [GameStatus.PLAYING]: GamePlayingState,
  [GameStatus.PAUSED]: GamePausedState,
  [GameStatus.FINISHED]: GameFinishedState,
  [GameStatus.TIME_EXPIRED]: GameTimeExpiredState,
});

export function createState(status) {
  const StateClass = STATE_CLASSES[status];
  if (!StateClass) throw new Error(`Estado de partida desconocido: "${status}"`);
  return new StateClass();
}
