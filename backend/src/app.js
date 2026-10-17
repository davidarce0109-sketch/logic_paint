const express = require('express');
const cors = require('cors');
const startupRoutes = require('./startup/routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
startupRoutes(app);
app.use(errorHandler);

module.exports = app;