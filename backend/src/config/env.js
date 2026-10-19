require('dotenv').config();

const toInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};
const toBool = (value, fallback) => (value === undefined ? fallback : String(value).toLowerCase() === 'true');

const env = Object.freeze({
  port: toInt(process.env.PORT, 4000),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  storageDriver: process.env.STORAGE_DRIVER || 'mysql',
  db: Object.freeze({
    host: process.env.DB_HOST || 'localhost',
    port: toInt(process.env.DB_PORT, 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'pintar_logic',
  }),
  game: Object.freeze({
    durationSeconds: Math.max(30, toInt(process.env.GAME_DURATION_SECONDS, 900)),
    questionCount: Math.max(1, toInt(process.env.QUESTION_COUNT, 15)),
    scoringStrategy: process.env.SCORING_STRATEGY || 'linear',
    hintsEnabled: toBool(process.env.HINTS_ENABLED, true),
  }),
});

module.exports = env;
