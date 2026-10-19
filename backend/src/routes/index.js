const { Router } = require('express');
const GameController = require('../controllers/game.controller');
const createGameRoutes = require('./game.routes');

function createRoutes({ gameService }) {
  const router = Router();
  router.get('/health', (req, res) => res.json({ ok: true, data: { status: 'up' } }));
  router.use('/games', createGameRoutes(new GameController(gameService)));
  return router;
}

module.exports = createRoutes;
