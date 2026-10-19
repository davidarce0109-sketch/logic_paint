import AnswerForm from './AnswerForm.jsx';
import FeedbackBanner from './FeedbackBanner.jsx';
import { useGame } from '../hooks/useGame.js';
import { useQuestions } from '../hooks/useQuestions.js';
import { DIFFICULTY_LABELS, QUESTION_STATUS } from '../config/constants.js';
import { nextOpenId } from '../domain/questionNavigation.js';

export default function QuestionCard() {
  const { busy, questions, actions } = useGame();
  const { selected, selectedFeedback } = useQuestions();

  if (!selected) {
    return (
      <section className="question-card question-card--empty">
        <h2>Sin preguntas pendientes</h2>
        <p>Has resuelto todas las preguntas disponibles.</p>
      </section>
    );
  }

  const solved = selected.status === QUESTION_STATUS.SOLVED;
  const canGoNext = nextOpenId(questions, selected.id) !== null;

  return (
    <section className="question-card" aria-labelledby="question-title">
      <header className="question-card__head">
        <span className="question-card__number" aria-hidden="true">{selected.number}</span>
        <div>
          <h2 id="question-title" className="question-card__title">Pregunta {selected.number}</h2>
          <p className="question-card__meta">
            {selected.typeLabel} · {DIFFICULTY_LABELS[selected.difficulty] ?? 'Media'} · sugerido {selected.suggestedSeconds} s
            {selected.attempts > 0 ? ` · intentos ${selected.attempts}` : ''}
          </p>
        </div>
      </header>

      <p className="question-card__statement">{selected.statement}</p>

      {selected.hintUsed && selected.hint && <p className="hint hint--shown">Pista: {selected.hint}</p>}
      {selected.hintAvailable && !selected.hintUsed && !solved && (
        <button type="button" className="link-button" onClick={actions.requestHint} disabled={busy}>
          Ver una pista (resta puntos)
        </button>
      )}

      {solved ? (
        <p className="question-card__solved">Esta pregunta ya está resuelta.</p>
      ) : (
        <AnswerForm
          key={selected.id}
          question={selected}
          disabled={busy}
          onSubmit={actions.submitAnswer}
          onSkip={actions.skipQuestion}
        />
      )}

      <FeedbackBanner feedback={selectedFeedback} onNext={actions.goToNextQuestion} canGoNext={canGoNext} />
    </section>
  );
}
