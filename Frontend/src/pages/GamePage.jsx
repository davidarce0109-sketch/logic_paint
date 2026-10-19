import { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import GameHeader from '../components/GameHeader.jsx';
import GameBoard from '../components/GameBoard.jsx';
import { useGame } from '../hooks/useGame.js';
import { GAME_STATUS, ROUTES } from '../config/constants.js';

export default function GamePage() {
  const navigate = useNavigate();
  const { game, booting, isFinished } = useGame();

  useEffect(() => {
    if (isFinished) navigate(ROUTES.RESULT, { replace: true });
  }, [isFinished, navigate]);

  if (booting) return <p className="loading" role="status">Cargando partida…</p>;
  if (!game) return <Navigate to={ROUTES.HOME} replace />;
  if (game.status === GAME_STATUS.READY) return <Navigate to={ROUTES.HOME} replace />;

  return (
    <div className="game">
      <GameHeader />
      <GameBoard />
    </div>
  );
}
