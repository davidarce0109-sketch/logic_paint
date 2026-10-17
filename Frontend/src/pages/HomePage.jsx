import React, { useState } from 'react';
import { useGame } from '../context/GameContext';

export const HomePage = () => {
    const { initGame, setGameState } = useGame();
    const [username, setUsername] = useState('');

    return (
        <div style={{ textAlign: 'center' }}>
            <h1>Logic Paint</h1>
            <p>Resuelve desafíos lógicos complejos y construye progresivamente la obra oculta.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '300px', margin: '0 auto' }}>
                <input 
                    type="text" 
                    placeholder="Tu nombre de usuario" 
                    value={username} 
                    onChange={e => setUsername(e.target.value)} 
                />
                <button onClick={() => username && initGame(username)}>Iniciar Partida</button>
                <button onClick={() => setGameState('rules')} style={{ background: '#475569' }}>Cómo Jugar</button>
            </div>
        </div>
    );
};