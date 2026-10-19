-- Logic Paint: esquema de base de datos (MySQL 8 / MariaDB 10.5+)
-- Ejecutar con: cd backend && npm run db:init   (también carga el banco de preguntas)

CREATE DATABASE IF NOT EXISTS pintar_logic CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pintar_logic;

CREATE TABLE IF NOT EXISTS players (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name        VARCHAR(40)  NOT NULL,
  created_at  BIGINT       NOT NULL,
  PRIMARY KEY (id)
) ENGINE = InnoDB;

-- Banco de preguntas. correct_answer solo lo lee el servidor; nunca se envía al navegador en partida.
CREATE TABLE IF NOT EXISTS questions (
  id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  code            VARCHAR(16)  NOT NULL,
  number          TINYINT UNSIGNED NOT NULL,
  type            VARCHAR(24)  NOT NULL,
  answer_format   VARCHAR(24)  NOT NULL,
  statement       TEXT         NOT NULL,
  options         JSON         NULL,
  correct_answer  VARCHAR(64)  NOT NULL,
  explanation     TEXT         NOT NULL,
  difficulty      TINYINT UNSIGNED NOT NULL,
  hint            VARCHAR(255) NULL,
  is_active       TINYINT(1)   NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY uq_questions_code (code),
  KEY idx_questions_number (number)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS games (
  id               CHAR(36)     NOT NULL,
  player_id        INT UNSIGNED NOT NULL,
  status           VARCHAR(16)  NOT NULL,
  duration_ms      BIGINT       NOT NULL,
  started_at       BIGINT       NULL,
  paused_at        BIGINT       NULL,
  paused_total_ms  BIGINT       NOT NULL DEFAULT 0,
  stopped_at       BIGINT       NULL,
  last_action_at   BIGINT       NULL,
  score            INT          NOT NULL DEFAULT 0,
  answered_total   INT          NOT NULL DEFAULT 0,
  correct_total    INT          NOT NULL DEFAULT 0,
  incorrect_total  INT          NOT NULL DEFAULT 0,
  skipped_total    INT          NOT NULL DEFAULT 0,
  hints_used       INT          NOT NULL DEFAULT 0,
  question_count   TINYINT UNSIGNED NOT NULL,
  created_at       BIGINT       NOT NULL,
  PRIMARY KEY (id),
  KEY idx_games_player (player_id),
  CONSTRAINT fk_games_player FOREIGN KEY (player_id) REFERENCES players (id)
) ENGINE = InnoDB;

-- Preguntas asignadas a cada partida, con su orden aleatorio de aparición y su estado.
CREATE TABLE IF NOT EXISTS game_questions (
  game_id        CHAR(36)     NOT NULL,
  question_id    INT UNSIGNED NOT NULL,
  display_order  TINYINT UNSIGNED NOT NULL,
  status         VARCHAR(16)  NOT NULL DEFAULT 'pending',
  attempts       INT          NOT NULL DEFAULT 0,
  hint_used      TINYINT(1)   NOT NULL DEFAULT 0,
  PRIMARY KEY (game_id, question_id),
  CONSTRAINT fk_gq_game     FOREIGN KEY (game_id)     REFERENCES games (id) ON DELETE CASCADE,
  CONSTRAINT fk_gq_question FOREIGN KEY (question_id) REFERENCES questions (id)
) ENGINE = InnoDB;

-- Historial de cada intento de respuesta.
CREATE TABLE IF NOT EXISTS answers (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  game_id         CHAR(36)     NOT NULL,
  question_id     INT UNSIGNED NOT NULL,
  answer_text     VARCHAR(64)  NOT NULL,
  is_correct      TINYINT(1)   NOT NULL,
  points          INT          NOT NULL DEFAULT 0,
  attempt_number  INT          NOT NULL,
  answered_at     BIGINT       NOT NULL,
  PRIMARY KEY (id),
  KEY idx_answers_game (game_id),
  CONSTRAINT fk_answers_game     FOREIGN KEY (game_id)     REFERENCES games (id) ON DELETE CASCADE,
  CONSTRAINT fk_answers_question FOREIGN KEY (question_id) REFERENCES questions (id)
) ENGINE = InnoDB;

-- Piezas pintadas en la imagen del jugador, en el orden real en que se incorporaron.
CREATE TABLE IF NOT EXISTS game_progress (
  game_id      CHAR(36)     NOT NULL,
  piece_number TINYINT UNSIGNED NOT NULL,
  question_id  INT UNSIGNED NOT NULL,
  painted_at   BIGINT       NOT NULL,
  PRIMARY KEY (game_id, piece_number),
  CONSTRAINT fk_progress_game FOREIGN KEY (game_id) REFERENCES games (id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS game_results (
  game_id           CHAR(36)    NOT NULL,
  outcome           VARCHAR(8)  NOT NULL,
  reason            VARCHAR(16) NOT NULL,
  elapsed_ms        BIGINT      NOT NULL,
  score             INT         NOT NULL,
  answered_total    INT         NOT NULL,
  correct_total     INT         NOT NULL,
  incorrect_total   INT         NOT NULL,
  skipped_total     INT         NOT NULL,
  accuracy_percent  TINYINT UNSIGNED NOT NULL,
  pieces_painted    TINYINT UNSIGNED NOT NULL,
  pieces_total      TINYINT UNSIGNED NOT NULL,
  finished_at       BIGINT      NOT NULL,
  PRIMARY KEY (game_id),
  CONSTRAINT fk_results_game FOREIGN KEY (game_id) REFERENCES games (id) ON DELETE CASCADE
) ENGINE = InnoDB;
