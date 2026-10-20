const PuzzlePiece = require('./PuzzlePiece');
const { SequenceOrder, DEFAULT_SEQUENCE_ORDER } = require('../constants');

/**
 * Modelo estructurado de la imagen: la representación visual es solo una capa de presentación.
 * Cada pieza solo puede pintarse cuando es "la que toca" en la secuencia. Si se acierta su pregunta
 * en otro momento, la pieza se descarta (forfeit) y ya no puede recuperarse en la partida.
 */
class Puzzle {
  constructor(pieces, lostNumbers = [], sequenceOrder = DEFAULT_SEQUENCE_ORDER) {
    this.pieces = [...pieces].sort((a, b) => a.number - b.number);
    this.lost = new Set(lostNumbers);
    this.sequenceOrder = sequenceOrder;
  }

  static fromDefinitions(definitions, count, paintedNumbers = [], lostNumbers = [], sequenceOrder = DEFAULT_SEQUENCE_ORDER) {
    const painted = new Set(paintedNumbers);
    const pieces = definitions.slice(0, count).map((d) => new PuzzlePiece(d, painted.has(d.number)));
    return new Puzzle(pieces, lostNumbers, sequenceOrder);
  }

  static completeFromDefinitions(definitions, count) {
    return new Puzzle(definitions.slice(0, count).map((d) => new PuzzlePiece(d, true)));
  }

  /** Piezas en el orden de la secuencia oculta (por defecto descendente: 15, 14, 13… 1). */
  sequence() {
    return this.sequenceOrder === SequenceOrder.ASCENDING ? this.pieces : [...this.pieces].reverse();
  }

  /** Número de la siguiente pieza que toca incorporar, saltando las descartadas (null si no queda ninguna). */
  nextRequiredNumber() {
    const next = this.sequence().find((piece) => !piece.completed && !this.lost.has(piece.number));
    return next ? next.number : null;
  }

  paint(number) {
    if (number !== this.nextRequiredNumber()) throw new Error(`La pieza ${number} no puede pintarse en este momento`);
    this.pieces.find((piece) => piece.number === number).paint();
  }

  /** Descarta definitivamente una pieza que no tocaba. */
  forfeit(number) {
    const piece = this.pieces.find((candidate) => candidate.number === number);
    if (piece && !piece.completed) this.lost.add(number);
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
