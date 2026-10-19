const test = require('node:test');
const assert = require('node:assert/strict');
const { buildContainer } = require('../src/config/container');
const { QUESTION_BANK } = require('../src/domain/bank/questionBank');
const { PIECE_DEFINITIONS } = require('../src/domain/puzzle/PuzzleDefinition');
const Puzzle = require('../src/domain/puzzle/Puzzle');
const { comparePuzzle } = require('../src/domain/puzzle/PuzzleComparator');
const { createDefaultStrategyRegistry } = require('../src/domain/strategies/validation');
const { QuestionFactory } = require('../src/domain/questions/QuestionFactory');
const { decorateQuestion } = require('../src/domain/questions/decorators');
const GameEventSubject = require('../src/domain/events/GameEventSubject');

const CONFIG = { storageDriver: 'memory', game: { durationSeconds: 900, questionCount: 15, scoringStrategy: 'linear', hintsEnabled: true } };
const byCode = new Map(QUESTION_BANK.map((q) => [q.code, q]));

function setup() {
  const time = { now: 1_000_000 };
  const container = buildContainer(CONFIG, { clock: () => time.now });
  return { time, service: container.gameService, container };
}

async function newStartedGame(service) {
  const { game } = await service.createGame({ playerName: 'Test' });
  await service.start(game.id);
  const { questions } = await service.getQuestions(game.id);
  const byNumber = new Map(questions.map((q) => [q.number, q]));
  return { id: game.id, questions, byNumber };
}

const correctAnswer = (question) => byCode.get(question.id).correctAnswer;

test('crea 15 preguntas en orden aleatorio, una por pieza, sin exponer la respuesta', async () => {
  const { service } = setup();
  const { questions } = await newStartedGame(service);
  assert.equal(questions.length, 15);
  assert.deepEqual([...questions.map((q) => q.number)].sort((a, b) => a - b), Array.from({ length: 15 }, (_, i) => i + 1));
  questions.forEach((q) => {
    assert.equal(q.correctAnswer, undefined);
    assert.equal(q.explanation, undefined);
    assert.equal(JSON.stringify(q).includes('correct'), false);
  });
});

test('orden oculto: una respuesta correcta fuera de turno descarta su pieza para siempre', async () => {
  const { service } = setup();
  const { id, byNumber } = await newStartedGame(service);

  const early = await service.answer(id, byNumber.get(2).id, correctAnswer(byNumber.get(2)));
  assert.equal(early.feedback.code, 'CORRECT_NOT_PLACED');
  assert.equal(early.game.progress.painted, 0);
  assert.equal(early.questions.find((q) => q.number === 2).status, 'solved');

  // La pieza 1 sí toca: se pinta ella sola (la 2 NO se incorpora aunque ya estuviera acertada).
  const first = await service.answer(id, byNumber.get(1).id, correctAnswer(byNumber.get(1)));
  assert.equal(first.feedback.code, 'CORRECT_PLACED');
  assert.equal(first.game.progress.painted, 1);
  assert.deepEqual(first.events.filter((e) => e.type === 'PiecePainted').map((e) => e.payload.number), [1]);

  // La pieza 2 quedó perdida: la secuencia sigue con la 3 y la pregunta 2 no se puede repetir.
  const third = await service.answer(id, byNumber.get(3).id, correctAnswer(byNumber.get(3)));
  assert.equal(third.feedback.code, 'CORRECT_PLACED');
  assert.equal(third.game.progress.painted, 2);
  await assert.rejects(() => service.answer(id, byNumber.get(2).id, correctAnswer(byNumber.get(2))), { code: 'QUESTION_LOCKED' });
});

test('respuesta incorrecta no pinta, registra el intento y permite reintentar', async () => {
  const { service } = setup();
  const { id, byNumber } = await newStartedGame(service);
  const q1 = byNumber.get(1);
  const wrong = await service.answer(id, q1.id, '0');
  assert.equal(wrong.feedback.code, 'INCORRECT');
  assert.equal(wrong.feedback.explanation, undefined);
  assert.equal(wrong.game.progress.painted, 0);
  assert.equal(wrong.game.stats.incorrect, 1);
  const retry = await service.answer(id, q1.id, correctAnswer(q1));
  assert.equal(retry.feedback.code, 'CORRECT_PLACED');
});

test('pasar una pregunta la marca como pasada y se puede responder después', async () => {
  const { service } = setup();
  const { id, byNumber } = await newStartedGame(service);
  const q1 = byNumber.get(1);
  const skipped = await service.skip(id, q1.id);
  assert.equal(skipped.game.stats.skipped, 1);
  assert.equal(skipped.questions.find((q) => q.id === q1.id).status, 'passed');
  const done = await service.answer(id, q1.id, correctAnswer(q1));
  assert.equal(done.feedback.code, 'CORRECT_PLACED');
});

test('descubrir la secuencia: responder en el orden correcto gana con la imagen 100% igual', async () => {
  const { service } = setup();
  const { id, byNumber } = await newStartedGame(service);
  let last;
  for (let n = 1; n <= 15; n += 1) last = await service.answer(id, byNumber.get(n).id, correctAnswer(byNumber.get(n)));
  assert.equal(last.game.status, 'finished');
  const { result } = await service.result(id);
  assert.equal(result.outcome, 'won');
  assert.equal(result.reason, 'completed');
  assert.equal(result.comparison.completed, true);
  assert.equal(result.stats.correct, 15);
  assert.equal(result.accuracy, 100);
  assert.equal(result.targetPuzzle.length, 15);
  await assert.rejects(() => service.answer(id, byNumber.get(1).id, 'x'), { code: 'GAME_FINISHED' });
});

test('acertar las 15 preguntas sin seguir la secuencia NO gana: faltan piezas', async () => {
  const { service } = setup();
  const { id, byNumber } = await newStartedGame(service);
  let last;
  for (let n = 15; n >= 1; n -= 1) last = await service.answer(id, byNumber.get(n).id, correctAnswer(byNumber.get(n)));
  assert.equal(last.game.status, 'finished', 'sin preguntas por responder la partida termina');
  const { result } = await service.result(id);
  assert.equal(result.stats.correct, 15);
  assert.equal(result.outcome, 'lost');
  assert.equal(result.reason, 'incomplete');
  assert.equal(result.comparison.completed, false);
  assert.equal(result.comparison.matched, 1);
});

test('una sola pieza perdida basta para no ganar, aunque el resto siga el orden', async () => {
  const { service } = setup();
  const { id, byNumber } = await newStartedGame(service);
  await service.answer(id, byNumber.get(5).id, correctAnswer(byNumber.get(5))); // fuera de turno: pieza 5 perdida
  let last;
  for (let n = 1; n <= 15; n += 1) {
    if (n === 5) continue;
    last = await service.answer(id, byNumber.get(n).id, correctAnswer(byNumber.get(n)));
  }
  assert.equal(last.game.progress.painted, 14);
  const { result } = await service.result(id);
  assert.equal(result.outcome, 'lost');
  assert.deepEqual(result.comparison.pieces.filter((p) => p.status === 'missing').map((p) => p.number), [5]);
});

test('el servidor decide el tiempo: al agotarse la partida termina como derrota', async () => {
  const { service, time } = setup();
  const { id, byNumber } = await newStartedGame(service);
  time.now += 899_000;
  assert.equal((await service.getGame(id)).game.status, 'playing');
  time.now += 2_000;
  await assert.rejects(() => service.answer(id, byNumber.get(1).id, correctAnswer(byNumber.get(1))), { code: 'GAME_TIME_EXPIRED' });
  const { result } = await service.result(id);
  assert.equal(result.outcome, 'lost');
  assert.equal(result.reason, 'time_expired');
  assert.equal(result.comparison.completed, false);
});

test('la pausa detiene el reloj y reanudar lo continúa', async () => {
  const { service, time } = setup();
  const { id } = await newStartedGame(service);
  time.now += 60_000;
  const paused = await service.pause(id);
  assert.equal(paused.game.status, 'paused');
  assert.equal(paused.game.remainingMs, 840_000);
  time.now += 600_000;
  assert.equal((await service.getGame(id)).game.remainingMs, 840_000);
  await assert.rejects(() => service.getQuestions(id), { code: 'GAME_PAUSED' });
  const resumed = await service.resume(id);
  assert.equal(resumed.game.status, 'playing');
  time.now += 10_000;
  assert.equal((await service.getGame(id)).game.remainingMs, 830_000);
});

test('validación de formato: una entrada inválida no cuenta como intento', async () => {
  const { service } = setup();
  const { id, byNumber } = await newStartedGame(service);
  const numeric = byNumber.get(1);
  await assert.rejects(() => service.answer(id, numeric.id, 'abc'), { code: 'INVALID_ANSWER' });
  assert.equal((await service.getGame(id)).game.stats.answered, 0);
});

test('Strategy: formatos de respuesta', () => {
  const factory = new QuestionFactory({ strategies: createDefaultStrategyRegistry() });
  const make = (code) => factory.create({ ...byCode.get(code), id: code });
  assert.equal(make('Q01').check(' 33 ').correct, true);
  assert.equal(make('Q09').check('f, v, v').correct, true);
  assert.equal(make('Q09').check('VFF').correct, false);
  assert.equal(make('Q09').check('VF').valid, false);
  assert.equal(make('Q02').check('c').correct, true);
  assert.equal(make('Q02').check('Z').valid, false);
});

test('Decorator: pista y dificultad modifican el puntaje sin alterar la pregunta', () => {
  const factory = new QuestionFactory({ strategies: createDefaultStrategyRegistry() });
  const base = factory.create({ ...byCode.get('Q12'), id: 'Q12' });
  const decorated = decorateQuestion(base, { hintsEnabled: true });
  const plain = decorated.getPoints({ hintUsed: false, thinkingMs: null });
  const withHint = decorated.getPoints({ hintUsed: true, thinkingMs: null });
  assert.ok(withHint < plain);
  assert.equal(decorated.toPublic().hintAvailable, true);
  assert.equal(base.toPublic().hintAvailable, false);
  assert.equal(decorated.getPoints({ hintUsed: false, thinkingMs: 1000 }) > plain, true);
});

test('Observer: los suscriptores reciben los eventos y los errores no rompen al sujeto', () => {
  const subject = new GameEventSubject(() => 1);
  const seen = [];
  subject.subscribe('A', { update: () => { throw new Error('x'); } });
  subject.subscribe(['A', 'B'], { update: (e) => seen.push(e.type) });
  const originalError = console.error;
  console.error = () => {};
  subject.emit('A');
  subject.emit('B');
  console.error = originalError;
  assert.deepEqual(seen, ['A', 'B']);
});

test('comparePuzzle detecta piezas faltantes y distintas', () => {
  const target = Puzzle.completeFromDefinitions(PIECE_DEFINITIONS, 15);
  const partial = Puzzle.fromDefinitions(PIECE_DEFINITIONS, 15, [1, 2, 3]);
  const result = comparePuzzle(partial, target);
  assert.equal(result.completed, false);
  assert.equal(result.matched, 3);
  assert.equal(result.pieces.filter((p) => p.status === 'missing').length, 12);
  assert.equal(comparePuzzle(target, target).completed, true);
  const altered = Puzzle.completeFromDefinitions(PIECE_DEFINITIONS, 15);
  altered.pieces[0].color = '#000000';
  assert.equal(comparePuzzle(altered, target).pieces[0].status, 'mismatch');
});

test('la cantidad de preguntas es configurable', async () => {
  const container = buildContainer({ ...CONFIG, game: { ...CONFIG.game, questionCount: 8 } });
  const { game } = await container.gameService.createGame({ playerName: 'X' });
  await container.gameService.start(game.id);
  const { questions } = await container.gameService.getQuestions(game.id);
  assert.equal(questions.length, 8);
});
