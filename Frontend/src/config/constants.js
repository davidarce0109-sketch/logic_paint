export const ROUTES = Object.freeze({ HOME: '/', RULES: '/reglas', GAME: '/partida', RESULT: '/resultado' });

export const GAME_STATUS = Object.freeze({
  READY: 'ready',
  PLAYING: 'playing',
  PAUSED: 'paused',
  FINISHED: 'finished',
  TIME_EXPIRED: 'time_expired',
});

export const TERMINAL_STATUSES = [GAME_STATUS.FINISHED, GAME_STATUS.TIME_EXPIRED];

export const QUESTION_STATUS = Object.freeze({
  PENDING: 'pending',
  PASSED: 'passed',
  INCORRECT: 'incorrect',
  SOLVED: 'solved',
});

export const STATUS_LABELS = Object.freeze({
  pending: 'Pendiente',
  passed: 'Pasada',
  incorrect: 'Incorrecta',
  solved: 'Resuelta',
});

export const DIFFICULTY_LABELS = Object.freeze({ 1: 'Fácil', 2: 'Media', 3: 'Media-alta' });

export const ANSWER_FORMAT = Object.freeze({
  MULTIPLE_CHOICE: 'multiple_choice',
  NUMERIC: 'numeric',
  LOGICAL_EXPRESSION: 'logical_expression',
});

export const FEEDBACK_TONE = Object.freeze({
  INCORRECT: 'bad',
  CORRECT_PLACED: 'good',
  CORRECT_NOT_PLACED: 'warn',
});

export const GAME_EVENTS = Object.freeze({
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

export const API_ERROR_CODES = Object.freeze({
  GAME_NOT_FOUND: 'GAME_NOT_FOUND',
  GAME_FINISHED: 'GAME_FINISHED',
  GAME_TIME_EXPIRED: 'GAME_TIME_EXPIRED',
});

export const PUZZLE_VIEWBOX = Object.freeze({ width: 400, height: 400 });
export const STORAGE_KEY = 'logic-paint:game-id';
export const MAX_PLAYER_NAME = 40;
export const FRESH_PIECE_MS = 1600;
export const TIMER_TICK_MS = 250;
export const LOW_TIME_MS = 60_000;
