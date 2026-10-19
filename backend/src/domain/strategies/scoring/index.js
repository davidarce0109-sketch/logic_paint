const LinearScoringStrategy = require('./LinearScoringStrategy');
const ForgivingScoringStrategy = require('./ForgivingScoringStrategy');

const SCORING_STRATEGIES = Object.freeze({
  linear: LinearScoringStrategy,
  forgiving: ForgivingScoringStrategy,
});

function createScoringStrategy(name) {
  const Strategy = SCORING_STRATEGIES[name] || LinearScoringStrategy;
  return new Strategy();
}

module.exports = { createScoringStrategy, SCORING_STRATEGIES };
