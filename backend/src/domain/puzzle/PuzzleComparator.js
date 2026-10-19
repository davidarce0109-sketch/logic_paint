const PieceMatch = Object.freeze({ MATCH: 'match', MISMATCH: 'mismatch', MISSING: 'missing' });

const sameAppearance = (a, b) =>
  a.shape === b.shape && a.color === b.color && a.position.x === b.position.x && a.position.y === b.position.y;

class PuzzleComparator {
  static compare(playerPuzzle, targetPuzzle) {
    const playerById = new Map(playerPuzzle.pieces.map((piece) => [piece.id, piece]));
    const pieces = targetPuzzle.pieces.map((target) => {
      const mine = playerById.get(target.id);
      let status = PieceMatch.MISSING;
      if (mine && mine.completed) status = sameAppearance(mine, target) ? PieceMatch.MATCH : PieceMatch.MISMATCH;
      return { pieceId: target.id, number: target.number, status };
    });
    const matched = pieces.filter((piece) => piece.status === PieceMatch.MATCH).length;
    const total = targetPuzzle.pieces.length;
    return {
      completed: matched === total && playerPuzzle.pieces.length === total,
      matched,
      total,
      pieces,
    };
  }
}

const comparePuzzle = (playerPuzzle, targetPuzzle) => PuzzleComparator.compare(playerPuzzle, targetPuzzle);

module.exports = PuzzleComparator;
module.exports.comparePuzzle = comparePuzzle;
module.exports.PieceMatch = PieceMatch;
