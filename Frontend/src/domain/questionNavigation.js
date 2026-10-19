import { QUESTION_STATUS } from '../config/constants.js';

export const isOpen = (question) => question.status !== QUESTION_STATUS.SOLVED;

export const byDisplayOrder = (questions) => [...questions].sort((a, b) => a.displayOrder - b.displayOrder);

/** Siguiente pregunta abierta después de la actual (da la vuelta al final de la lista). */
export function nextOpenId(questions, currentId) {
  const ordered = byDisplayOrder(questions);
  const start = ordered.findIndex((q) => q.id === currentId);
  for (let step = 1; step <= ordered.length; step += 1) {
    const candidate = ordered[(start + step) % ordered.length];
    if (candidate && candidate.id !== currentId && isOpen(candidate)) return candidate.id;
  }
  return null;
}

export function firstOpenId(questions) {
  return byDisplayOrder(questions).find(isOpen)?.id ?? null;
}
