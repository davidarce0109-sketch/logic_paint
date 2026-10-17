import React from 'react';
import { PuzzleCanvas } from './PuzzleCanvas';

export const ImageComparison = () => (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '30px' }}>
        <div>
            <h4>Tu Imagen Construida</h4>
            <PuzzleCanvas />
        </div>
        <div>
            <h4>Imagen Objetivo</h4>
            <div style={{ width: '300px', height: '300px', border: '2px solid #22c55e', background: '#1E293B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#22c55e' }}>✨ Obra Maestra Completa</span>
            </div>
        </div>
    </div>
);