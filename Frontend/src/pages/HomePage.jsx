import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGame } from '../hooks/useGame.js';
import { MAX_PLAYER_NAME, ROUTES } from '../config/constants.js';

export default function HomePage() {
  const navigate = useNavigate();
  const { busy, error, game, isFinished, actions } = useGame();
  const [name, setName] = useState('');

  const start = async (event) => {
    event.preventDefault();
    const started = await actions.createAndStart(name);
    if (started) navigate(ROUTES.GAME);
  };

  return (
    <main className="home">
      <div className="home__hero">
        <span className="logo-mark logo-mark--large" aria-hidden="true" />
        <h1 className="home__title">Logic Paint</h1>
        <p className="home__lead">
          Resuelve preguntas de lógica y pinta, pieza a pieza, una imagen que no puedes ver.
          Tienes 15 minutos.
        </p>
      </div>

      <form className="home__form" onSubmit={start}>
        <label htmlFor="player-name" className="field__label">Tu nombre (opcional)</label>
        <input
          id="player-name"
          className="field__input"
          type="text"
          maxLength={MAX_PLAYER_NAME}
          autoComplete="nickname"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        {error && <p className="alert" role="alert">{error}</p>}
        <div className="home__actions">
          <button type="submit" className="btn btn--primary btn--large" disabled={busy}>
            {busy ? 'Preparando partida…' : 'Iniciar partida'}
          </button>
          <Link to={ROUTES.RULES} className="btn btn--ghost btn--large">Cómo jugar</Link>
        </div>
        {game && (
          <p className="home__resume">
            Tienes una partida {isFinished ? 'terminada' : 'en curso'}.{' '}
            <Link to={isFinished ? ROUTES.RESULT : ROUTES.GAME}>{isFinished ? 'Ver resultados' : 'Continuar'}</Link>
          </p>
        )}
      </form>
    </main>
  );
}
