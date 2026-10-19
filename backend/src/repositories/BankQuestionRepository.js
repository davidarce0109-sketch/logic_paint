/** Repositorio de preguntas en memoria alimentado directamente por el banco (modo STORAGE_DRIVER=memory). */
class BankQuestionRepository {
  constructor(bank) {
    this.definitions = bank.map((question) => ({ ...question, id: question.code }));
  }

  async findAllActive() {
    return this.definitions;
  }

  async findByIds(ids) {
    const wanted = new Set(ids.map(String));
    return this.definitions.filter((definition) => wanted.has(String(definition.id)));
  }
}

module.exports = BankQuestionRepository;
