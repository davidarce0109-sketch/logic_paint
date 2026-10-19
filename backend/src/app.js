const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const createRoutes = require('./routes');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

function createApp(container) {
  const app = express();
  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({ origin: container.config.corsOrigin }));
  app.use(express.json({ limit: '10kb' }));
  app.use('/api', createRoutes(container));
  app.use(notFound);
  app.use(errorHandler);
  return app;
}

module.exports = { createApp };
