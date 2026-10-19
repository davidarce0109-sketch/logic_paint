const { AppError } = require('../utils/AppError');

// eslint-disable-next-line no-unused-vars
module.exports = (error, req, res, next) => {
  if (error instanceof AppError) {
    return res.status(error.status).json({ ok: false, error: { code: error.code, message: error.message } });
  }
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ ok: false, error: { code: 'INVALID_JSON', message: 'El cuerpo de la petición no es JSON válido.' } });
  }
  console.error(error);
  return res.status(500).json({ ok: false, error: { code: 'INTERNAL_ERROR', message: 'Error interno del servidor.' } });
};
