import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { QuestionCard } from './QuestionCard';
import { PuzzleCanvas } from './PuzzleCanvas';

export const GameBoard = () => {
    const { questions, currentQuestionIndex, submitAnswer, setCurrentQuestionIndex, skipQuestion } = useGame();
    const [feedback, setFeedback] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState('');

    const currentQ = questions[currentQuestionIndex];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentQ) return;
        const res = await submitAnswer(currentQ.id, selectedAnswer);
        setFeedback(res);
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
            <div>
                <PuzzleCanvas />
            </div>
            <div>
                {currentQ ? (
                    <QuestionCard 
                        question={currentQ} 
                        index={currentQuestionIndex} 
                        selectedAnswer={selectedAnswer}
                        setSelectedAnswer={setSelectedAnswer}
                        onSubmit={handleSubmit}
                        feedback={feedback}
                        onNext={() => {
                            setFeedback(null);
                            setSelectedAnswer('');
                            setCurrentQuestionIndex(prev => (prev + 1) % questions.length);
                        }}
                        onSkip={() => {
                            skipQuestion(currentQ.id);
                            setFeedback(null);
                            setSelectedAnswer('');
                            setCurrentQuestionIndex(prev => (prev + 1) % questions.length);
                        }}
                    />
                ) : <p>Cargando preguntas...</p>}
            </div>
        </div>
    );
};