import React from 'react';

export const QuestionCard = ({ question, index, selectedAnswer, setSelectedAnswer, onSubmit, feedback, onNext, onSkip }) => {
    return (
        <div style={{ background: '#1E293B', padding: '20px', borderRadius: '8px' }}>
            <h3>Pregunta #{index + 1} ({question.difficulty})</h3>
            <p>{question.statement}</p>
            <form onSubmit={onSubmit}>
                {question.options ? (
                    question.options.map((opt, i) => (
                        <label key={i} style={{ display: 'block', margin: '10px 0', cursor: 'pointer' }}>
                            <input type="radio" name="opt" value={opt} onChange={e => setSelectedAnswer(e.target.value)} /> {opt}
                        </label>
                    ))
                ) : (
                    <input type="text" placeholder="Respuesta numérica..." value={selectedAnswer} onChange={e => setSelectedAnswer(e.target.value)} />
                )}
                <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                    <button type="submit">Responder</button>
                    <button type="button" onClick={onSkip} style={{ background: '#64748B' }}>Pasar</button>
                </div>
            </form>
            {feedback && (
                <div style={{ marginTop: '15px', padding: '10px', background: feedback.correct ? '#065F46' : '#991B1B', borderRadius: '4px' }}>
                    <p><strong>{feedback.message}</strong></p>
                    <p>{feedback.explanation}</p>
                    <button onClick={onNext} style={{ marginTop: '10px' }}>Siguiente</button>
                </div>
            )}
        </div>
    );
};