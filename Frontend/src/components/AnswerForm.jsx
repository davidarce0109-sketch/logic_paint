import React from 'react';
export const AnswerForm = ({ onSubmit }) => (
    <form onSubmit={onSubmit}>
        <button type="submit">Enviar</button>
    </form>
);