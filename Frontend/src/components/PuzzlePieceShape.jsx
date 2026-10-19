const SVG_TAGS = ['rect', 'circle', 'ellipse', 'polygon'];

/** Dibuja una pieza a partir de su geometría declarativa (la definición vive en el backend). */
export default function PuzzlePieceShape({ piece, fresh = false }) {
  const { kind, ...attributes } = piece.geometry;
  if (!SVG_TAGS.includes(kind)) return null;
  const Tag = kind;
  return (
    <g className={`piece${fresh ? ' piece--fresh' : ''}`} data-piece={piece.pieceId}>
      <Tag {...attributes} fill={piece.color} />
    </g>
  );
}
