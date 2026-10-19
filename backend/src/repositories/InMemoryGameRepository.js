/** Persistencia en memoria con la misma interfaz que MySqlGameRepository (sirve para pruebas y desarrollo). */
class InMemoryGameRepository {
  constructor({ gameFactory, questionRepository }) {
    this.gameFactory = gameFactory;
    this.questionRepository = questionRepository;
    this.snapshots = new Map();
    this.answers = [];
    this.progress = [];
    this.results = new Map();
  }

  async save(game) {
    this.snapshots.set(game.id, JSON.parse(JSON.stringify(game.toSnapshot())));
    const { answers, progress } = game.auditLog.drain();
    this.answers.push(...answers.map((row) => ({ gameId: game.id, ...row })));
    this.progress.push(...progress.map((row) => ({ gameId: game.id, ...row })));
    if (game.state.isTerminal()) this.results.set(game.id, game.toResultView());
  }

  async findById(id) {
    const snapshot = this.snapshots.get(id);
    if (!snapshot) return null;
    const definitions = await this.questionRepository.findByIds(snapshot.questions.map((q) => q.questionId));
    return this.gameFactory.restore(snapshot, new Map(definitions.map((d) => [String(d.id), d])));
  }
}

module.exports = InMemoryGameRepository;
