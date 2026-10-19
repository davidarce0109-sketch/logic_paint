const Player = require('../domain/game/Player');
const { NotFoundError } = require('../utils/AppError');

/**
 * Casos de uso del juego. Orquesta repositorios y dominio; no contiene reglas del juego.
 * Cada operación carga la partida, deja que el servidor decida si el tiempo se agotó (tick),
 * ejecuta la acción y persiste siempre el resultado, incluso si la acción fue rechazada.
 */
class GameService {
  constructor({ gameRepository, questionRepository, playerRepository, gameFactory }) {
    Object.assign(this, { gameRepository, questionRepository, playerRepository, gameFactory });
  }

  async createGame({ playerName } = {}) {
    const record = await this.playerRepository.create(Player.sanitizeName(playerName));
    const questionDefs = await this.questionRepository.findAllActive();
    const game = this.gameFactory.create({ player: new Player(record), questionDefs });
    await this.gameRepository.save(game);
    return { game: game.toSummary(), events: game.collector.drain() };
  }

  getGame(id) { return this.run(id, () => ({})); }
  getQuestions(id) { return this.run(id, (game) => ({ questions: game.listQuestions() })); }
  start(id) { return this.run(id, (game) => game.start()); }
  pause(id) { return this.run(id, (game) => game.pause()); }
  resume(id) { return this.run(id, (game) => game.resume()); }
  answer(id, questionId, answer) { return this.run(id, (game) => game.submitAnswer(questionId, answer)); }
  skip(id, questionId) { return this.run(id, (game) => game.skipQuestion(questionId)); }
  hint(id, questionId) { return this.run(id, (game) => game.useHint(questionId)); }
  result(id) { return this.run(id, (game) => ({ result: game.toResultView() })); }

  async run(id, action) {
    const game = await this.gameRepository.findById(id);
    if (!game) throw new NotFoundError('Partida no encontrada.', 'GAME_NOT_FOUND');
    game.tick();

    let outcome = {};
    let failure = null;
    try {
      outcome = action(game) || {};
    } catch (error) {
      failure = error;
    }
    await this.gameRepository.save(game);
    if (failure) throw failure;

    return {
      ...outcome,
      game: game.toSummary(),
      questions: outcome.questions ?? game.tryListQuestions() ?? undefined,
      events: game.collector.drain(),
    };
  }
}

module.exports = GameService;
