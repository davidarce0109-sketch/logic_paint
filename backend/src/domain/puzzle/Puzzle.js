const PuzzlePiece = require('./PuzzlePiece');

/** Modelo estructurado de la imagen: la representación visual es solo una capa de presentación. */
class Puzzle {
  constructor(pieces) {
    this.pieces = [...pieces].sort((a, b) => a.number - b.number);
  }

  static fromDefinitions(definitions, count, paintedNumbers = []) {
    const painted = new Set(paintedNumbers);
    return new Puzzle(definitions.slice(0, count).map((d) => new PuzzlePiece(d, painted.has(d.number))));
  }

  static completeFromDefinitions(definitions, count) {
    return new Puzzle(definitions.slice(0, count).map((d) => new PuzzlePiece(d, true)));
  }

  /** Número de la siguiente pieza que puede incorporarse (null si la imagen está completa). */
  nextRequiredNumber() {
    const next = this.pieces.find((piece) => !piece.completed);
    return next ? next.number : null;
  }

  paint(number) {
    if (number !== this.nextRequiredNumber()) throw new Error(`La pieza ${number} no puede pintarse todavía`);
    this.pieces.find((piece) => piece.number === number).paint();
  }

  isComplete() {
    return this.pieces.every((piece) => piece.completed);
  }

  paintedPieces() {
    return this.pieces.filter((piece) => piece.completed);
  }

  progress() {
    const painted = this.paintedPieces().length;
    const total = this.pieces.length;
    return { painted, total, percent: total === 0 ? 0 : Math.round((painted / total) * 100) };
  }

  toPlain() {
    return this.pieces.map((piece) => piece.toPlain());
  }
}

module.exports = Puzzle;
