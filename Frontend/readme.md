# Logic Paint — Frontend

React 18 + Vite. Solo presenta el juego: el servidor decide tiempo, respuestas, puntaje y victoria.

## Instalación

```bash
cp .env.example .env
npm install
npm run dev      # http://localhost:5173 (el proxy envía /api al backend en :4000)
npm run build
```

Variables: `VITE_API_URL` (por defecto `/api`) y `VITE_PROXY_TARGET` (destino del proxy de desarrollo).

## Estructura (`src/`)

| Carpeta | Contenido |
|---|---|
| `pages/` | `HomePage`, `RulesPage`, `GamePage`, `ResultPage` |
| `components/` | `GameBoard`, `GameHeader`, `Timer`, `ProgressBar`, `QuestionCard`, `QuestionList`, `AnswerForm`, `FeedbackBanner`, `PuzzleCanvas` (renderer SVG), `PuzzlePieceShape`, `ResultSummary`, `ImageComparison`, `ReviewList` |
| `context/` | `GameContext` (partida, preguntas, selección, feedback, resultado y acciones) |
| `hooks/` | `useGame`, `useQuestions`, `useTimer`, `useGameEvents` |
| `config/` | `api.js` (cliente HTTP) y `constants.js` |
| `services/` | `gameApi.js` (endpoints) |
| `domain/` | `GameEventBus` (Observer en cliente) y navegación entre preguntas |
| `utils/` | formato de tiempo |
| `assets/` | `app.css` |

Los componentes no contienen lógica de negocio: consumen `useGame` y renderizan lo que devuelve la API. La imagen se dibuja
desde datos estructurados (`geometry`, `color`, `position`); la imagen objetivo solo llega en `/result` cuando la partida termina.
`services/`, `domain/` y `utils/` son carpetas nuevas dentro de `src/`.
