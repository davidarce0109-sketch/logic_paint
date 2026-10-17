import React from 'react';
import { GameHeader } from '../components/GameHeader';
import { GameBoard } from '../components/GameBoard';

export const GamePage = () => {
    return (
        <div style={{ width: '100%', maxWidth: '900px' }}>
            <GameHeader />
            <GameBoard />
        </div>
    );
};