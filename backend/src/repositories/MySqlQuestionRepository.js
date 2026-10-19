const { rowToDefinition } = require('./questionMapper');

const COLUMNS = 'id, code, number, type, answer_format, statement, options, correct_answer, explanation, difficulty, hint';

class MySqlQuestionRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async findAllActive() {
    const [rows] = await this.pool.query(`SELECT ${COLUMNS} FROM questions WHERE is_active = 1 ORDER BY number, code`);
    return rows.map(rowToDefinition);
  }

  async findByIds(ids) {
    if (ids.length === 0) return [];
    const [rows] = await this.pool.query(`SELECT ${COLUMNS} FROM questions WHERE id IN (?)`, [ids]);
    return rows.map(rowToDefinition);
  }
}

module.exports = MySqlQuestionRepository;
