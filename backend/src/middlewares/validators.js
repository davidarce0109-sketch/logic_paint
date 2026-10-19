const { ValidationError } = require('../utils/AppError');
const { LIMITS } = require('../domain/constants');

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const QUESTION_ID_PATTERN = /^[A-Za-z0-9_-]{1,36}$/;

function validateGameParams(req, res, next) {
  const { id, questionId } = req.params;
  if (!UUID_PATTERN.test(id)) return next(new ValidationError('Identificador de partida inválido.'));
  if (questionId !== undefined && !QUESTION_ID_PATTERN.test(questionId)) {
    return next(new ValidationError('Identificador de pregunta inválido.'));
  }
  return next();
}

function validateAnswerBody(req, res, next) {
  const answer = req.body?.answer;
  const validType = typeof answer === 'string' || typeof answer === 'number';
  if (!validType || String(answer).trim() === '') return next(new ValidationError('Falta la respuesta.'));
  if (String(answer).length > LIMITS.MAX_ANSWER_LENGTH) return next(new ValidationError('La respuesta es demasiado larga.'));
  return next();
}

function validatePlayerBody(req, res, next) {
  const name = req.body?.playerName;
  if (name !== undefined && (typeof name !== 'string' || name.length > LIMITS.MAX_PLAYER_NAME_LENGTH * 2)) {
    return next(new ValidationError('Nombre de jugador inválido.'));
  }
  return next();
}

module.exports = { validateGameParams, validateAnswerBody, validatePlayerBody };
