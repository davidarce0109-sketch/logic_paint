import { Link } from 'react-router-dom';
import { ROUTES } from '../config/constants.js';

const RULES = [
  'Debes resolver preguntas de lógica: secuencias, deducciones, patrones y razonamiento matemático.',
  'Las preguntas aparecen mezcladas. Puedes abrir la que quieras, pasarla y volver a ella más tarde.',
  'Cada pregunta tiene un número y está ligada a una pieza de la imagen, con su forma y su color.',
  'Una respuesta incorrecta no pinta nada, pero queda registrada. Puedes volver a intentarlo.',
  'Las respuestas correctas ayudan a construir la imagen, aunque no todas surten efecto en el momento en que las das. Observa qué ocurre con tu imagen y descubre cómo avanzar.',
  'La partida dura 15 minutos y el reloj corre aunque cambies de pregunta. Solo se detiene si pausas.',
  'Ganas únicamente si tu imagen coincide con la imagen objetivo. Al terminar podrás compararlas lado a lado.',
];

export default function RulesPage() {
  return (
    <main className="rules">
      <h1 className="rules__title">Cómo jugar</h1>
      <ol className="rules__list">
        {RULES.map((rule) => <li key={rule}>{rule}</li>)}
      </ol>
      <div className="rules__actions">
        <Link to={ROUTES.HOME} className="btn btn--primary btn--large">Volver al inicio</Link>
      </div>
    </main>
  );
}
