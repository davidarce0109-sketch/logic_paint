import { useContext } from 'react';
import { GameContext } from '../context/GameContext.jsx';
import { TERMINAL_STATUSES } from '../config/constants.js';

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame debe usarse dentro de <GameProvider>');
  return { ...context, isFinished: context.game ? TERMINAL_STATUSES.includes(context.game.status) : false };
}
