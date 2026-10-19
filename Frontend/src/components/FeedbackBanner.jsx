import { FEEDBACK_TONE } from '../config/constants.js';

export default function FeedbackBanner({ feedback, onNext, canGoNext }) {
  if (!feedback) return null;
  const tone = FEEDBACK_TONE[feedback.code] || 'neutral';
  return (
    <div className={`feedback feedback--${tone}`} role="status" aria-live="polite">
      <p className="feedback__message">{feedback.message}</p>
      {feedback.explanation && <p className="feedback__explanation">{feedback.explanation}</p>}
      {feedback.code !== 'INCORRECT' && canGoNext && (
        <button type="button" className="btn btn--primary" onClick={onNext}>Siguiente pregunta</button>
      )}
    </div>
  );
}
