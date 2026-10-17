import React from 'react';
import { useGame } from '../context/GameContext';
import { ImageComparison } from '../components/ImageComparison';

export const ResultPage = () => {
    const { setGameState } = useGame();
    return (
        <div style={{ textAlign: 'center' }}>
            <h2>Fin de la Partida</h2>
            <ImageComparison />
            <button onClick={() => setGameState('ready')} style={{ marginTop: '20px' }}>Jugar de Nuevo</button>
        </div>
    );
};