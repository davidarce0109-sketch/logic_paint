# Arquitectura

## Capas

```
React (pages/components/hooks/context) ──HTTP /api──▶ controllers ─▶ GameService ─▶ domain ─▶ repositories ─▶ MySQL
```

- **Frontend:** presentación y estado de interfaz. No decide respuestas, tiempo ni victoria.
- **Controllers / routes / middlewares:** HTTP, validación de entrada y errores.
- **GameService:** casos de uso; carga la partida, deja que el servidor evalúe el tiempo, ejecuta la acción y persiste siempre.
- **Domain:** reglas del juego puras (sin Express ni SQL), probadas con `node --test`.
- **Repositories:** `MySqlGameRepository` (tablas relacionales) o `InMemoryGameRepository`, intercambiables desde `config/container.js`.

## Decisiones clave

1. **Orden oculto.** `Puzzle.nextRequiredNumber()` indica la pieza que toca según la secuencia descendente 15 → 1 (saltando las perdidas; el sentido se cambia con `SequenceOrder`). `Game.placePiece()` pinta la pieza solo si la pregunta acertada es esa; si no, `Puzzle.forfeit()` la descarta y la pregunta queda `locked` sin posibilidad de recuperarla. Para el jugador, toda pregunta acertada se ve como "resuelta". La victoria exige imagen idéntica, así que solo se gana descubriendo la secuencia; con una pieza perdida el resultado es derrota (`reason: incomplete`).
2. **Autoridad del servidor.** `Timer` usa reloj inyectable y el estado vence en el backend (`tick()`); la pausa descuenta el tiempo pausado. El cliente solo anima la cuenta regresiva y se reancla con cada respuesta.
3. **Sin trampas.** `correctAnswer` y `explanation` no están en `Question.toPublic()`. La explicación se envía tras acertar y el repaso completo, al terminar. Una respuesta incorrecta no revela la explicación para no regalar el reintento.
4. **Imagen como datos.** `PuzzleDefinition` → `Puzzle`/`PuzzlePiece` → `PuzzleComparator.compare` (forma, color, posición, completada). El SVG es solo presentación.
5. **Persistencia relacional.** `games`, `game_questions`, `answers`, `game_progress`, `game_results`, `players`, `questions` (ver `sql/pintar_logic.sql`). Las respuestas e hitos se registran vía `AuditLogObserver`.
6. **Banco desacoplado.** `questionBank.js` es solo datos; el arranque lo sincroniza con la tabla `questions`. Varias variantes por número permiten renovar preguntas.

## Pruebas

`backend/tests/game.test.js`: aleatoriedad, orden oculto y piezas perdidas, acertar todo sin secuencia (derrota), secuencia correcta (victoria), reintentos, pasar, expiración, pausa, validación, Strategy, Decorator, Observer, comparador y configuración.
