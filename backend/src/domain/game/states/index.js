const { GameStatus } = require('../../constants');
const GameReadyState = require('./GameReadyState');
const GamePlayingState = require('./GamePlayingState');
const GamePausedState = require('./GamePausedState');
const GameFinishedState = require('./GameFinishedState');
const GameTimeExpiredState = require('./GameTimeExpiredState');

const STATE_CLASSES = Object.freeze({
  [GameStatus.READY]: GameReadyState,
  [GameStatus.PLAYING]: GamePlayingState,
  [GameStatus.PAUSED]: GamePausedState,
  [GameStatus.FINISHED]: GameFinishedState,
  [GameStatus.TIME_EXPIRED]: GameTimeExpiredState,
});

function createState(status) {
  const StateClass = STATE_CLASSES[status];
  if (!StateClass) throw new Error(`Estado de partida desconocido: "${status}"`);
  return new StateClass();
}

module.exports = { createState };
