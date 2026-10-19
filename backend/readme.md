# Logic Paint — Backend

API REST (Node + Express + MySQL). Las reglas del juego viven en `src/domain`, sin dependencias de Express ni de MySQL.

## Instalación

```bash
cp .env.example .env
npm install
npm run db:init   # ejecuta ../sql/pintar_logic.sql y carga el banco de preguntas
npm run dev       # o: npm start
npm test          # pruebas del dominio y los casos de uso (usa persistencia en memoria)
```

## Variables de entorno (`.env.example`)

| Variable | Descripción | Por defecto |
|---|---|---|
| `PORT` | Puerto de la API | `4000` |
| `CORS_ORIGIN` | Origen permitido | `http://localhost:5173` |
| `STORAGE_DRIVER` | `mysql` o `memory` | `mysql` |
| `DB_HOST` `DB_PORT` `DB_USER` `DB_PASSWORD` `DB_NAME` | Conexión MySQL (`DB_NAME` debe ser `pintar_logic`, el nombre que crea el SQL) | localhost / 3306 / root / vacío |
| `GAME_DURATION_SECONDS` | Duración de la partida | `900` |
| `QUESTION_COUNT` | Preguntas por partida (1–15) | `15` |
| `SCORING_STRATEGY` | `linear` o `forgiving` | `linear` |
| `HINTS_ENABLED` | Pistas con costo | `true` |

## Estructura

```
src/
├── config/        env, pool MySQL y container.js (raíz de composición)
├── controllers/   capa HTTP
├── middlewares/   validación, 404 y errores
├── routes/        endpoints
├── services/      game.service.js (casos de uso)
├── startup/       bootstrap, initDatabase, seedQuestions
├── utils/         AppError, asyncHandler, random
├── repositories/  MySQL y memoria (misma interfaz)
└── domain/        núcleo del juego
    ├── game/        Game, GameFactory, GameQuestion, Timer, Player, AnswerValidator, ScoreManager, states/
    ├── questions/   Question, QuestionTypes, QuestionFactory, decorators/
    ├── strategies/  validation/ y scoring/
    ├── events/      GameEventSubject y observadores
    ├── puzzle/      PuzzleDefinition, Puzzle, PuzzlePiece, PuzzleComparator
    └── bank/        questionBank.js (datos)
```

`repositories/` y `domain/` son carpetas nuevas dentro de `src/`. `uploads/` queda reservada (el juego no sube archivos).

## Cómo ampliar

- **Preguntas:** añade objetos a `domain/bank/questionBank.js` (varias variantes por `number` son válidas; se elige una al azar por partida) y reinicia: el arranque sincroniza la tabla `questions`.
- **Tipo de pregunta:** crea la clase, un creator y `questionFactory.register(tipo, creator)`.
- **Imagen:** edita `domain/puzzle/PuzzleDefinition.js` (formas `rect`, `circle`, `ellipse`, `polygon`).

Detalles de patrones, SOLID, endpoints y UML: ver `../README.md` y `../docs/`.
