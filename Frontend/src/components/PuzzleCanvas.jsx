import PuzzlePieceShape from './PuzzlePieceShape.jsx';
import { PUZZLE_VIEWBOX } from '../config/constants.js';

/** Capa de presentación SVG: recibe piezas ya estructuradas y las pinta en orden. */
export default function PuzzleCanvas({ pieces, meta = PUZZLE_VIEWBOX, freshNumbers = [], label, empty = false }) {
  const ordered = [...pieces].sort((a, b) => a.number - b.number);
  return (
    <figure className="canvas">
      <svg viewBox={`0 0 ${meta.width} ${meta.height}`} role="img" aria-label={label} className="canvas__svg">
        <defs>
          <pattern id="canvas-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0H0V20" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width={meta.width} height={meta.height} className="canvas__bg" />
        <rect width={meta.width} height={meta.height} fill="url(#canvas-grid)" className="canvas__grid" />
        {ordered.map((piece) => (
          <PuzzlePieceShape key={piece.pieceId} piece={piece} fresh={freshNumbers.includes(piece.number)} />
        ))}
      </svg>
      {empty && <figcaption className="canvas__empty">Tu imagen aparecerá aquí, pieza a pieza.</figcaption>}
    </figure>
  );
}
