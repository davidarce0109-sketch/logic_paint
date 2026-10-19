import { useCallback, useState } from 'react';
import PuzzleCanvas from './PuzzleCanvas.jsx';
import ProgressBar from './ProgressBar.jsx';
import QuestionCard from './QuestionCard.jsx';
import QuestionList from './QuestionList.jsx';
import { useGame } from '../hooks/useGame.js';
import { useGameEvents } from '../hooks/useGameEvents.js';
import { FRESH_PIECE_MS, GAME_EVENTS, GAME_STATUS } from '../config/constants.js';

export default function GameBoard() {
  const { game, actions, error } = useGame();
  const [fresh, setFresh] = useState([]);

  const markFresh = useCallback((event) => {
    const { number } = event.payload;
    setFresh((current) => [...current, number]);
    setTimeout(() => setFresh((current) => current.filter((n) => n !== number)), FRESH_PIECE_MS);
  }, []);
  useGameEvents(GAME_EVENTS.PIECE_PAINTED, markFresh);

  const paused = game.status === GAME_STATUS.PAUSED;

  return (
    <main className="board">
      <section className="board__art" aria-label="Tu imagen">
        <PuzzleCanvas
          pieces={game.paintedPieces}
          freshNumbers={fresh}
          label={`Imagen en construcción: ${game.progress.painted} de ${game.progress.total} piezas`}
          empty={game.progress.painted === 0}
        />
        <ProgressBar painted={game.progress.painted} total={game.progress.total} />
      </section>

      <div className="board__work">
        {error && <p className="alert" role="alert">{error}</p>}
        {paused ? (
          <section className="pause">
            <h2>Partida en pausa</h2>
            <p>El tiempo está detenido. Las preguntas se ocultan mientras dure la pausa.</p>
            <button type="button" className="btn btn--primary" onClick={actions.togglePause}>Reanudar</button>
          </section>
        ) : (
          <QuestionCard />
        )}
      </div>

      {!paused && (
        <div className="board__list">
          <QuestionList />
        </div>
      )}
    </main>
  );
}
