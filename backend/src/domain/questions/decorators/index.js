const DifficultyDecorator = require('./DifficultyDecorator');
const TimedQuestionDecorator = require('./TimedQuestionDecorator');
const HintDecorator = require('./HintDecorator');

/** Compone los decoradores configurados alrededor de una pregunta base. */
function decorateQuestion(question, { hintsEnabled = true } = {}) {
  let decorated = new DifficultyDecorator(question);
  decorated = new TimedQuestionDecorator(decorated);
  if (hintsEnabled && question.hintText) decorated = new HintDecorator(decorated);
  return decorated;
}

module.exports = { decorateQuestion };
