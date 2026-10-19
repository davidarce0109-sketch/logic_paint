import { useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import ResultSummary from '../components/ResultSummary.jsx';
import ImageComparison from '../components/ImageComparison.jsx';
import ReviewList from '../components/ReviewList.jsx';
import { useGame } from '../hooks/useGame.js';
import { ROUTES } from '../config/constants.js';

export default function ResultPage() {
  const navigate = useNavigate();
  const { game, result, booting, isFinished, error, actions } = useGame();

  useEffect(() => {
    if (isFinished && !result) actions.loadResult();
  }, [isFinished, result, actions]);

  if (booting) return <p className="loading" role="status">Cargando resultados…</p>;
  if (!game) return <Navigate to={ROUTES.HOME} replace />;
  if (!isFinished) return <Navigate to={ROUTES.GAME} replace />;

  const playAgain = () => {
    actions.reset();
    navigate(ROUTES.HOME);
  };

  return (
    <main className="result">
      {error && <p className="alert" role="alert">{error}</p>}
      {!result ? (
        <p className="loading" role="status">Calculando resultados…</p>
      ) : (
        <>
          <ResultSummary result={result} />
          <ImageComparison result={result} />
          <ReviewList review={result.review} />
          <div className="result__actions">
            <button type="button" className="btn btn--primary btn--large" onClick={playAgain}>Jugar de nuevo</button>
            <Link to={ROUTES.RULES} className="btn btn--ghost btn--large">Cómo jugar</Link>
          </div>
        </>
      )}
    </main>
  );
}
