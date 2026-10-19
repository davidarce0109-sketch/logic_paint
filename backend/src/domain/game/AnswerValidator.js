const { LIMITS } = require('../constants');

/** Valida la forma de la entrada del jugador y delega la corrección en la pregunta (y su Strategy). */
class AnswerValidator {
  validate(question, rawAnswer) {
    const text = rawAnswer === undefined || rawAnswer === null ? '' : String(rawAnswer).trim();
    if (text === '') return { valid: false, correct: false, message: 'Escribe o selecciona una respuesta.' };
    if (text.length > LIMITS.MAX_ANSWER_LENGTH) return { valid: false, correct: false, message: 'La respuesta es demasiado larga.' };
    return question.check(text);
  }
}

module.exports = AnswerValidator;
