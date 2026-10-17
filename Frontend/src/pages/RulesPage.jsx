import React from 'react';
import { useGame } from '../context/GameContext';

export const RulesPage = () => {
    const { setGameState } = useGame();
    return (
        <div style={{ maxWidth: '600px', textAlign: 'left' }}>
            <h2>Reglas del Juego</h2>
            <ul>
                <li>Resuelve preguntas de razonamiento lógico avanzado.</li>
                <li>Las preguntas se presentan en orden aleatorio.</li>
                <li>Puedes pasar preguntas y regresar a ellas más tarde.</li>
                <li>Las respuestas correctas incorporan piezas a la imagen de forma progresiva.</li>
                <li>El tiempo es limitado. ¡Descubre la lógica oculta y completa la imagen!</li>
            </ul>
            <button onClick={() => setGameState('ready')}>Volver</button>
        </div>
    );
};