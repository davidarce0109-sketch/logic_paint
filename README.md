# Logic Paint

Puzle lógico + preguntas de razonamiento + construcción progresiva de una imagen + presión de tiempo.
El jugador resuelve preguntas que aparecen mezcladas; cada una está ligada a una pieza (forma, color y posición)
de una imagen oculta que el jugador va construyendo mientras avanza la partida.

```
pintar_logic/
├── backend/    API Node + Express + MySQL (dominio del juego en src/domain)
├── Frontend/   React + Vite (presentación; no contiene reglas del juego)
├── sql/        pintar_logic.sql (esquema)
├── docs/       architecture.md · uml.md · game-flow.md
└── iniciar.bat arranque en Windows
```

## Puesta en marcha

Requisitos: Node 18+ y MySQL 8 / MariaDB 10.5+ (por ejemplo, XAMPP).

**Windows:** doble clic en `iniciar.bat` (instala dependencias, crea los `.env`, inicializa la BD y abre el juego).

**Manual:**

```bash
# 1. Backend
cd backend
cp .env.example .env        # ajusta DB_USER / DB_PASSWORD
npm install
npm run db:init             # crea la BD, las tablas y carga el banco de preguntas
npm run dev                 # http://localhost:4000

# 2. Frontend (otra terminal)
cd Frontend
cp .env.example .env
npm install
npm run dev                 # http://localhost:5173 (proxy /api -> :4000)
```

Sin MySQL (solo para probar): en `backend/.env` pon `STORAGE_DRIVER=memory`.
Pruebas del dominio: `cd backend && npm test`.

## Reglas del juego

- 15 preguntas de lógica (configurable con `QUESTION_COUNT`) y 15 minutos (`GAME_DURATION_SECONDS`).
- Las preguntas aparecen mezcladas; puedes responder, pasar y volver a ellas más tarde.
- Una respuesta incorrecta no pinta nada, pero queda registrada y puedes volver a intentarlo.
- Cada pregunta está ligada a una pieza de la imagen, con su forma y su color. Las respuestas correctas ayudan a
  construir la imagen: observa qué ocurre con tu imagen y descubre cómo avanzar.
- La partida termina al completar la imagen, al agotarse el tiempo o cuando ya no queda ninguna pregunta por responder.
- Al terminar se muestra el resultado y la comparación entre tu imagen y la imagen objetivo.
- Nivel de las preguntas: estudiantes de sexto a noveno grado, 20-40 segundos por pregunta.

## Patrones de diseño utilizados

| Patrón | Problema que resuelve | Dónde está |
|---|---|---|
| **Factory Method** | Crear distintos tipos de pregunta sin que el juego conozca las clases concretas; añadir un tipo = registrar un creator. | `backend/src/domain/questions/QuestionFactory.js` (`QuestionCreator` + 5 creators concretos, `QuestionTypes.js`) |
| **Decorator** | Añadir puntaje por dificultad, bonus por rapidez y pistas con costo sin modificar `Question`. | `backend/src/domain/questions/decorators/` (`DifficultyDecorator`, `TimedQuestionDecorator`, `HintDecorator`) |
| **Strategy** | Validar respuestas de formatos distintos (opción, número, V/F) y puntuar de formas intercambiables. | `domain/strategies/validation/` (`QuestionStrategy`, `MultipleChoiceStrategy`, `NumericAnswerStrategy`, `LogicalExpressionStrategy`) y `domain/strategies/scoring/` |
| **Observer** | Que puntaje, estadísticas, auditoría en BD y respuesta al cliente reaccionen a eventos sin acoplarse al juego. | `domain/events/` (`GameEventSubject`, `ScoreObserver`, `StatisticsObserver`, `AuditLogObserver`, `EventCollectorObserver`); en el cliente `Frontend/src/domain/GameEventBus.js` + `useGameEvents` |
| **State** | Evitar `if/else` gigantes en el ciclo de vida: cada estado decide qué operaciones acepta. | `domain/game/states/` (`GameReadyState`, `GamePlayingState`, `GamePausedState`, `GameFinishedState`, `GameTimeExpiredState`) |

## SOLID

- **S** — `Timer` (tiempo), `ScoreManager` (puntaje), `AnswerValidator` (forma de la entrada), `Puzzle`/`PuzzleComparator` (imagen), `GameService` (orquestación), controladores (HTTP) y repositorios (persistencia) tienen una sola responsabilidad.
- **O** — Nuevo tipo de pregunta: una clase + `QuestionFactory.register()`. Nuevo formato de respuesta: una `QuestionStrategy` registrada. Nueva puntuación: una `ScoringStrategy`. Nueva imagen o preguntas: solo datos (`PuzzleDefinition.js`, `questionBank.js`).
- **L** — Cualquier `Question`, `QuestionDecorator`, `QuestionStrategy`, `ScoringStrategy` o `GameState` puede sustituir a su base; el juego usa solo el contrato (por eso las pruebas usan preguntas decoradas y sin decorar indistintamente).
- **I** — `QuestionStrategy` solo exige `parse` y `matches`; `ScoringStrategy` solo `onCorrect`/`onIncorrect`; los observadores solo `update(event)`; los repositorios exponen únicamente `save`/`findById`.
- **D** — `GameService` y `GameFactory` reciben repositorios, fábrica de preguntas, estrategia de puntuación, reloj y generador aleatorio por inyección; `config/container.js` es la única raíz de composición (memoria o MySQL intercambiables).

## API REST (`/api`)

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/games` | Crea la partida (`{ playerName }`) |
| GET | `/games/:id` | Estado, tiempo restante, puntaje y piezas pintadas |
| POST | `/games/:id/start` · `/pause` · `/resume` | Ciclo de vida |
| GET | `/games/:id/questions` | Preguntas en orden aleatorio (sin respuestas) |
| POST | `/games/:id/questions/:questionId/answer` | `{ answer }` |
| POST | `/games/:id/questions/:questionId/skip` | Pasar |
| POST | `/games/:id/questions/:questionId/hint` | Pedir pista |
| GET | `/games/:id/result` | Resultado final, comparación y repaso (solo si terminó) |

Respuestas: `{ ok: true, data }` o `{ ok: false, error: { code, message } }`.

## Seguridad

La respuesta correcta y la explicación nunca viajan en la lista de preguntas; la explicación llega solo tras
acertar y el repaso completo solo al terminar. Tiempo, puntaje y victoria se calculan en el backend con reloj del
servidor. Entradas validadas (UUID, longitud, formato), consultas parametrizadas, `helmet`, CORS restringido y
credenciales en `.env`. Los ids de partida son UUID (no adivinables).

## Documentación adicional

[docs/architecture.md](docs/architecture.md) · [docs/uml.md](docs/uml.md) · [docs/game-flow.md](docs/game-flow.md) ·
[backend/readme.md](backend/readme.md) · [Frontend/readme.md](Frontend/readme.md)
