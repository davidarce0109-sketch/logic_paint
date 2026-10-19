const STATUS_TEXT = {
  pending: 'Sin responder',
  passed: 'Pasada',
  incorrect: 'Incorrecta',
  placed: 'Correcta · su pieza se incorporó',
  locked: 'Correcta · su pieza no se pudo incorporar',
};

/** Repaso final: ahora que la partida terminó sí se muestran respuestas y explicaciones. */
export default function ReviewList({ review }) {
  return (
    <section className="review" aria-label="Repaso de preguntas">
      <h2 className="review__title">Repaso de las preguntas</h2>
      {review.map((item) => (
        <details key={item.number} className="review__item">
          <summary>
            <span className="review__number">{item.number}</span>
            <span>{STATUS_TEXT[item.status]}</span>
            <span className="review__attempts">{item.attempts} {item.attempts === 1 ? 'intento' : 'intentos'}</span>
          </summary>
          <p><strong>Respuesta correcta:</strong> {item.correctAnswer}</p>
          <p>{item.explanation}</p>
        </details>
      ))}
    </section>
  );
}
