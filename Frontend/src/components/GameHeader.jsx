import React from 'react';
import { Timer } from './Timer';

export const GameHeader = () => (
    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '10px' }}>
        <h3>Logic Paint - Partida Activa</h3>
        <Timer />
    </div>
);