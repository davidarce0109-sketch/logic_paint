import Timer from './Timer.jsx';
import { useGame } from '../hooks/useGame.js';
import { GAME_STATUS } from '../config/constants.js';

export default function GameHeader() {
  const { game, busy, actions } = useGame();
  const paused = game.status === GAME_STATUS.PAUSED;
  return (
    <header className="game-header">
      <div className="game-header__brand">
        <span className="logo-mark" aria-hidden="true" />
        <div>
          <h1 className="game-header__title">Logic Paint</h1>
          <p className="game-header__player">{game.playerName}</p>
        </div>
      </div>
      <div className="game-header__stats">
        <div className="stat">
          <span className="stat__value">{game.score}</span>
          <span className="stat__label">puntos</span>
        </div>
        <Timer game={game} onExpire={actions.refresh} />
        <button type="button" className="btn btn--ghost" onClick={actions.togglePause} disabled={busy}>
          {paused ? 'Reanudar' : 'Pausar'}
        </button>
      </div>
    </header>
  );
}
