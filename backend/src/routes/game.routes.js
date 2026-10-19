const { Router } = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { validateGameParams, validateAnswerBody, validatePlayerBody } = require('../middlewares/validators');

function createGameRoutes(controller) {
  const router = Router();
  router.post('/', validatePlayerBody, asyncHandler(controller.create));
  router.get('/:id', validateGameParams, asyncHandler(controller.get));
  router.post('/:id/start', validateGameParams, asyncHandler(controller.start));
  router.post('/:id/pause', validateGameParams, asyncHandler(controller.pause));
  router.post('/:id/resume', validateGameParams, asyncHandler(controller.resume));
  router.get('/:id/questions', validateGameParams, asyncHandler(controller.questions));
  router.post('/:id/questions/:questionId/answer', validateGameParams, validateAnswerBody, asyncHandler(controller.answer));
  router.post('/:id/questions/:questionId/skip', validateGameParams, asyncHandler(controller.skip));
  router.post('/:id/questions/:questionId/hint', validateGameParams, asyncHandler(controller.hint));
  router.get('/:id/result', validateGameParams, asyncHandler(controller.result));
  return router;
}

module.exports = createGameRoutes;
