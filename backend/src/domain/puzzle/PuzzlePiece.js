class PuzzlePiece {
  constructor(definition, completed = false) {
    this.id = definition.id;
    this.number = definition.number;
    this.shape = definition.shape;
    this.color = definition.color;
    this.position = { ...definition.position };
    this.geometry = { ...definition.geometry };
    this.completed = completed;
  }

  paint() {
    this.completed = true;
  }

  toPlain() {
    return {
      pieceId: this.id,
      number: this.number,
      shape: this.shape,
      color: this.color,
      position: { ...this.position },
      geometry: { ...this.geometry },
      completed: this.completed,
    };
  }
}

module.exports = PuzzlePiece;
