class InMemoryPlayerRepository {
  constructor() {
    this.sequence = 0;
  }

  async create(name) {
    this.sequence += 1;
    return { id: this.sequence, name };
  }
}

module.exports = InMemoryPlayerRepository;
