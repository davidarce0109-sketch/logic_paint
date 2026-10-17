const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

router.post('/', gameController.createGame);
router.post('/:id/start', gameController.startGame);
router.get('/:id/questions', gameController.getQuestions);
router.post('/:id/questions/:questionId/answer', gameController.answerQuestion);
router.post('/:id/questions/:questionId/skip', gameController.skipQuestion);
router.get('/:id/result', gameController.getResult);

module.exports = router;