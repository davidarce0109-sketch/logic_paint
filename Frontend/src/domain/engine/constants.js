export const GameStatus = Object.freeze({
  READY: 'ready',
  PLAYING: 'playing',
  PAUSED: 'paused',
  FINISHED: 'finished',
  TIME_EXPIRED: 'time_expired',
});

export const QuestionStatus = Object.freeze({
  PENDING: 'pending',
  PASSED: 'passed',
  INCORRECT: 'incorrect',
  PLACED: 'placed',
  LOCKED: 'locked',
});

export const AnswerFormat = Object.freeze({
  MULTIPLE_CHOICE: 'multiple_choice',
  NUMERIC: 'numeric',
  LOGICAL_EXPRESSION: 'logical_expression',
});

export const QuestionType = Object.freeze({
  LOGIC: 'logic',
  SEQUENCE: 'sequence',
  DEDUCTION: 'deduction',
  PATTERN: 'pattern',
  MATH_LOGIC: 'math_logic',
});

export const EventType = Object.freeze({
  GAME_STARTED: 'GameStarted',
  QUESTION_ANSWERED: 'QuestionAnswered',
  QUESTION_SKIPPED: 'QuestionSkipped',
  PIECE_PAINTED: 'PiecePainted',
  HINT_USED: 'HintUsed',
  GAME_PAUSED: 'GamePaused',
  GAME_RESUMED: 'GameResumed',
  GAME_COMPLETED: 'GameCompleted',
  TIME_EXPIRED: 'TimeExpired',
});

export const SequenceOrder = Object.freeze({ ASCENDING: 'ascending', DESCENDING: 'descending' });
export const DEFAULT_SEQUENCE_ORDER = SequenceOrder.DESCENDING;

export const Outcome = Object.freeze({ WON: 'won', LOST: 'lost' });

export const FeedbackCode = Object.freeze({
  INCORRECT: 'INCORRECT',
  CORRECT_PLACED: 'CORRECT_PLACED',
  CORRECT_NOT_PLACED: 'CORRECT_NOT_PLACED',
});

export const FEEDBACK_MESSAGES = Object.freeze({
  [FeedbackCode.INCORRECT]: 'Respuesta incorrecta. Revisa tu razonamiento y vuelve a intentarlo, o pasa a otra pregunta.',
  [FeedbackCode.CORRECT_PLACED]: 'Respuesta correcta. La imagen avanzó.',
  [FeedbackCode.CORRECT_NOT_PLACED]: 'Respuesta correcta, pero esta pieza no pudo incorporarse a la imagen.',
});

export const SCORING = Object.freeze({
  BASE_POINTS: 100,
  WRONG_PENALTY: 20,
  HINT_PENALTY_RATIO: 0.25,
  SPEED_BONUS_RATIO: 0.25,
  DIFFICULTY_BASELINE: 2,
  DIFFICULTY_STEP: 0.25,
});

export const LIMITS = Object.freeze({
  MAX_ANSWER_LENGTH: 64,
  MAX_PLAYER_NAME_LENGTH: 40,
  DEFAULT_PLAYER_NAME: 'Jugador',
});
