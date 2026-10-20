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
  G -->|Sí| I[El servidor aplica las reglas de la imagen]
  I --> L{¿Termina la partida?}
  L -->|No| E
  L -->|Sí| O[Resultados]
  E -->|Tiempo agotado| O
  O --> R[Comparación: imagen propia vs objetivo]
```

## Estados de una pregunta

| Estado interno | Vista del jugador | Significado |
|---|---|---|
| `pending` | Pendiente | Sin intentos |
| `passed` | Pasada | El jugador la saltó; puede volver |
| `incorrect` | Incorrecta | Último intento falló; puede reintentar |
| `placed` / `locked` | Resuelta | Respondida correctamente; la pregunta queda cerrada y no se puede repetir |

## Puntaje

`puntos = base del tipo × factor de dificultad × (+25 % si responde dentro del tiempo sugerido) × (−25 % si usó pista)`.
Con `SCORING_STRATEGY=linear`, cada error resta 20; con `forgiving`, no resta. El puntaje es independiente del resultado final.
