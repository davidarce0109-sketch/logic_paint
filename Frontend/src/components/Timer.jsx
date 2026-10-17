import React from 'react';
import { useTimer } from '../hooks/useTimer';
import { useGame } from '../context/GameContext';

export const Timer = () => {
    const { timer } = useTimer();
    const { setGameState } = useGame();
    if (timer <= 0) setGameState('finished');
    return <span>⏱️ {Math.floor(timer / 60)}:{timer % 60 < 10 ? '0' : ''}{timer % 60}</span>;
};