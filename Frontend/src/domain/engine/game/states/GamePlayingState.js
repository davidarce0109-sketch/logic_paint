import GameState from './GameState.js';
import { ValidationError, GameStateError } from '../../utils/AppError.js';
import { GameStatus, EventType, FeedbackCode, FEEDBACK_MESSAGES } from '../../constants.js';

export default class GamePlayingState extends GameState {
  get status() { return GameStatus.PLAYING; }

  start() {}
  resume() {}

  tick(game) {
    if (game.timer.isExpired(game.now())) game.expire();
  }

  listQuestions(game) {
    return game.entries.map((entry) => entry.toPublic());
  }

  pause(game) {
    game.timer.pause(game.now());
    game.transitionTo(GameStatus.PAUSED);
    game.emit(EventType.GAME_PAUSED);
  }

  submitAnswer(game, questionId, rawAnswer) {
    const entry = game.requireEntry(questionId);
    if (!entry.canBeAnswered()) throw new GameStateError('Esta pregunta ya fue resuelta.', 'QUESTION_LOCKED');

    const check = game.validator.validate(entry.question, rawAnswer);
    if (!check.valid) throw new ValidationError(check.message, 'INVALID_ANSWER');

    const context = { attempts: entry.attempts + 1, hintUsed: entry.hintUsed, thinkingMs: game.thinkingMs() };
    const points = game.scoreManager.points(entry.question, context, check.correct);
    entry.registerAttempt();
    game.touch();
    if (!check.correct) entry.markIncorrect();

    game.emit(EventType.QUESTION_ANSWERED, {
      questionId: entry.id,
      number: entry.number,
      correct: check.correct,
      points,
      attempts: entry.attempts,
      answer: String(rawAnswer).trim(),
    });

    if (!check.correct) {
      return { feedback: { code: FeedbackCode.INCORRECT, message: FEEDBACK_MESSAGES[FeedbackCode.INCORRECT] } };
    }

    const placed = game.placePiece(entry);
    if (game.puzzle.isComplete() || !game.hasAnswerableQuestions()) game.complete();
    const code = placed ? FeedbackCode.CORRECT_PLACED : FeedbackCode.CORRECT_NOT_PLACED;
    return {
      questionId: entry.id,
      feedback: { code, message: FEEDBACK_MESSAGES[code], explanation: entry.question.explanation },
    };
  }

  skipQuestion(game, questionId) {
    const entry = game.requireEntry(questionId);
    if (!entry.canBeAnswered()) throw new GameStateError('Esta pregunta ya fue resuelta.', 'QUESTION_LOCKED');
    entry.markPassed();
    game.touch();
    game.emit(EventType.QUESTION_SKIPPED, { questionId: entry.id, number: entry.number });
    return { questionId: entry.id };
  }

  useHint(game, questionId) {
    const entry = game.requireEntry(questionId);
    if (!entry.canBeAnswered()) throw new GameStateError('Esta pregunta ya fue resuelta.', 'QUESTION_LOCKED');
    const hint = entry.question.getHint();
    if (!hint) throw new ValidationError('Esta pregunta no tiene pista.', 'HINT_UNAVAILABLE');
    if (!entry.hintUsed) {
      entry.markHintUsed();
      game.emit(EventType.HINT_USED, { questionId: entry.id, number: entry.number });
    }
    return { questionId: entry.id, hint };
  }
}
