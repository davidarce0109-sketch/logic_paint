CREATE DATABASE IF NOT EXISTS pintar_logic CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pintar_logic;

CREATE TABLE IF NOT EXISTS players (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_number INT NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL,
    statement TEXT NOT NULL,
    options JSON DEFAULT NULL,
    correct_answer VARCHAR(255) NOT NULL,
    explanation TEXT NOT NULL,
    difficulty ENUM('medium', 'hard', 'expert') DEFAULT 'hard',
    shape VARCHAR(50) NOT NULL,
    color VARCHAR(7) NOT NULL,
    pos_x INT NOT NULL,
    pos_y INT NOT NULL
);
CREATE DATABASE IF NOT EXISTS pintar_logic CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pintar_logic;

CREATE TABLE IF NOT EXISTS players (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_number INT NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL,
    statement TEXT NOT NULL,
    options JSON DEFAULT NULL,
    correct_answer VARCHAR(255) NOT NULL,
    explanation TEXT NOT NULL,
    difficulty ENUM('medium', 'hard', 'expert') DEFAULT 'hard',
    shape VARCHAR(50) NOT NULL,
    color VARCHAR(7) NOT NULL,
    pos_x INT NOT NULL,
    pos_y INT NOT NULL
);

CREATE TABLE IF NOT EXISTS games (
    id INT AUTO_INCREMENT PRIMARY KEY,
    player_id INT NOT NULL,
    status ENUM('ready', 'playing', 'paused', 'finished', 'time_expired') DEFAULT 'ready',
    time_remaining INT NOT NULL DEFAULT 900,
    score INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS game_questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    game_id INT NOT NULL,
    question_id INT NOT NULL,
    status ENUM('pending', 'answered_correctly', 'answered_incorrectly', 'skipped') DEFAULT 'pending',
    attempts INT DEFAULT 0,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS game_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    game_id INT NOT NULL UNIQUE,
    total_answered INT DEFAULT 0,
    correct_answers INT DEFAULT 0,
    incorrect_answers INT DEFAULT 0,
    skipped_questions INT DEFAULT 0,
    accuracy FLOAT DEFAULT 0,
    won BOOLEAN DEFAULT FALSE,
    finished_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);

-- Banco inicial de 15 preguntas lógicas de alta dificultad
INSERT INTO questions (question_number, type, statement, options, correct_answer, explanation, difficulty, shape, color, pos_x, pos_y) VALUES
(1, 'multiple', 'Si todos los Zeks son Loks, y algunos Loks son Moks, ¿cuál de las siguientes afirmaciones es estrictamente verdadera?', '["Algunos Zeks son Moks", "Todos los Moks son Zeks", "Algunos Loks son Zeks", "Ningún Zek es Mok"]', 'Algunos Loks son Zeks', 'El conjunto de los Zeks está contenido en los Loks, por lo que la intersección entre Loks y Zeks no es vacía.', 'hard', 'triangle', '#FF5733', 50, 50),
(2, 'numeric', '¿Qué número continúa en la serie lógica: 2, 6, 12, 20, 30, ?', NULL, '42', 'La diferencia aumenta de 2 en 2 (+4, +6, +8, +10), por lo que el siguiente incremento es +12 (30 + 12 = 42).', 'hard', 'rectangle', '#33FF57', 140, 50),
(3, 'multiple', 'En una carrera de 5 amigos, Carlos llegó antes que Juan pero después de Pedro. Luis llegó antes que Pedro y Mateo llegó último. ¿Quién ganó?', '["Carlos", "Pedro", "Luis", "Juan"]', 'Luis', 'Orden de llegada de primero a último: Luis, Pedro, Carlos, Juan, Mateo.', 'hard', 'circle', '#3357FF', 230, 50),
(4, 'multiple', 'Si el ayer del mañana de anteayer es lunes, ¿qué día es hoy?', '["Domingo", "Lunes", "Martes", "Miércoles"]', 'Martes', 'El ayer (-1) del mañana (+1) de anteayer (-2) equivale a -2 respecto a hoy. Si hace dos días fue lunes, hoy es martes.', 'expert', 'triangle', '#F3FF33', 50, 140),
(5, 'numeric', 'Si 3 gatos atrapan 3 ratones en 3 minutos, ¿cuántos minutos tardarán 100 gatos en atrapar 100 ratones?', NULL, '3', 'Cada gato tarda 3 minutos en atrapar un ratón de forma simultánea.', 'medium', 'rectangle', '#FF33F3', 140, 140),
(6, 'multiple', '¿Cuál es el valor lógico de: (Verdadero Y Falso) O (No Falso)?', '["Verdadero", "Falso", "Indeterminado", "Ninguno"]', 'Verdadero', 'Falso O Verdadero resulta en Verdadero.', 'medium', 'circle', '#33FFF0', 230, 140),
(7, 'numeric', 'Un murciélago y una pelota cuestan $1.10 en total. El murciélago cuesta $1.00 más que la pelota. ¿Cuántos centavos cuesta la pelota?', NULL, '5', 'La pelota cuesta 5 centavos y el murciélago $1.05 (1.05 + 0.05 = 1.10).', 'hard', 'triangle', '#FFA533', 50, 230),
(8, 'multiple', 'En un cajón hay 10 calcetines negros y 10 blancos, ¿cuál es el mínimo a sacar a oscuras para asegurar un par del mismo color?', '["2", "3", "4", "11"]', '3', 'Por el principio del palomar, con 3 calcetines garantizas al menos dos del mismo color.', 'hard', 'rectangle', '#A533FF', 140, 230),
(9, 'numeric', '¿Qué número falta en la matriz lógica? [2, 4, 8] | [3, 9, 27] | [4, 16, ?]', NULL, '64', 'Cada columna es una potencia: base^1, base^2, base^3. Para el 4: 4^3 = 64.', 'expert', 'circle', '#33FFA5', 230, 230),
(10, 'multiple', 'Tres dioses A, B y C son Verdadero, Falso y Errático. Si B dice "Soy Errático", ¿quién es B?', '["Verdadero", "Falso", "Errático", "Imposible"]', 'Errático', 'Solo Errático puede afirmar con ambigüedad su propia naturaleza.', 'expert', 'triangle', '#FF3333', 95, 95),
(11, 'numeric', 'Si un reloj se atrasa 2 minutos cada hora, ¿cuánto tiempo exacto tardará en marcar la hora correcta de nuevo?', NULL, '360', 'Un ciclo completo de 12 horas (720 minutos) dividido entre 2 min/hora = 360 horas.', 'hard', 'rectangle', '#33FFBD', 95, 175),
(12, 'multiple', '¿Qué figura tridimensional tiene exactamente 6 vértices y 9 aristas?', '["Cubo", "Prisma triangular", "Pirámide pentagonal", "Tetraedro"]', 'Prisma triangular', 'Un prisma triangular posee 3 vértices en la base y 3 arriba (total 6), y 9 aristas.', 'hard', 'circle', '#BD33FF', 175, 95),
(13, 'numeric', '¿Cuál es el siguiente número primo en la secuencia: 2, 3, 5, 7, 11, 13, 17, 19, ?', NULL, '23', 'Sucesión directa de números primos ordenados.', 'medium', 'triangle', '#FFBD33', 175, 175),
(14, 'multiple', 'Si Ana es más alta que Beatriz, y Carlos es más bajo que Beatriz pero más alto que Daniel, ¿quién es el segundo más alto?', '["Ana", "Beatriz", "Carlos", "Daniel"]', 'Beatriz', 'Orden de mayor a menor altura: Ana, Beatriz, Carlos, Daniel.', 'medium', 'rectangle', '#3380FF', 120, 20),
(15, 'numeric', '¿Cuántos cortes rectos se necesitan como mínimo para dividir un pastel cilíndrico en 8 porciones iguales?', NULL, '3', 'Tres cortes: dos ortogonales verticales y uno horizontal por la mitad.', 'hard', 'circle', '#FF3380', 180, 20);