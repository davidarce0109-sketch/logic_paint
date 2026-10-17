import React, { createContext, useState, useContext } from 'react';
import api from '../config/api';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
    const [gameId, setGameId] = useState(null);
    const [gameState, setGameState] = useState('ready'); // ready, rules, playing, finished
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [paintedPieces, setPaintedPieces] = useState([]);
    const [timer, setTimer] = useState(900);
    const [gameResult, setGameResult] = useState(null);

    const initGame = async (username) => {
        try {
            const res = await api.post('/games', { username });
            setGameId(res.data.gameId);
            await api.post(`/games/${res.data.gameId}/start`);
            setGameState('playing');
            fetchQuestions(res.data.gameId);
        } catch (error) {
            console.error("Error al iniciar", error);
        }
    };

    const fetchQuestions = async (id) => {
        const res = await api.get(`/games/${id}/questions`);
        if (res.data.success) setQuestions(res.data.questions);
    };

    const submitAnswer = async (questionId, answer) => {
        try {
            const res = await api.post(`/games/${gameId}/questions/${questionId}/answer`, { answer });
            if (res.data.piecePainted) {
                const currentQ = questions.find(q => q.id === questionId);
                setPaintedPieces(prev => [...prev, currentQ.piece]);
            }
            return res.data;
        } catch (error) {
            return { success: false, message: 'Error de conexión' };
        }
    };

    const skipQuestion = async (questionId) => {
        await api.post(`/games/${gameId}/questions/${questionId}/skip`);
    };

    return (
        <GameContext.Provider value={{
            gameId, gameState, setGameState, questions, currentQuestionIndex,
            setCurrentQuestionIndex, paintedPieces, initGame, submitAnswer, skipQuestion,
            timer, setTimer, gameResult, setGameResult
        }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => useContext(GameContext);