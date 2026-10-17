import React from 'react';
import { useGame } from '../context/GameContext';

export const ProgressBar = () => {
    const { paintedQuestionsCount, questions } = useGame();
    const progress = questions.length ? (paintedQuestionsCount / questions.length) * 100 : 0;
    return (
        <div style={{ width: '100%', background: '#334155', height: '10px', borderRadius: '5px' }}>
            <div style={{ width: `${progress}%`, background: '#3B82F6', height: '100%', borderRadius: '5px' }} />
        </div>
    );
};