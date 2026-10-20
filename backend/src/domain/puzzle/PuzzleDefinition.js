const { pieceIdFor } = require('./pieceId');

/**
 * Definición declarativa de la imagen objetivo: "El faro de medianoche".
 * Es solo datos: cualquier otra imagen puede reemplazarla sin tocar la lógica.
 * El número de la pieza fija su capa en el SVG (1 al fondo, 15 al frente). La secuencia que debe seguir
 * el jugador (por defecto descendente: 15 → 1) la define Puzzle, no esta definición.
 */
const piece = (number, shape, color, position, geometry) => ({
  id: pieceIdFor(number),
  number,
  shape,
  color,
  position,
  geometry,
});

const PUZZLE_META = Object.freeze({
  title: 'El faro de medianoche',
  width: 400,
  height: 400,
});

const PIECE_DEFINITIONS = Object.freeze([
  piece(1, 'rectangle', '#1b2a4e', { x: 200, y: 130 }, { kind: 'rect', x: 0, y: 0, width: 400, height: 260 }),
  piece(2, 'rectangle', '#1f6f8b', { x: 200, y: 325 }, { kind: 'rect', x: 0, y: 250, width: 400, height: 150 }),
  piece(3, 'circle', '#f4e9b8', { x: 320, y: 70 }, { kind: 'circle', cx: 320, cy: 70, r: 28 }),
  piece(4, 'ellipse', '#8aa0c8', { x: 90, y: 80 }, { kind: 'ellipse', cx: 90, cy: 80, rx: 55, ry: 16 }),
  piece(5, 'star', '#ffd966', { x: 200, y: 40 }, {
    kind: 'polygon',
    points: '200,22 205,35 218,40 205,45 200,58 195,45 182,40 195,35',
  }),
  piece(6, 'star', '#ffe9a0', { x: 260, y: 100 }, {
    kind: 'polygon',
    points: '260,86 264,96 274,100 264,104 260,114 256,104 246,100 256,96',
  }),
  piece(7, 'ellipse', '#2f5d3a', { x: 200, y: 290 }, { kind: 'ellipse', cx: 200, cy: 290, rx: 110, ry: 40 }),
  piece(8, 'beam', '#fff3a0', { x: 200, y: 150 }, {
    kind: 'polygon',
    points: '200,148 40,105 40,185 200,162 360,185 360,105',
    opacity: 0.35,
  }),
  piece(9, 'trapezoid', '#e8e8e8', { x: 200, y: 207 }, { kind: 'polygon', points: '178,250 222,250 212,165 188,165' }),
  piece(10, 'trapezoid', '#c0392b', { x: 200, y: 205 }, { kind: 'polygon', points: '184.5,195 215.5,195 217.9,215 182.1,215' }),
  piece(11, 'rectangle', '#f5c542', { x: 200, y: 155 }, { kind: 'rect', x: 188, y: 145, width: 24, height: 20 }),
  piece(12, 'triangle', '#8e2b2b', { x: 200, y: 138 }, { kind: 'polygon', points: '184,145 216,145 200,125' }),
  piece(13, 'trapezoid', '#7b4b2a', { x: 340, y: 315 }, { kind: 'polygon', points: '310,305 370,305 360,325 320,325' }),
  piece(14, 'triangle', '#f7f3e8', { x: 349, y: 286 }, { kind: 'polygon', points: '340,300 340,258 366,300' }),
  piece(15, 'ellipse', '#cfeff5', { x: 120, y: 335 }, { kind: 'ellipse', cx: 120, cy: 335, rx: 45, ry: 8 }),
]);

module.exports = { PUZZLE_META, PIECE_DEFINITIONS };
