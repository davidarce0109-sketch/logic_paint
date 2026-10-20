import { QUESTION_BANK } from './bank/questionBank.js';
import { QuestionFactory } from './questions/QuestionFactory.js';
import { decorateQuestion } from './questions/decorators/index.js';
import { createDefaultStrategyRegistry } from './strategies/validation/index.js';
import { createScoringStrategy } from './strategies/scoring/index.js';
import GameFactory from './game/GameFactory.js';
import Player from './game/Player.js';
import { ApiError } from '../../config/api.js';
import { AppError } from './utils/AppError.js';

const STORAGE_PREFIX = 'lp:game:';
const RESULTS_PREFIX = 'lp:result:';

class ClientGameService {
  constructor() {
    this.definitions = QUESTION_BANK.map((question) => ({ ...question, id: question.code }));
    this.definitionsById = new Map(this.definitions.map((d) => [String(d.id), d]));

    const questionFactory = new QuestionFactory({ strategies: createDefaultStrategyRegistry() });
    this.gameFactory = new GameFactory({
      questionFactory,
      decorate: (question) => decorateQuestion(question, { hintsEnabled: true }),
      scoringStrategy: createScoringStrategy('linear'),
      config: {
        questionCount: 15,
        durationSeconds: 15 * 60,
        hintsEnabled: true,
      },
    });

    this.activeGames = new Map();
  }

  saveGame(game) {
    this.activeGames.set(game.id, game);
    try {
      sessionStorage.setItem(`${STORAGE_PREFIX}${game.id}`, JSON.stringify(game.toSnapshot()));
      if (game.state.isTerminal()) {
        sessionStorage.setItem(`${RESULTS_PREFIX}${game.id}`, JSON.stringify(game.toResultView()));
      }
    } catch {
      // Ignore storage quota errors in private browsing
    }
  }

  async loadGame(id) {
    if (this.activeGames.has(id)) {
      return this.activeGames.get(id);
    }
    const raw = sessionStorage.getItem(`${STORAGE_PREFIX}${id}`);
    if (!raw) return null;
    try {
      const snapshot = JSON.parse(raw);
      const game = this.gameFactory.restore(snapshot, this.definitionsById);
      this.activeGames.set(id, game);
      return game;
    } catch {
      return null;
    }
  }

  wrapError(error) {
    if (error instanceof AppError) {
      return new ApiError(error.message, error.status, error.code);
    }
    return new ApiError(error.message || 'Error en la partida', 500, 'INTERNAL_ERROR');
  }

  async createGame({ playerName } = {}) {
    try {
      const sanitizedName = Player.sanitizeName(playerName);
      const player = new Player({ id: 'player-1', name: sanitizedName });
      const game = this.gameFactory.create({ player, questionDefs: this.definitions });
      this.saveGame(game);
      return { game: game.toSummary(), events: game.collector.drain() };
    } catch (err) {
      throw this.wrapError(err);
    }
  }

  async run(id, action) {
    try {
      const game = await this.loadGame(id);
      if (!game) throw new ApiError('Partida no encontrada.', 404, 'GAME_NOT_FOUND');
      game.tick();

      let outcome = {};
      let failure = null;
      try {
        outcome = action(game) || {};
      } catch (error) {
        failure = error;
      }

      this.saveGame(game);
      if (failure) throw failure;

      return {
        ...outcome,
        game: game.toSummary(),
        questions: outcome.questions ?? game.tryListQuestions() ?? undefined,
        events: game.collector.drain(),
      };
    } catch (err) {
      throw this.wrapError(err);
    }
  }

  getGame(id) { return this.run(id, () => ({})); }
  getQuestions(id) { return this.run(id, (game) => ({ questions: game.listQuestions() })); }
  start(id) { return this.run(id, (game) => game.start()); }
  pause(id) { return this.run(id, (game) => game.pause()); }
  resume(id) { return this.run(id, (game) => game.resume()); }
  answer(id, questionId, answer) { return this.run(id, (game) => game.submitAnswer(questionId, answer)); }
  skip(id, questionId) { return this.run(id, (game) => game.skipQuestion(questionId)); }
  hint(id, questionId) { return this.run(id, (game) => game.useHint(questionId)); }

  async result(id) {
    try {
      const cached = sessionStorage.getItem(`${RESULTS_PREFIX}${id}`);
      if (cached) {
        return { result: JSON.parse(cached) };
      }
      return await this.run(id, (game) => ({ result: game.toResultView() }));
    } catch (err) {
      throw this.wrapError(err);
    }
  }
}

export const clientGameService = new ClientGameService();
