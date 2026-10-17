import { useEffect } from 'react';
import { useGame } from '../context/GameContext';

export const useTimer = () => {
    const { timer, setTimer, gameState, setGameState } = useGame();

    useEffect(() => {
        if (gameState !== 'playing') return;
        const interval = setInterval(() => {
            setTimer(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setGameState('finished');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [gameState]);

    return { timer };
};