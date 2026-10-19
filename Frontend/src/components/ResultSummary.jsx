import { formatDuration } from '../utils/format.js';

const OUTCOME_COPY = {
  completed: { title: 'Victoria', text: 'Completaste la imagen: coincide al 100 % con la imagen objetivo.' },
  time_expired: { title: 'Tiempo agotado', text: 'La imagen quedó incompleta. Compárala con la imagen objetivo y vuelve a intentarlo.' },
  incomplete: {
    title: 'Imagen incompleta',
    text: 'Respondiste las preguntas, pero a tu imagen le faltaron piezas: no basta con acertar. Compárala con la imagen objetivo y piensa qué pudo cambiar.',
  },
};

export default function ResultSummary({ result }) {
  const copy = OUTCOME_COPY[result.reason];
  const items = [
    ['Tiempo utilizado', formatDuration(result.elapsedMs)],
    ['Respuestas enviadas', result.stats.answered],
    ['Correctas', result.stats.correct],
    ['Incorrectas', result.stats.incorrect],
    ['Preguntas pasadas', result.stats.skipped],
    ['Precisión', `${result.accuracy}%`],
    ['Puntos', result.score],
    ['Piezas correctas', `${result.comparison.matched} de ${result.comparison.total}`],
  ];
  return (
    <section className={`summary summary--${result.outcome}`}>
      <h1 className="summary__title">{copy.title}</h1>
      <p className="summary__text">{copy.text}</p>
      <dl className="summary__grid">
        {items.map(([label, value]) => (
          <div key={label} className="summary__item">
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
