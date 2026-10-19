import PuzzleCanvas from './PuzzleCanvas.jsx';

const STATUS_TEXT = { match: 'Correcta', mismatch: 'Distinta', missing: 'Faltó' };

export default function ImageComparison({ result }) {
  const painted = result.playerPuzzle.filter((piece) => piece.completed);
  return (
    <section className="comparison" aria-label="Comparación de imágenes">
      <div className="comparison__pair">
        <div>
          <h2 className="comparison__title">Tu imagen</h2>
          <PuzzleCanvas pieces={painted} meta={result.meta} label="Imagen construida por el jugador" />
        </div>
        <div>
          <h2 className="comparison__title">Imagen objetivo</h2>
          <PuzzleCanvas pieces={result.targetPuzzle} meta={result.meta} label={`Imagen objetivo: ${result.meta.title}`} />
        </div>
      </div>
      <ul className="comparison__pieces" aria-label="Detalle por pieza">
        {result.comparison.pieces.map((piece) => (
          <li key={piece.pieceId} className={`piece-status piece-status--${piece.status}`}>
            <span className="piece-status__number">{piece.number}</span>
            <span>{STATUS_TEXT[piece.status]}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
