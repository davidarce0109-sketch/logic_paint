import DifficultyDecorator from './DifficultyDecorator.js';
import TimedQuestionDecorator from './TimedQuestionDecorator.js';
import HintDecorator from './HintDecorator.js';

export function decorateQuestion(question, { hintsEnabled = true } = {}) {
  let decorated = new DifficultyDecorator(question);
  decorated = new TimedQuestionDecorator(decorated);
  if (hintsEnabled && question.hintText) decorated = new HintDecorator(decorated);
  return decorated;
}

export { DifficultyDecorator, TimedQuestionDecorator, HintDecorator };
