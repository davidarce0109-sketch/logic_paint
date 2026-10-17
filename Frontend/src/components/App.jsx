import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { HomePage } from './pages/HomePage';
import { RulesPage } from './pages/RulesPage';
import { GamePage } from './pages/GamePage';
import { ResultPage } from './pages/ResultPage';

function Router() {
    const { gameState } = useGame();
    return (
        <div className="app-container">
            {gameState === 'ready' && <HomePage />}
            {gameState === 'rules' && <RulesPage />}
            {gameState === 'playing' && <GamePage />}
            {gameState === 'finished' && <ResultPage />}
        </div>
    );
}

export default function App() {
    return (
        <GameProvider>
            <Router />
        </GameProvider>
    );
}