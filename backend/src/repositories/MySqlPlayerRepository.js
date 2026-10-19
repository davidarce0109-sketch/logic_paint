class MySqlPlayerRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async create(name) {
    const [result] = await this.pool.execute('INSERT INTO players (name, created_at) VALUES (?, ?)', [name, Date.now()]);
    return { id: result.insertId, name };
  }
}

module.exports = MySqlPlayerRepository;
