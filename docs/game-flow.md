# Flujo del juego

```mermaid
flowchart TD
  A[Inicio] --> B[Reglas]
  A --> C[Iniciar partida]
  B --> A
  C --> D[POST /games + /start]
  D --> E[Preguntas en orden aleatorio]
  E --> F{Acción}
  F -->|Responder| G{¿Correcta?}
  F -->|Pasar| E
  G -->|No| H[Feedback, intento registrado] --> E
  G -->|Sí| I{¿Es la pieza que toca?}
  I -->|No| J[Resuelta: aún no puede incorporarse] --> E
  I -->|Sí| K[Pintar pieza y piezas resueltas siguientes]
  K --> L{¿Imagen completa?}
  L -->|No| E
  L -->|Sí| M[Victoria]
  E -->|Tiempo agotado| N[Derrota]
  M --> O[Resultados: imagen propia vs objetivo]
  N --> O
```

## Estados de una pregunta

| Estado interno | Vista del jugador | Significado |
|---|---|---|
| `pending` | Pendiente | Sin intentos |
| `passed` | Pasada | El jugador la saltó; puede volver |
| `incorrect` | Incorrecta | Último intento falló; puede reintentar |
| `solved` | Resuelta | Correcta, esperando su turno de incorporarse |
| `placed` | Resuelta | Correcta e incorporada a la imagen |

## Puntaje

`puntos = base del tipo × factor de dificultad × (+25 % si responde dentro del tiempo sugerido) × (−25 % si usó pista)`.
Con `SCORING_STRATEGY=linear`, cada error resta 20; con `forgiving`, no resta. El puntaje no determina la victoria.
