const fs = require('node:fs');
const path = require('node:path');
const mysql = require('mysql2/promise');
const env = require('../config/env');
const { createPool } = require('../config/database');
const { seedQuestions } = require('./seedQuestions');
const { QUESTION_BANK } = require('../domain/bank/questionBank');

const SCHEMA_FILE = path.resolve(__dirname, '../../../sql/pintar_logic.sql');

/** Crea la base y las tablas (sql/pintar_logic.sql) y carga el banco de preguntas. */
async function initDatabase() {
  const sql = fs.readFileSync(SCHEMA_FILE, 'utf8');
  const { host, port, user, password } = env.db;
  const connection = await mysql.createConnection({ host, port, user, password, multipleStatements: true });
  await connection.query(sql);
  await connection.end();

  const pool = createPool(env.db);
  const total = await seedQuestions(pool, QUESTION_BANK);
  await pool.end();
  return total;
}

if (require.main === module) {
  initDatabase()
    .then((total) => console.log(`Base de datos lista. ${total} preguntas cargadas.`))
    .catch((error) => {
      console.error('No se pudo inicializar la base de datos:', error.message);
      process.exit(1);
    });
}

module.exports = { initDatabase };
