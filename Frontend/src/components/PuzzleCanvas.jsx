import React from 'react';
import { useGame } from '../context/GameContext';

export const PuzzleCanvas = () => {
    const { paintedPieces } = useGame();
    return (
        <div style={{ width: '300px', height: '300px', border: '2px dashed #475569', background: '#1E293B' }}>
            <svg width="100%" height="100%" viewBox="0 0 300 300">
                {paintedPieces.map((piece, idx) => (
                    <g key={idx} transform={`translate(${piece.position.x}, ${piece.position.y})`}>
                        {piece.shape === 'triangle' && <polygon points="30,0 60,50 0,50" fill={piece.color} />}
                        {piece.shape === 'rectangle' && <rect width="50" height="40" fill={piece.color} />}
                        {piece.shape === 'circle' && <circle cx="25" cy="25" r="25" fill={piece.color} />}
                    </g>
                ))}
            </svg>
        </div>
    );
};