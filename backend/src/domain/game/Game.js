const { GameStatus, EventType, Outcome } = require('../constants');
const { NotFoundError, GameStateError } = require('../../utils/AppError');
const PuzzleComparator = require('../puzzle/PuzzleComparator');
const { createState } = require('./states');

/**
 * Agregado raíz de una partida. El ciclo de vida se delega en el objeto State actual;
 * el Game solo conserva los datos y ofrece las primitivas que los estados necesitan.
 */
class Game {
  constructor(deps) {
    this.id = deps.id;
    this.player = deps.player;
    this.entries = [...deps.entries].sort((a, b) => a.displayOrder - b.displayOrder);
    this.puzzle = deps.puzzle;
    this.targetPuzzle = deps.targetPuzzle;
    this.puzzleMeta = deps.puzzleMeta;
    this.timer = deps.timer;
    this.scoreManager = deps.scoreManager;
    this.statistics = deps.statistics;
    this.auditLog = deps.auditLog;
    this.collector = deps.collector;
    this.events = deps.events;
    this.validator = deps.validator;
    this.clock = deps.clock;
    this.lastActionAt = deps.lastActionAt ?? null;
    this.createdAt = deps.createdAt;
    this.state = createState(deps.status);
  }

  get status() { return this.state.status; }

  // ---- Operaciones públicas (delegan en el estado) ----
  start() { this.state.start(this); }
  pause() { this.tick(); this.state.pause(this); }
  resume() { this.tick(); this.state.resume(this); }
  tick() { this.state.tick(this); }
  submitAnswer(questionId, rawAnswer) { this.tick(); return this.state.submitAnswer(this, questionId, rawAnswer); }
  skipQuestion(questionId) { this.tick(); return this.state.skipQuestion(this, questionId); }
  useHint(questionId) { this.tick(); return this.state.useHint(this, questionId); }
  listQuestions() { return this.state.listQuestions(this); }

  tryListQuestions() {
    try {
      return this.listQuestions();
    } catch (error) {
      if (error instanceof GameStateError) return null;
      throw error;
    }
  }

  // ---- Primitivas usadas por los estados ----
  now() { return this.clock(); }
  emit(type, payload) { return this.events.emit(type, payload); }
  touch() { this.lastActionAt = this.now(); }
  thinkingMs() { return this.lastActionAt === null ? null : this.now() - this.lastActionAt; }
  transitionTo(status) { this.state = createState(status); }

  requireEntry(questionId) {
    const entry = this.entries.find((candidate) => String(candidate.id) === String(questionId));
    if (!entry) throw new NotFoundError('La pregunta no pertenece a esta partida.', 'QUESTION_NOT_FOUND');
    return entry;
  }

  /**
   * Orden oculto: una respuesta correcta solo incorpora su pieza si es la que toca en la secuencia.
   * Si no lo es, la pieza se descarta y la pregunta queda bloqueada: no hay segunda oportunidad.
   */
  placePiece(entry) {
    if (entry.number !== this.puzzle.nextRequiredNumber()) {
      this.puzzle.forfeit(entry.number);
      entry.markLocked();
      return false;
    }
    this.puzzle.paint(entry.number);
    entry.markPlaced();
    const piece = this.puzzle.pieces.find((candidate) => candidate.number === entry.number);
    this.emit(EventType.PIECE_PAINTED, {
      questionId: entry.id,
      number: entry.number,
      pieceId: piece.id,
      shape: piece.shape,
      color: piece.color,
    });
    return true;
  }

  hasAnswerableQuestions() {
    return this.entries.some((entry) => entry.canBeAnswered());
  }

  /** Termina la partida sin que se agote el tiempo: imagen completa o ya no quedan preguntas por responder. */
  complete() {
    this.timer.stop(this.now());
    this.transitionTo(GameStatus.FINISHED);
    this.emit(EventType.GAME_COMPLETED, { outcome: this.puzzle.isComplete() ? Outcome.WON : Outcome.LOST });
  }

  expire() {
    this.timer.stop(this.now());
    this.transitionTo(GameStatus.TIME_EXPIRED);
    this.emit(EventType.TIME_EXPIRED, { outcome: Outcome.LOST });
  }

  // ---- Vistas ----
  countByPublicStatus() {
    const counts = { pending: 0, passed: 0, incorrect: 0, solved: 0 };
    this.entries.forEach((entry) => { counts[entry.publicStatus()] += 1; });
    return counts;
  }

  toSummary() {
    const now = this.now();
    return {
      id: this.id,
      status: this.status,
      playerName: this.player.name,
      durationMs: this.timer.durationMs,
      elapsedMs: this.timer.elapsedMs(now),
      remainingMs: this.timer.remainingMs(now),
      serverTime: now,
      score: this.scoreManager.score,
      progress: this.puzzle.progress(),
      paintedPieces: this.puzzle.paintedPieces().map((piece) => piece.toPlain()),
      stats: this.statistics.toPlain(),
      counts: this.countByPublicStatus(),
      questionCount: this.entries.length,
    };
  }

  toResultView() {
    if (!this.state.isTerminal()) throw new GameStateError('La partida aún no ha terminado.', 'GAME_NOT_FINISHED');
    const comparison = PuzzleComparator.compare(this.puzzle, this.targetPuzzle);
    const won = this.status === GameStatus.FINISHED && comparison.completed;
    const now = this.now();
    return {
      outcome: won ? Outcome.WON : Outcome.LOST,
      reason: won ? 'completed' : (this.status === GameStatus.TIME_EXPIRED ? 'time_expired' : 'incomplete'),
      playerName: this.player.name,
      durationMs: this.timer.durationMs,
      elapsedMs: this.timer.elapsedMs(now),
      score: this.scoreManager.score,
      stats: this.statistics.toPlain(),
      accuracy: this.statistics.accuracy(),
      meta: this.puzzleMeta,
      playerPuzzle: this.puzzle.toPlain(),
      targetPuzzle: this.targetPuzzle.toPlain(),
      comparison,
      review: [...this.entries].sort((a, b) => a.number - b.number).map((entry) => entry.toReview()),
    };
  }

  toSnapshot() {
    return {
      id: this.id,
      player: { id: this.player.id, name: this.player.name },
      status: this.status,
      timer: this.timer.toSnapshot(),
      score: this.scoreManager.score,
      stats: this.statistics.toPlain(),
      lastActionAt: this.lastActionAt,
      createdAt: this.createdAt,
      questions: this.entries.map((entry) => entry.toSnapshot()),
    };
  }
}

module.exports = Game;
