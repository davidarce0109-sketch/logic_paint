const { randomUUID } = require('node:crypto');
const { GameStatus, QuestionStatus } = require('../constants');
const { shuffle, pickRandom } = require('../../utils/random');
const { PUZZLE_META, PIECE_DEFINITIONS } = require('../puzzle/PuzzleDefinition');
const Puzzle = require('../puzzle/Puzzle');
const GameEventSubject = require('../events/GameEventSubject');
const ScoreObserver = require('../events/ScoreObserver');
const StatisticsObserver = require('../events/StatisticsObserver');
const AuditLogObserver = require('../events/AuditLogObserver');
const EventCollectorObserver = require('../events/EventCollectorObserver');
const AnswerValidator = require('./AnswerValidator');
const ScoreManager = require('./ScoreManager');
const GameQuestion = require('./GameQuestion');
const Timer = require('./Timer');
const Game = require('./Game');

/**
 * Ensambla partidas nuevas o restauradas. Todas las dependencias se inyectan (DIP):
 * fábrica de preguntas, decorador, estrategia de puntuación, reloj, aleatoriedad y definición del puzle.
 */
class GameFactory {
  constructor({
    questionFactory,
    decorate = (question) => question,
    scoringStrategy,
    config,
    puzzleDefinition = { meta: PUZZLE_META, pieces: PIECE_DEFINITIONS },
    clock = Date.now,
    rng = Math.random,
    idGenerator = randomUUID,
  }) {
    Object.assign(this, { questionFactory, decorate, scoringStrategy, config, puzzleDefinition, clock, rng, idGenerator });
  }

  get questionCount() {
    return Math.min(this.config.questionCount, this.puzzleDefinition.pieces.length);
  }

  create({ player, questionDefs }) {
    const variantsByNumber = new Map();
    questionDefs.forEach((def) => {
      if (!variantsByNumber.has(def.number)) variantsByNumber.set(def.number, []);
      variantsByNumber.get(def.number).push(def);
    });

    const chosen = [];
    for (let number = 1; number <= this.questionCount; number += 1) {
      const variants = variantsByNumber.get(number);
      if (!variants || variants.length === 0) throw new Error(`El banco no tiene preguntas para la pieza ${number}`);
      chosen.push(pickRandom(variants, this.rng));
    }

    const entries = shuffle(chosen, this.rng).map((def, displayOrder) => new GameQuestion({
      question: this.buildQuestion(def),
      displayOrder,
    }));

    return this.assemble({
      id: this.idGenerator(),
      player,
      entries,
      status: GameStatus.READY,
      timer: new Timer({ durationMs: this.config.durationSeconds * 1000 }),
      score: 0,
      stats: {},
      lastActionAt: null,
      createdAt: this.clock(),
    });
  }

  restore(snapshot, definitionsById) {
    const entries = snapshot.questions.map((row) => {
      const def = definitionsById.get(String(row.questionId));
      if (!def) throw new Error(`Pregunta ${row.questionId} no encontrada al restaurar la partida`);
      return new GameQuestion({
        question: this.buildQuestion(def),
        status: row.status,
        attempts: row.attempts,
        hintUsed: row.hintUsed,
        displayOrder: row.displayOrder,
      });
    });
    return this.assemble({ ...snapshot, entries });
  }

  buildQuestion(definition) {
    return this.decorate(this.questionFactory.create(definition));
  }

  assemble({ id, player, entries, status, timer, score, stats, lastActionAt, createdAt }) {
    const count = entries.length;
    const painted = entries.filter((entry) => entry.status === QuestionStatus.PLACED).map((entry) => entry.number);
    const lost = entries.filter((entry) => entry.status === QuestionStatus.LOCKED).map((entry) => entry.number);
    const { pieces, meta } = this.puzzleDefinition;

    const events = new GameEventSubject(this.clock);
    const scoreManager = new ScoreManager(this.scoringStrategy, score);
    const statistics = new StatisticsObserver(stats);
    const auditLog = new AuditLogObserver();
    const collector = new EventCollectorObserver();
    events.subscribe(ScoreObserver.EVENTS, new ScoreObserver(scoreManager));
    events.subscribe(StatisticsObserver.EVENTS, statistics);
    events.subscribe(AuditLogObserver.EVENTS, auditLog);
    events.subscribe(EventCollectorObserver.EVENTS, collector);

    return new Game({
      id,
      player,
      entries,
      puzzle: Puzzle.fromDefinitions(pieces, count, painted, lost),
      targetPuzzle: Puzzle.completeFromDefinitions(pieces, count),
      puzzleMeta: meta,
      timer: timer instanceof Timer ? timer : new Timer(timer),
      scoreManager,
      statistics,
      auditLog,
      collector,
      events,
      validator: new AnswerValidator(),
      clock: this.clock,
      lastActionAt,
      createdAt,
      status,
    });
  }
}

module.exports = GameFactory;
