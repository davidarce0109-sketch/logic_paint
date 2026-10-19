const { NotFoundError } = require('../utils/AppError');

module.exports = (req, res, next) => next(new NotFoundError(`Ruta no encontrada: ${req.method} ${req.originalUrl}`, 'ROUTE_NOT_FOUND'));
