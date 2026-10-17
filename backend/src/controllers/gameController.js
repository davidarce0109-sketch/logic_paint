const db = require('../config/db');
const { QuestionFactory, GameEventSubject, ScoreObserver } = require('../services/gameClasses');

const eventSubject = new GameEventSubject();
eventSubject.subscribe(new ScoreObserver());

exports.createGame = async (req, res, next) => {
    try {
        const { username } = req.body;
        let [player] = await db.query('SELECT id FROM players WHERE username = ?', [username]);
        let playerId = player.length === 0 ? (await db.query('INSERT INTO players (username) VALUES (?)', [username]))[0].insertId : player[0].id;

        const [gameResult] = await db.query('INSERT INTO games (player_id, status, time_remaining) VALUES (?, "ready", 900)', [playerId]);
        const gameId = gameResult.insertId;

        const [questions] = await db.query('SELECT * FROM questions');
        for (const q of questions) {
            await db.query('INSERT INTO game_questions (game_id, question_id, status) VALUES (?, ?, "pending")', [gameId, q.id]);
        }

        res.status(201).json({ success: true, gameId, status: 'ready' });
    } catch (error) {
        next(error);
    }
};

exports.startGame = async (req, res, next) => {
    try {
        const { id } = req.params;
        await db.query('UPDATE games SET status = "playing" WHERE id = ?', [id]);
        eventSubject.notify('GameStarted', { gameId: id });
        res.json({ success: true, status: 'playing' });
    } catch (error) {
        next(error);
    }
};

exports.getQuestions = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query(`
            SELECT q.*, gq.status as game_status 
            FROM questions q 
            JOIN game_questions gq ON q.id = gq.question_id 
            WHERE gq.game_id = ?
        `, [id]);

        const sanitizedQuestions = rows.map(row => {
            const { correct_answer, ...safeProps } = row;
            if (safeProps.options) safeProps.options = JSON.parse(safeProps.options);
            return safeProps;
        });

        res.json({ success: true, questions: sanitizedQuestions.sort(() => Math.random() - 0.5) });
    } catch (error) {
        next(error);
    }
};

exports.answerQuestion = async (req, res, next) => {
    try {
        const { id, questionId } = req.params;
        const { answer } = req.body;

        const [qRows] = await db.query('SELECT * FROM questions WHERE id = ?', [questionId]);
        if (qRows.length === 0) return res.status(404).json({ success: false, message: 'Pregunta no encontrada' });
        
        const questionData = qRows[0];
        if (questionData.options) questionData.options = JSON.parse(questionData.options);

        const questionObj = QuestionFactory.createQuestion(questionData);
        const isCorrect = questionObj.checkAnswer(answer);

        const [pendingRows] = await db.query(`
            SELECT q.question_number 
            FROM game_questions gq 
            JOIN questions q ON gq.question_id = q.id 
            WHERE gq.game_id = ? AND gq.status != 'answered_correctly' 
            ORDER BY q.question_number ASC LIMIT 1
        `, [id]);

        const expectedNumber = pendingRows.length > 0 ? pendingRows[0].question_number : null;
        let piecePainted = false;

        if (isCorrect) {
            if (questionObj.number === expectedNumber) {
                await db.query('UPDATE game_questions SET status = "answered_correctly" WHERE game_id = ? AND question_id = ?', [id, questionId]);
                piecePainted = true;
                eventSubject.notify('PiecePainted', { gameId: id, questionNumber: questionObj.number });
            } else {
                await db.query('UPDATE game_questions SET status = "answered_correctly" WHERE game_id = ? AND question_id = ?', [id, questionId]);
            }
            eventSubject.notify('QuestionAnswered', { gameId: id, correct: true });
        } else {
            await db.query('UPDATE game_questions SET status = "answered_incorrectly", attempts = attempts + 1 WHERE game_id = ? AND question_id = ?', [id, questionId]);
        }

        res.json({
            success: true,
            correct: isCorrect,
            piecePainted,
            message: isCorrect 
                ? (piecePainted ? "¡Respuesta correcta! Pieza incorporada con éxito." : "¡Respuesta correcta! Sin embargo, esta pieza aún no puede incorporarse.")
                : "Respuesta incorrecta. Inténtalo de nuevo o pasa a otra pregunta.",
            explanation: questionObj.explanation
        });
    } catch (error) {
        next(error);
    }
};

exports.skipQuestion = async (req, res, next) => {
    try {
        const { id, questionId } = req.params;
        await db.query('UPDATE game_questions SET status = "skipped" WHERE game_id = ? AND question_id = ?', [id, questionId]);
        res.json({ success: true, message: 'Pregunta pasada exitosamente.' });
    } catch (error) {
        next(error);
    }
};

exports.getResult = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [results] = await db.query('SELECT * FROM games WHERE id = ?', [id]);
        res.json({ success: true, game: results[0] });
    } catch (error) {
        next(error);
    }
};