import { useTimer } from '../hooks/useTimer.js';
import { formatClock } from '../utils/format.js';
import { GAME_STATUS, LOW_TIME_MS } from '../config/constants.js';

export default function Timer({ game, onExpire }) {
  const remaining = useTimer({
    remainingMs: game.remainingMs,
    running: game.status === GAME_STATUS.PLAYING,
    syncKey: game.serverTime,
    onExpire,
  });
  const low = remaining <= LOW_TIME_MS;
  return (
    <div className={`timer${low ? ' timer--low' : ''}`} role="timer" aria-label="Tiempo restante">
      <span className="timer__value">{formatClock(remaining)}</span>
      <span className="timer__label">restante</span>
    </div>
  );
}
