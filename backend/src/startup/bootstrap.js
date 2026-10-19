const { createPool } = require('../config/database');
const { buildContainer } = require('../config/container');
const { seedQuestions } = require('./seedQuestions');
const { QUESTION_BANK } = require('../domain/bank/questionBank');

/** Prepara dependencias externas (base de datos y banco de preguntas) y devuelve el contenedor. */
async function bootstrap(config) {
  if (config.storageDriver === 'memory') return buildContainer(config);

  const pool = createPool(config.db);
  try {
    await pool.query('SELECT 1');
  } catch (error) {
    await pool.end();
    throw new Error(`No hay conexión con MySQL (${error.code || error.message}). Revisa backend/.env y ejecuta "npm run db:init".`);
  }
  const total = await seedQuestions(pool, QUESTION_BANK);
  console.log(`Banco de preguntas sincronizado (${total} preguntas).`);
  return buildContainer(config, { pool });
}

module.exports = { bootstrap };
