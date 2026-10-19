import { useGame } from '../hooks/useGame.js';
import { useQuestions } from '../hooks/useQuestions.js';
import { STATUS_LABELS } from '../config/constants.js';

/** Boyas numeradas en el orden en que el servidor las mezcló; el color indica el estado. */
export default function QuestionList() {
  const { actions } = useGame();
  const { ordered, selected } = useQuestions();
  return (
    <nav className="question-list" aria-label="Preguntas">
      <ul>
        {ordered.map((question) => {
          const isSelected = selected?.id === question.id;
          return (
            <li key={question.id}>
              <button
                type="button"
                className={`chip chip--${question.status}${isSelected ? ' chip--selected' : ''}`}
                onClick={() => actions.selectQuestion(question.id)}
                aria-current={isSelected ? 'true' : undefined}
                aria-label={`Pregunta ${question.number}: ${STATUS_LABELS[question.status]}`}
              >
                {question.number}
              </button>
            </li>
          );
        })}
      </ul>
      <p className="question-list__legend">
        <span className="dot dot--pending" /> Pendiente
        <span className="dot dot--passed" /> Pasada
        <span className="dot dot--incorrect" /> Incorrecta
        <span className="dot dot--solved" /> Resuelta
      </p>
    </nav>
  );
}
