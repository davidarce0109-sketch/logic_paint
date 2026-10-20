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
    const total = await seedQuestions(pool, QUESTION_BANK);
    console.log(`Banco de preguntas sincronizado (${total} preguntas).`);
    return buildContainer(config, { pool });
  } catch (error) {
    await pool.end().catch(() => {});
    console.warn(`\n[AVISO] No se pudo conectar con MySQL (${error.code || error.message}).`);
    console.warn('[AVISO] Se inicia temporalmente en modo memoria (STORAGE_DRIVER=memory) para mantener la API en línea.');
    console.warn('[AVISO] Para persistencia en base de datos, revisa backend/.env y ejecuta "npm run db:init".\n');
    return buildContainer({ ...config, storageDriver: 'memory' });
  }
}

module.exports = { bootstrap };
