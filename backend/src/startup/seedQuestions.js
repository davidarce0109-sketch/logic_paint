const UPSERT_QUESTION = `
  INSERT INTO questions (code, number, type, answer_format, statement, options, correct_answer, explanation, difficulty, hint, is_active)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
  ON DUPLICATE KEY UPDATE number = VALUES(number), type = VALUES(type), answer_format = VALUES(answer_format),
    statement = VALUES(statement), options = VALUES(options), correct_answer = VALUES(correct_answer),
    explanation = VALUES(explanation), difficulty = VALUES(difficulty), hint = VALUES(hint)`;

/** Sincroniza el banco de preguntas con la tabla questions (idempotente: se puede ejecutar en cada arranque). */
async function seedQuestions(pool, bank) {
  for (const q of bank) {
    await pool.execute(UPSERT_QUESTION, [
      q.code, q.number, q.type, q.answerFormat, q.statement, JSON.stringify(q.options || []),
      String(q.correctAnswer), q.explanation, q.difficulty, q.hint ?? null,
    ]);
  }
  return bank.length;
}

module.exports = { seedQuestions };
