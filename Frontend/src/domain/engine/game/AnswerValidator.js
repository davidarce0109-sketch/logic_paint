import { LIMITS } from '../constants.js';

export default class AnswerValidator {
  validate(question, rawAnswer) {
    const text = rawAnswer === undefined || rawAnswer === null ? '' : String(rawAnswer).trim();
    if (text === '') return { valid: false, correct: false, message: 'Escribe o selecciona una respuesta.' };
    if (text.length > LIMITS.MAX_ANSWER_LENGTH) return { valid: false, correct: false, message: 'La respuesta es demasiado larga.' };
    return question.check(text);
  }
}
