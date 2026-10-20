import LinearScoringStrategy from './LinearScoringStrategy.js';
import ForgivingScoringStrategy from './ForgivingScoringStrategy.js';

export const SCORING_STRATEGIES = Object.freeze({
  linear: LinearScoringStrategy,
  forgiving: ForgivingScoringStrategy,
});

export function createScoringStrategy(name) {
  const Strategy = SCORING_STRATEGIES[name] || LinearScoringStrategy;
  return new Strategy();
}
