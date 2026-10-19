const { QUESTION_BANK } = require('../domain/bank/questionBank');
const { QuestionFactory } = require('../domain/questions/QuestionFactory');
const { decorateQuestion } = require('../domain/questions/decorators');
const { createDefaultStrategyRegistry } = require('../domain/strategies/validation');
const { createScoringStrategy } = require('../domain/strategies/scoring');
const GameFactory = require('../domain/game/GameFactory');
const GameService = require('../services/game.service');

/**
 * Raíz de composición: único lugar donde se eligen las implementaciones concretas.
 * El resto del código depende de abstracciones (repositorios, estrategias, reloj).
 */
function buildContainer(config, { pool = null, clock = Date.now, rng = Math.random } = {}) {
  const questionFactory = new QuestionFactory({ strategies: createDefaultStrategyRegistry() });
  const gameFactory = new GameFactory({
    questionFactory,
    decorate: (question) => decorateQuestion(question, { hintsEnabled: config.game.hintsEnabled }),
    scoringStrategy: createScoringStrategy(config.game.scoringStrategy),
    config: config.game,
    clock,
    rng,
  });

  let repositories;
  if (config.storageDriver === 'memory') {
    const BankQuestionRepository = require('../repositories/BankQuestionRepository');
    const InMemoryPlayerRepository = require('../repositories/InMemoryPlayerRepository');
    const InMemoryGameRepository = require('../repositories/InMemoryGameRepository');
    const questionRepository = new BankQuestionRepository(QUESTION_BANK);
    repositories = {
      questionRepository,
      playerRepository: new InMemoryPlayerRepository(),
      gameRepository: new InMemoryGameRepository({ gameFactory, questionRepository }),
    };
  } else {
    const MySqlQuestionRepository = require('../repositories/MySqlQuestionRepository');
    const MySqlPlayerRepository = require('../repositories/MySqlPlayerRepository');
    const MySqlGameRepository = require('../repositories/MySqlGameRepository');
    const questionRepository = new MySqlQuestionRepository(pool);
    repositories = {
      questionRepository,
      playerRepository: new MySqlPlayerRepository(pool),
      gameRepository: new MySqlGameRepository({ pool, gameFactory, questionRepository }),
    };
  }

  const gameService = new GameService({ ...repositories, gameFactory });
  return { config, gameService, gameFactory, ...repositories, close: async () => pool?.end() };
}

module.exports = { buildContainer };
