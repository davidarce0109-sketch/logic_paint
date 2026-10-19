/**
 * Banco de preguntas (datos puros, separado de la lógica del juego).
 * - Nivel: estudiantes de sexto a noveno grado. Cada pregunta se resuelve en 20-40 segundos,
 *   de modo que 15 preguntas caben con holgura en los 15 minutos de la partida.
 * - Cada `number` corresponde a una pieza de la imagen; puede tener varias variantes y
 *   el juego elige una al azar por partida (así el banco crece sin tocar código).
 * - `correctAnswer` solo vive en el servidor: nunca viaja al navegador durante la partida.
 * - difficulty: 1 = fácil, 2 = media, 3 = media-alta.
 */
const opts = (...texts) => texts.map((text, index) => ({ id: String.fromCharCode(65 + index), text }));

const QUESTION_BANK = Object.freeze([
  {
    code: 'Q01', number: 1, type: 'sequence', answerFormat: 'numeric', difficulty: 2,
    statement: 'Completa la sucesión: 3, 5, 9, 15, 23, … ¿Cuál es el siguiente número?',
    options: [], correctAnswer: '33',
    hint: 'Mira cuánto aumenta cada término respecto al anterior.',
    explanation: 'Las diferencias son 2, 4, 6, 8: aumentan de 2 en 2. La siguiente es 10, así que 23 + 10 = 33.',
  },
  {
    code: 'Q01B', number: 1, type: 'sequence', answerFormat: 'numeric', difficulty: 1,
    statement: 'Completa la sucesión: 2, 4, 8, 16, … ¿Cuál es el siguiente número?',
    options: [], correctAnswer: '32',
    hint: 'Cada término se obtiene del anterior con la misma operación.',
    explanation: 'Cada término es el doble del anterior: 16 × 2 = 32.',
  },
  {
    code: 'Q02', number: 2, type: 'deduction', answerFormat: 'multiple_choice', difficulty: 1,
    statement: 'Luis llegó a la meta antes que Marta. Marta llegó antes que Nora. Óscar llegó después de Nora. ¿Quién llegó en tercer lugar?',
    options: opts('Luis', 'Marta', 'Nora', 'Óscar'), correctAnswer: 'C',
    hint: 'Ordena a los cuatro de primero a último.',
    explanation: 'El orden es Luis, Marta, Nora, Óscar. En tercer lugar llegó Nora.',
  },
  {
    code: 'Q03', number: 3, type: 'logic', answerFormat: 'multiple_choice', difficulty: 2,
    statement: 'Se sabe que: «Si llueve, Pedro lleva paraguas». Hoy Pedro NO llevó paraguas. ¿Qué se puede concluir con seguridad?',
    options: opts('Hoy llovió', 'Hoy no llovió', 'Pedro olvidó el paraguas', 'No se puede saber'), correctAnswer: 'B',
    hint: 'Si hubiera llovido, ¿qué habría hecho Pedro?',
    explanation: 'Si hubiera llovido, Pedro habría llevado paraguas. Como no lo llevó, se puede asegurar que no llovió.',
  },
  {
    code: 'Q03B', number: 3, type: 'logic', answerFormat: 'multiple_choice', difficulty: 2,
    statement: 'Se sabe que: «Si hoy es sábado, hay partido en el parque». Hoy hay partido en el parque. ¿Qué se puede concluir con seguridad?',
    options: opts('Hoy es sábado', 'Hoy no es sábado', 'Hoy puede ser sábado o no', 'Mañana es domingo'), correctAnswer: 'C',
    hint: 'La frase no dice que el partido solo se juegue los sábados.',
    explanation: 'La frase dice qué ocurre si es sábado, pero no impide que haya partido otro día. Por eso hoy puede ser sábado o no.',
  },
  {
    code: 'Q04', number: 4, type: 'math_logic', answerFormat: 'numeric', difficulty: 1,
    statement: 'Si 3 cuadernos iguales cuestan 18 pesos, ¿cuánto cuestan 5 cuadernos iguales?',
    options: [], correctAnswer: '30',
    hint: 'Calcula primero cuánto cuesta un cuaderno.',
    explanation: 'Un cuaderno cuesta 18 ÷ 3 = 6 pesos. Cinco cuestan 6 × 5 = 30 pesos.',
  },
  {
    code: 'Q04B', number: 4, type: 'math_logic', answerFormat: 'numeric', difficulty: 1,
    statement: '¿Cuántos múltiplos de 5 hay entre 1 y 60 (contando el 60)?',
    options: [], correctAnswer: '12',
    hint: 'Los múltiplos de 5 son 5, 10, 15… hasta llegar a 60.',
    explanation: 'Como 60 ÷ 5 = 12, hay 12 múltiplos de 5: desde 5 × 1 hasta 5 × 12.',
  },
  {
    code: 'Q05', number: 5, type: 'pattern', answerFormat: 'numeric', difficulty: 2,
    statement: 'Cada pareja (a, b) produce un resultado con la misma regla: (2, 3) → 7; (4, 1) → 5; (5, 2) → 11; (3, 3) → ?',
    options: [], correctAnswer: '10',
    hint: 'Prueba multiplicar los dos números y luego haz un pequeño ajuste.',
    explanation: 'La regla es a × b + 1: 2×3+1 = 7, 4×1+1 = 5, 5×2+1 = 11, y 3×3+1 = 10.',
  },
  {
    code: 'Q06', number: 6, type: 'deduction', answerFormat: 'multiple_choice', difficulty: 1,
    statement: 'Ana, Beto y Carla tienen una mascota distinta cada uno: perro, gato o pez. Ana no tiene perro ni pez. Beto no tiene pez. ¿Qué mascota tiene Beto?',
    options: opts('Perro', 'Gato', 'Pez', 'No se puede saber'), correctAnswer: 'A',
    hint: 'Empieza por la persona con más restricciones.',
    explanation: 'Ana no tiene perro ni pez, así que tiene el gato. Beto no tiene pez y el gato ya es de Ana, luego Beto tiene el perro (y Carla el pez).',
  },
  {
    code: 'Q07', number: 7, type: 'math_logic', answerFormat: 'multiple_choice', difficulty: 2,
    statement: 'Cuatro obreros construyen un muro en 6 días. Si trabajan 6 obreros al mismo ritmo, ¿cuántos días tardarán?',
    options: opts('3 días', '4 días', '5 días', '9 días'), correctAnswer: 'B',
    hint: 'Calcula primero cuánto trabajo total hay, en obreros por día.',
    explanation: 'El trabajo equivale a 4 × 6 = 24 obreros-día. Con 6 obreros: 24 ÷ 6 = 4 días.',
  },
  {
    code: 'Q07B', number: 7, type: 'math_logic', answerFormat: 'multiple_choice', difficulty: 1,
    statement: 'Una receta para 4 personas usa 300 g de harina. ¿Cuántos gramos se necesitan para 10 personas?',
    options: opts('600 g', '750 g', '800 g', '900 g'), correctAnswer: 'B',
    hint: 'Calcula cuánta harina lleva cada persona.',
    explanation: 'Cada persona usa 300 ÷ 4 = 75 g. Para 10 personas: 75 × 10 = 750 g.',
  },
  {
    code: 'Q08', number: 8, type: 'math_logic', answerFormat: 'numeric', difficulty: 2,
    statement: 'En un salón de 28 estudiantes, 16 juegan fútbol, 14 juegan baloncesto y todos juegan al menos uno de los dos deportes. ¿Cuántos estudiantes juegan los dos deportes?',
    options: [], correctAnswer: '2',
    hint: 'Si sumas 16 + 14, ¿a quiénes estás contando dos veces?',
    explanation: 'Al sumar 16 + 14 = 30 se cuenta dos veces a quienes juegan ambos. Como en total son 28, esos son 30 − 28 = 2.',
  },
  {
    code: 'Q09', number: 9, type: 'logic', answerFormat: 'logical_expression', difficulty: 1,
    statement: 'Indica si cada afirmación es verdadera (V) o falsa (F): I) 9 es un número primo. II) 15 es múltiplo de 3. III) El doble de 14 es 28. Escribe las tres letras en orden (por ejemplo: VVV).',
    options: [], correctAnswer: 'FVV',
    hint: 'Un número primo solo se puede dividir exactamente entre 1 y entre sí mismo.',
    explanation: 'I) 9 = 3 × 3, no es primo: F. II) 15 = 3 × 5: V. III) 14 × 2 = 28: V. La respuesta es FVV.',
  },
  {
    code: 'Q10', number: 10, type: 'sequence', answerFormat: 'numeric', difficulty: 2,
    statement: 'Completa la sucesión: 2, 3, 5, 8, 12, … ¿Cuál es el siguiente número?',
    options: [], correctAnswer: '17',
    hint: 'Observa cuánto se suma en cada paso.',
    explanation: 'Se suma 1, 2, 3, 4… La siguiente suma es 5, así que 12 + 5 = 17.',
  },
  {
    code: 'Q11', number: 11, type: 'deduction', answerFormat: 'multiple_choice', difficulty: 1,
    statement: 'Cuatro amigos hacen fila. Ugo está al inicio y Vera está al final. Sara está justo detrás de Tomás. ¿Quién está en el tercer puesto?',
    options: opts('Sara', 'Tomás', 'Ugo', 'Vera'), correctAnswer: 'A',
    hint: 'Ubica primero a los que tienen lugar fijo y completa los puestos del medio.',
    explanation: 'La fila es Ugo, Tomás, Sara, Vera. En el tercer puesto está Sara.',
  },
  {
    code: 'Q12', number: 12, type: 'logic', answerFormat: 'multiple_choice', difficulty: 2,
    statement: 'Solo tienes monedas de 1, 2 y 5 pesos. ¿Cuál es el menor número de monedas con el que puedes pagar exactamente 13 pesos?',
    options: opts('3', '4', '5', '6'), correctAnswer: 'B',
    hint: 'Usa tantas monedas grandes como puedas.',
    explanation: 'Con 5 + 5 + 2 + 1 = 13 bastan 4 monedas. Con solo 3 monedas no se puede llegar a 13 exactamente.',
  },
  {
    code: 'Q12B', number: 12, type: 'math_logic', answerFormat: 'multiple_choice', difficulty: 1,
    statement: 'Un pastel se corta en 8 porciones iguales. Ana come 3 porciones y Beto come 2. ¿Qué fracción del pastel queda?',
    options: opts('3/8', '5/8', '1/4', '1/2'), correctAnswer: 'A',
    hint: 'Cuenta cuántas porciones quedan de las 8.',
    explanation: 'Se comieron 3 + 2 = 5 porciones, así que quedan 8 − 5 = 3 de 8: 3/8.',
  },
  {
    code: 'Q13', number: 13, type: 'math_logic', answerFormat: 'numeric', difficulty: 2,
    statement: '¿Cuál es el resultado de 2 + 3 × 4 − 5?',
    options: [], correctAnswer: '9',
    hint: 'Recuerda el orden de las operaciones: primero las multiplicaciones.',
    explanation: 'Primero 3 × 4 = 12; luego 2 + 12 = 14; y por último 14 − 5 = 9.',
  },
  {
    code: 'Q13B', number: 13, type: 'math_logic', answerFormat: 'numeric', difficulty: 2,
    statement: '¿Cuál es el resultado de 18 ÷ 3 + 2 × (7 − 4)?',
    options: [], correctAnswer: '12',
    hint: 'Resuelve primero el paréntesis; después multiplicación y división.',
    explanation: 'Paréntesis: 7 − 4 = 3. Luego 18 ÷ 3 = 6 y 2 × 3 = 6. Finalmente 6 + 6 = 12.',
  },
  {
    code: 'Q14', number: 14, type: 'pattern', answerFormat: 'multiple_choice', difficulty: 1,
    statement: 'Las letras L, M, M, J, V, S siguen una regla. ¿Cuál es la letra que sigue?',
    options: opts('D', 'J', 'V', 'M'), correctAnswer: 'A',
    hint: 'Piensa en los días de la semana.',
    explanation: 'Son las iniciales de lunes, martes, miércoles, jueves, viernes y sábado. Sigue domingo: D.',
  },
  {
    code: 'Q15', number: 15, type: 'math_logic', answerFormat: 'numeric', difficulty: 1,
    statement: 'La suma de las edades de Rita y su hermano es 30. Rita tiene 6 años más que su hermano. ¿Cuántos años tiene Rita?',
    options: [], correctAnswer: '18',
    hint: 'Si le quitas esos 6 años a Rita, ambos tendrían la misma edad.',
    explanation: 'Sin los 6 años de diferencia quedan 24, repartidos en partes iguales: el hermano tiene 12 y Rita 18.',
  },
]);

module.exports = { QUESTION_BANK };
