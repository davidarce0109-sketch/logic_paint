import { useMemo } from 'react';
import { useGame } from './useGame.js';
import { byDisplayOrder } from '../domain/questionNavigation.js';

/** Vistas derivadas de la lista de preguntas: orden de aparición, seleccionada y feedback de la seleccionada. */
export function useQuestions() {
  const { questions, selectedId, feedback } = useGame();
  return useMemo(() => {
    const ordered = byDisplayOrder(questions);
    const selected = ordered.find((q) => q.id === selectedId) ?? null;
    return {
      ordered,
      selected,
      selectedFeedback: selected && feedback?.questionId === selected.id ? feedback : null,
    };
  }, [questions, selectedId, feedback]);
}
