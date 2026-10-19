const pieceIdFor = (number) => `piece-${String(number).padStart(2, '0')}`;

module.exports = { pieceIdFor };
