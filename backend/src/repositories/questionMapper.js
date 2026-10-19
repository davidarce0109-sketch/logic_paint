/** Convierte una fila de la tabla questions en la definición que consume QuestionFactory. */
function rowToDefinition(row) {
  const options = typeof row.options === 'string' ? JSON.parse(row.options) : row.options;
  return {
    id: row.id,
    code: row.code,
    number: Number(row.number),
    type: row.type,
    answerFormat: row.answer_format,
    statement: row.statement,
    options: options || [],
    correctAnswer: row.correct_answer,
    explanation: row.explanation,
    difficulty: Number(row.difficulty),
    hint: row.hint,
  };
}

module.exports = { rowToDefinition };
