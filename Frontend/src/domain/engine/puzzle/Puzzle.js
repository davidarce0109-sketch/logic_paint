import PuzzlePiece from './PuzzlePiece.js';
import { SequenceOrder, DEFAULT_SEQUENCE_ORDER } from '../constants.js';

export default class Puzzle {
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

  sequence() {
    return this.sequenceOrder === SequenceOrder.ASCENDING ? this.pieces : [...this.pieces].reverse();
  }

  nextRequiredNumber() {
    const next = this.sequence().find((piece) => !piece.completed && !this.lost.has(piece.number));
    return next ? next.number : null;
  }

  paint(number) {
    if (number !== this.nextRequiredNumber()) throw new Error(`La pieza ${number} no puede pintarse en este momento`);
    this.pieces.find((piece) => piece.number === number).paint();
  }

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
