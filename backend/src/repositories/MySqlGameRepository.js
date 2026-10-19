const UPSERT_GAME = `
  INSERT INTO games (id, player_id, status, duration_ms, started_at, paused_at, paused_total_ms, stopped_at,
                     last_action_at, score, answered_total, correct_total, incorrect_total, skipped_total,
                     hints_used, question_count, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  ON DUPLICATE KEY UPDATE status = VALUES(status), started_at = VALUES(started_at), paused_at = VALUES(paused_at),
    paused_total_ms = VALUES(paused_total_ms), stopped_at = VALUES(stopped_at), last_action_at = VALUES(last_action_at),
    score = VALUES(score), answered_total = VALUES(answered_total), correct_total = VALUES(correct_total),
    incorrect_total = VALUES(incorrect_total), skipped_total = VALUES(skipped_total), hints_used = VALUES(hints_used)`;

const UPSERT_GAME_QUESTION = `
  INSERT INTO game_questions (game_id, question_id, display_order, status, attempts, hint_used)
  VALUES (?, ?, ?, ?, ?, ?)
  ON DUPLICATE KEY UPDATE status = VALUES(status), attempts = VALUES(attempts), hint_used = VALUES(hint_used)`;

const INSERT_ANSWER = `
  INSERT INTO answers (game_id, question_id, answer_text, is_correct, points, attempt_number, answered_at)
  VALUES (?, ?, ?, ?, ?, ?, ?)`;

const INSERT_PROGRESS = `
  INSERT IGNORE INTO game_progress (game_id, piece_number, question_id, painted_at) VALUES (?, ?, ?, ?)`;

const INSERT_RESULT = `
  INSERT IGNORE INTO game_results (game_id, outcome, reason, elapsed_ms, score, answered_total, correct_total,
                                   incorrect_total, skipped_total, accuracy_percent, pieces_painted, pieces_total, finished_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

/** Persistencia relacional de la partida; los estados se guardan en tablas, no como un blob JSON. */
class MySqlGameRepository {
  constructor({ pool, gameFactory, questionRepository }) {
    Object.assign(this, { pool, gameFactory, questionRepository });
  }

  async save(game) {
    const snapshot = game.toSnapshot();
    const { timer, stats } = snapshot;
    const { answers, progress } = game.auditLog.drain();
    const connection = await this.pool.getConnection();
    try {
      await connection.beginTransaction();
      await connection.execute(UPSERT_GAME, [
        game.id, game.player.id, snapshot.status, timer.durationMs, timer.startedAt, timer.pausedAt, timer.pausedTotalMs,
        timer.stoppedAt, snapshot.lastActionAt, snapshot.score, stats.answered, stats.correct, stats.incorrect,
        stats.skipped, stats.hintsUsed, snapshot.questions.length, snapshot.createdAt,
      ]);
      for (const q of snapshot.questions) {
        await connection.execute(UPSERT_GAME_QUESTION, [game.id, q.questionId, q.displayOrder, q.status, q.attempts, q.hintUsed ? 1 : 0]);
      }
      for (const a of answers) {
        await connection.execute(INSERT_ANSWER, [game.id, a.questionId, a.answer, a.correct ? 1 : 0, a.points, a.attempt, a.at]);
      }
      for (const p of progress) {
        await connection.execute(INSERT_PROGRESS, [game.id, p.number, p.questionId, p.at]);
      }
      if (game.state.isTerminal()) await this.saveResult(connection, game);
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async saveResult(connection, game) {
    const result = game.toResultView();
    await connection.execute(INSERT_RESULT, [
      game.id, result.outcome, result.reason, result.elapsedMs, result.score, result.stats.answered, result.stats.correct,
      result.stats.incorrect, result.stats.skipped, result.accuracy, result.comparison.matched, result.comparison.total, Date.now(),
    ]);
  }

  async findById(id) {
    const [games] = await this.pool.execute(
      'SELECT g.*, p.name AS player_name FROM games g JOIN players p ON p.id = g.player_id WHERE g.id = ?',
      [id],
    );
    if (games.length === 0) return null;
    const row = games[0];
    const [questionRows] = await this.pool.execute(
      'SELECT question_id, display_order, status, attempts, hint_used FROM game_questions WHERE game_id = ?',
      [id],
    );
    const definitions = await this.questionRepository.findByIds(questionRows.map((q) => q.question_id));
    const num = (value) => (value === null || value === undefined ? null : Number(value));

    const snapshot = {
      id: row.id,
      player: { id: row.player_id, name: row.player_name },
      status: row.status,
      timer: {
        durationMs: Number(row.duration_ms),
        startedAt: num(row.started_at),
        pausedAt: num(row.paused_at),
        pausedTotalMs: Number(row.paused_total_ms),
        stoppedAt: num(row.stopped_at),
      },
      score: Number(row.score),
      stats: {
        answered: row.answered_total,
        correct: row.correct_total,
        incorrect: row.incorrect_total,
        skipped: row.skipped_total,
        hintsUsed: row.hints_used,
      },
      lastActionAt: num(row.last_action_at),
      createdAt: Number(row.created_at),
      questions: questionRows.map((q) => ({
        questionId: q.question_id,
        status: q.status,
        attempts: q.attempts,
        hintUsed: Boolean(q.hint_used),
        displayOrder: q.display_order,
      })),
    };
    return this.gameFactory.restore(snapshot, new Map(definitions.map((d) => [String(d.id), d])));
  }
}

module.exports = MySqlGameRepository;
