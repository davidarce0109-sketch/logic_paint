/** Capa HTTP: traduce peticiones en llamadas al servicio y devuelve { ok, data }. */
class GameController {
  constructor(gameService) {
    this.gameService = gameService;
  }

  send(res, data, status = 200) {
    return res.status(status).json({ ok: true, data });
  }

  create = async (req, res) => this.send(res, await this.gameService.createGame({ playerName: req.body?.playerName }), 201);
  get = async (req, res) => this.send(res, await this.gameService.getGame(req.params.id));
  start = async (req, res) => this.send(res, await this.gameService.start(req.params.id));
  pause = async (req, res) => this.send(res, await this.gameService.pause(req.params.id));
  resume = async (req, res) => this.send(res, await this.gameService.resume(req.params.id));
  questions = async (req, res) => this.send(res, await this.gameService.getQuestions(req.params.id));
  answer = async (req, res) => this.send(res, await this.gameService.answer(req.params.id, req.params.questionId, req.body.answer));
  skip = async (req, res) => this.send(res, await this.gameService.skip(req.params.id, req.params.questionId));
  hint = async (req, res) => this.send(res, await this.gameService.hint(req.params.id, req.params.questionId));
  result = async (req, res) => this.send(res, await this.gameService.result(req.params.id));
}

module.exports = GameController;
