import React from 'react';
export const QuestionList = ({ questions, onSelect }) => (
    <div>
        {questions.map((q, idx) => (
            <button key={q.id} onClick={() => onSelect(idx)} style={{ margin: '5px' }}>#{idx + 1}</button>
        ))}
    </div>
);