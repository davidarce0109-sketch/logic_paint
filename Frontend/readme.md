# Logic Paint — Frontend

React 18 + Vite. Presentación del juego con soporte dual:
1. **Modo Servidor (Backend API):** Se conecta a una API externa o local (`backend/`).
2. **Modo Cliente Autónomo (GitHub Pages / Standalone):** Ejecuta el motor completo del dominio directamente en el navegador con `sessionStorage`, sin necesidad de backend.

## Instalación y ejecución local

```bash
cp .env.example .env
npm install
npm run dev      # http://localhost:5173 (el proxy envía /api al backend en :4000)
npm run build
```

Variables en `.env`:
- `VITE_API_URL`: por defecto `/api` (o la URL de tu backend desplegado en Render, Railway, etc.).
- `VITE_PROXY_TARGET`: destino del proxy de desarrollo (ej. `http://localhost:4000`).
- `VITE_STANDALONE`: ponlo en `true` si deseas forzar el modo cliente autónomo en local.

## Despliegue en GitHub Pages

El proyecto ya está configurado con:
- `base: './'` en `vite.config.js`.
- `HashRouter` para evitar errores 404 al recargar páginas en GitHub Pages.
- Archivo `404.html` para redirección automática de SPA.
- Motor de juego cliente en `src/domain/engine/` que permite jugar al 100% sin servidor externo.

### Opción 1: Automático con GitHub Actions (Recomendado)
Al hacer `git push origin main`, el workflow `.github/workflows/deploy.yml` compila el frontend y lo despliega automáticamente en GitHub Pages.

Solo asegúrate de que en tu repositorio de GitHub:
1. Vayas a **Settings** > **Pages**.
2. En **Build and deployment > Source**, selecciona **GitHub Actions**.

### Opción 2: Manual desde tu terminal
```bash
cd Frontend
npm run deploy
```
O en Windows ejecuta el archivo `desplegar_gh_pages.bat` en la raíz.

## Estructura (`src/`)

| Carpeta | Contenido |
|---|---|
| `pages/` | `HomePage`, `RulesPage`, `GamePage`, `ResultPage` |
| `components/` | `GameBoard`, `GameHeader`, `Timer`, `ProgressBar`, `QuestionCard`, `QuestionList`, `AnswerForm`, `FeedbackBanner`, `PuzzleCanvas` (renderer SVG), `PuzzlePieceShape`, `ResultSummary`, `ImageComparison`, `ReviewList` |
| `context/` | `GameContext` (partida, preguntas, selección, feedback, resultado y acciones) |
| `hooks/` | `useGame`, `useQuestions`, `useTimer`, `useGameEvents` |
| `config/` | `api.js` (cliente HTTP) y `constants.js` |
| `services/` | `gameApi.js` (adaptador dual cliente/HTTP) |
| `domain/` | `GameEventBus`, navegación y subcarpeta `engine/` (motor completo del juego para cliente autónomo) |
| `utils/` | formato de tiempo |
| `assets/` | `app.css` |
