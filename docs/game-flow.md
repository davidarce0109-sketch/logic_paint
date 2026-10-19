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
  G -->|Sí| I{¿Es la pieza que toca en la secuencia?}
  I -->|No| J[Pieza perdida, pregunta bloqueada] --> L
  I -->|Sí| K[Pintar pieza] --> L{¿Imagen completa?}
  L -->|Sí| M[Victoria]
  L -->|No| P{¿Quedan preguntas por responder?}
  P -->|Sí| E
  P -->|No| Q[Fin: imagen incompleta = derrota]
  E -->|Tiempo agotado| N[Derrota]
  M --> O[Resultados: imagen propia vs objetivo]
  N --> O
  Q --> O
```

## Estados de una pregunta

| Estado interno | Vista del jugador | Significado |
|---|---|---|
| `pending` | Pendiente | Sin intentos |
| `passed` | Pasada | El jugador la saltó; puede volver |
| `incorrect` | Incorrecta | Último intento falló; puede reintentar |
| `placed` | Resuelta | Correcta y su pieza se incorporó a la imagen |
| `locked` | Resuelta | Correcta, pero no era la que tocaba: la pieza se perdió y la pregunta ya no se puede repetir |

## Puntaje

`puntos = base del tipo × factor de dificultad × (+25 % si responde dentro del tiempo sugerido) × (−25 % si usó pista)`.
Con `SCORING_STRATEGY=linear`, cada error resta 20; con `forgiving`, no resta. El puntaje no determina la victoria.
