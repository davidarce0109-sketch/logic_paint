const express = require('express');
const gameRoutes = require('../routes/gameRoutes');

module.exports = function(app) {
    app.use(express.json());
    app.use('/api/games', gameRoutes);
    app.get('/', (req, res) => {
        res.json({ message: 'Logic Paint API activa' });
    });
};