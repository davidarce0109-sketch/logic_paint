/**
 * Banco de preguntas (datos puros, separado de la lógica del juego).
 * - Cada `number` corresponde a una pieza de la imagen; puede tener varias variantes y
 *   el juego elige una al azar por partida (así el banco crece sin tocar código).
 * - `correctAnswer` solo vive en el servidor: nunca viaja al navegador durante la partida.
 */
const opts = (...texts) => texts.map((text, index) => ({ id: String.fromCharCode(65 + index), text }));

const QUESTION_BANK = Object.freeze([
  {
    code: 'Q01', number: 1, type: 'sequence', answerFormat: 'numeric', difficulty: 4,
    statement: 'Observa la sucesión: 3, 7, 16, 35, 74, … ¿Cuál es el siguiente término?',
    options: [], correctAnswer: '153',
    hint: 'Compara cada término con el doble del anterior.',
    explanation: 'Cada término es el doble del anterior más una cantidad que crece de 1 en 1: 2·3+1=7, 2·7+2=16, 2·16+3=35, 2·35+4=74, y por tanto el siguiente es 2·74+5=153.',
  },
  {
    code: 'Q01B', number: 1, type: 'sequence', answerFormat: 'numeric', difficulty: 4,
    statement: 'Observa la sucesión: 5, 6, 8, 12, 20, 36, … ¿Cuál es el siguiente término?',
    options: [], correctAnswer: '68',
    hint: 'Mira cómo cambian las diferencias entre términos consecutivos.',
    explanation: 'Las diferencias son 1, 2, 4, 8, 16: se duplican cada vez. La siguiente es 32, así que 36 + 32 = 68.',
  },
  {
    code: 'Q02', number: 2, type: 'deduction', answerFormat: 'multiple_choice', difficulty: 3,
    statement: 'Cuatro amigas (Ana, Bea, Cora y Dina) terminaron una carrera sin empates. Ana llegó antes que Bea. Cora llegó después de Dina. Bea no llegó en último lugar. Dina llegó antes que Ana. ¿Quién llegó en tercer lugar?',
    options: opts('Ana', 'Bea', 'Cora', 'Dina'), correctAnswer: 'B',
    hint: 'Ordena primero a las tres que tienen relación directa entre sí.',
    explanation: 'Dina llegó antes que Ana y Ana antes que Bea. Cora llegó después de Dina y Bea no fue última, así que Cora fue la última: Dina, Ana, Bea, Cora. La tercera es Bea.',
  },
  {
    code: 'Q03', number: 3, type: 'logic', answerFormat: 'multiple_choice', difficulty: 4,
    statement: 'En una isla los veraces siempre dicen la verdad y los mentirosos siempre mienten. Tres habitantes afirman: A: «B es mentiroso». B: «A y C son del mismo tipo». C: «A es mentiroso». ¿Cuántos mentirosos hay entre los tres?',
    options: opts('0', '1', '2', '3'), correctAnswer: 'C',
    hint: 'Supón que A dice la verdad y revisa si todo encaja; luego supón que miente.',
    explanation: 'Si A fuera mentiroso, B sería veraz y C sería mentiroso; pero entonces C diría algo cierto («A es mentiroso»), lo que es imposible. Por tanto A es veraz, B y C son mentirosos: hay 2.',
  },
  {
    code: 'Q03B', number: 3, type: 'logic', answerFormat: 'multiple_choice', difficulty: 4,
    statement: 'Tres hermanos dicen: A: «Entre nosotros hay exactamente un mentiroso». B: «Entre nosotros hay exactamente dos mentirosos». C: «Los tres somos mentirosos». ¿Quién dice la verdad?',
    options: opts('Solo A', 'Solo B', 'Solo C', 'Ninguno'), correctAnswer: 'B',
    hint: 'Empieza por la afirmación de C: ¿puede ser cierta?',
    explanation: 'C no puede decir la verdad (sería a la vez mentiroso). Si A fuera veraz habría un único mentiroso (C), B también sería veraz y su afirmación sería falsa: contradicción. Luego A y C mienten, y B dice la verdad: hay exactamente dos mentirosos.',
  },
  {
    code: 'Q04', number: 4, type: 'math_logic', answerFormat: 'numeric', difficulty: 4,
    statement: '¿Cuántos números enteros positivos de tres cifras son divisibles entre 7 pero no entre 5?',
    options: [], correctAnswer: '102',
    hint: 'Cuenta los múltiplos de 7 de tres cifras y descuenta los múltiplos de 35.',
    explanation: 'Los múltiplos de 7 de tres cifras van de 105 a 994: son 128. Los que además son múltiplos de 5 son múltiplos de 35 (de 105 a 980): 26. Entonces 128 − 26 = 102.',
  },
  {
    code: 'Q04B', number: 4, type: 'math_logic', answerFormat: 'numeric', difficulty: 5,
    statement: '¿Cuántos números pares de cuatro cifras tienen todas sus cifras distintas?',
    options: [], correctAnswer: '2296',
    hint: 'Separa el caso en que terminan en 0 del caso en que terminan en 2, 4, 6 u 8.',
    explanation: 'Terminan en 0: 9·8·7 = 504. Terminan en 2, 4, 6 u 8 (4 opciones): la primera cifra no puede ser 0 ni repetir la última (8 opciones), y luego quedan 8 y 7 opciones: 4·8·8·7 = 1792. Total: 504 + 1792 = 2296.',
  },
  {
    code: 'Q05', number: 5, type: 'pattern', answerFormat: 'numeric', difficulty: 4,
    statement: 'Cada pareja (a, b) produce un resultado con la misma regla: (3, 4) → 25; (5, 12) → 169; (8, 15) → 289; (7, 24) → ?',
    options: [], correctAnswer: '625',
    hint: 'Prueba con operaciones sobre cada número por separado antes de combinarlos.',
    explanation: 'La regla es a² + b²: 9+16=25, 25+144=169, 64+225=289, y 49+576=625.',
  },
  {
    code: 'Q06', number: 6, type: 'deduction', answerFormat: 'multiple_choice', difficulty: 4,
    statement: 'Tres cajas están rotuladas «Manzanas», «Naranjas» y «Mezcla», y se sabe que TODOS los rótulos están mal puestos. Sacas una fruta de la caja rotulada «Mezcla» y es una manzana. ¿Qué contiene la caja rotulada «Naranjas»?',
    options: opts('Solo manzanas', 'Solo naranjas', 'Manzanas y naranjas mezcladas', 'No se puede determinar'), correctAnswer: 'C',
    hint: 'Si el rótulo está mal, ¿qué no puede contener la caja «Mezcla»?',
    explanation: 'La caja «Mezcla» no puede ser mezcla, así que tiene solo manzanas. La caja «Naranjas» tampoco puede tener solo naranjas y las manzanas ya están en otra caja: contiene la mezcla (y la caja «Manzanas» tiene solo naranjas).',
  },
  {
    code: 'Q07', number: 7, type: 'math_logic', answerFormat: 'multiple_choice', difficulty: 3,
    statement: 'Un tren va de la ciudad A a la ciudad B a 60 km/h y regresa por la misma vía a 40 km/h, sin detenerse. ¿Cuál es su velocidad media en todo el viaje de ida y vuelta?',
    options: opts('50 km/h', '48 km/h', '52 km/h', '45 km/h'), correctAnswer: 'B',
    hint: 'La velocidad media es distancia total entre tiempo total, no el promedio de las velocidades.',
    explanation: 'Con distancia d en cada tramo, el tiempo total es d/60 + d/40 = d/24. La velocidad media es 2d ÷ (d/24) = 48 km/h.',
  },
  {
    code: 'Q07B', number: 7, type: 'math_logic', answerFormat: 'multiple_choice', difficulty: 4,
    statement: 'Dos velas de la misma longitud se encienden al mismo tiempo. Una se consumiría por completo en 4 horas y la otra en 3 horas. ¿Cuánto tiempo después de encenderlas la longitud restante de una será exactamente el doble que la de la otra?',
    options: opts('2 h', '2 h 24 min', '2 h 30 min', '2 h 40 min'), correctAnswer: 'B',
    hint: 'Expresa la fracción que queda de cada vela en función del tiempo t.',
    explanation: 'Tras t horas quedan 1 − t/4 y 1 − t/3. Imponiendo 1 − t/4 = 2(1 − t/3) se obtiene t = 12/5 h = 2 h 24 min.',
  },
  {
    code: 'Q08', number: 8, type: 'math_logic', answerFormat: 'numeric', difficulty: 4,
    statement: 'En un instituto con 115 estudiantes, todos estudian al menos un idioma: 70 estudian inglés, 60 francés y 50 alemán. Además, 30 estudian inglés y francés, 25 inglés y alemán, y 20 francés y alemán (en cada caso se incluye a quienes estudian los tres idiomas). ¿Cuántos estudiantes estudian los tres idiomas?',
    options: [], correctAnswer: '10',
    hint: 'Usa el principio de inclusión-exclusión para tres conjuntos.',
    explanation: 'Por inclusión-exclusión: 115 = 70 + 60 + 50 − 30 − 25 − 20 + x, es decir 115 = 105 + x, así que x = 10.',
  },
  {
    code: 'Q09', number: 9, type: 'logic', answerFormat: 'logical_expression', difficulty: 3,
    statement: 'Sean p: «Llueve» y q: «Hay clase». Se sabe que la proposición p → q es FALSA. Determina el valor de verdad de: I) p ∧ ¬q, II) ¬p ∨ q, III) q → p. Escribe las tres letras en orden usando V o F (por ejemplo: FFF).',
    options: [], correctAnswer: 'VFV',
    hint: '¿En qué único caso un condicional es falso?',
    explanation: 'Un condicional solo es falso cuando p es verdadera y q es falsa. Entonces I) V ∧ V = V; II) F ∨ F = F; III) F → V = V.',
  },
  {
    code: 'Q10', number: 10, type: 'sequence', answerFormat: 'numeric', difficulty: 4,
    statement: 'Observa: 1, 4, 10, 20, 35, … ¿Cuál es el siguiente número?',
    options: [], correctAnswer: '56',
    hint: 'Calcula las diferencias y luego las diferencias de las diferencias.',
    explanation: 'Las diferencias son 3, 6, 10, 15 (números triangulares); la siguiente es 21, así que 35 + 21 = 56.',
  },
  {
    code: 'Q11', number: 11, type: 'deduction', answerFormat: 'multiple_choice', difficulty: 4,
    statement: 'Hay cuatro sospechosos y exactamente uno es culpable. Declaraciones — A: «Fue B». B: «Fue D». C: «Yo no fui». D: «B está mintiendo». Si exactamente tres de las cuatro declaraciones son verdaderas, ¿quién es el culpable?',
    options: opts('El sospechoso A', 'El sospechoso B', 'El sospechoso C', 'El sospechoso D'), correctAnswer: 'B',
    hint: 'Dos de las declaraciones se contradicen directamente entre sí.',
    explanation: 'Las declaraciones de B y D se contradicen, así que exactamente una de ellas es verdadera. Para llegar a tres verdaderas, las de A y C deben serlo: el culpable es B (C dice la verdad, B miente y D dice la verdad).',
  },
  {
    code: 'Q12', number: 12, type: 'logic', answerFormat: 'multiple_choice', difficulty: 5,
    statement: 'Cuatro personas deben cruzar un puente de noche con una sola linterna. Solo pueden pasar dos a la vez y siempre con la linterna, a la velocidad de la más lenta. Tardan 1, 2, 5 y 10 minutos respectivamente. ¿Cuál es el tiempo mínimo para que crucen las cuatro?',
    options: opts('19 minutos', '17 minutos', '18 minutos', '20 minutos'), correctAnswer: 'B',
    hint: 'Los dos más lentos deberían cruzar juntos.',
    explanation: 'Cruzan 1 y 2 (2 min); vuelve el 1 (1 min); cruzan 5 y 10 (10 min); vuelve el 2 (2 min); cruzan 1 y 2 (2 min). Total: 2 + 1 + 10 + 2 + 2 = 17 minutos.',
  },
  {
    code: 'Q12B', number: 12, type: 'logic', answerFormat: 'multiple_choice', difficulty: 5,
    statement: 'Tienes 12 monedas de aspecto idéntico: 11 pesan lo mismo y una pesa distinto (no sabes si más o menos). Con una balanza de dos platillos y sin pesas, ¿cuál es el número mínimo de pesadas que garantiza identificar la moneda distinta y saber si es más ligera o más pesada?',
    options: opts('2', '3', '4', '5'), correctAnswer: 'B',
    hint: 'Cuenta cuántos casos distintos existen y cuántos resultados da cada pesada.',
    explanation: 'Hay 24 posibilidades (12 monedas × 2 casos). Cada pesada tiene 3 resultados: con 2 pesadas solo se distinguen 9 casos; con 3 hay 27 ≥ 24 y existe una estrategia que lo logra.',
  },
  {
    code: 'Q13', number: 13, type: 'math_logic', answerFormat: 'numeric', difficulty: 3,
    statement: '¿Cuál es la cifra de las unidades de 7²⁰²⁶?',
    options: [], correctAnswer: '9',
    hint: 'Las cifras de las unidades de las potencias de 7 se repiten en un ciclo.',
    explanation: 'Las unidades de 7, 7², 7³, 7⁴ son 7, 9, 3, 1 y se repiten cada 4. Como 2026 = 4·506 + 2, la cifra es la segunda del ciclo: 9.',
  },
  {
    code: 'Q13B', number: 13, type: 'math_logic', answerFormat: 'numeric', difficulty: 4,
    statement: '¿Cuál es el residuo de dividir 3¹⁰⁰ entre 7?',
    options: [], correctAnswer: '4',
    hint: 'Busca el ciclo de los residuos de las potencias de 3 al dividir entre 7.',
    explanation: 'Los residuos de 3, 3², 3³… entre 7 son 3, 2, 6, 4, 5, 1 y se repiten cada 6. Como 100 = 6·16 + 4, el residuo es el cuarto del ciclo: 4.',
  },
  {
    code: 'Q14', number: 14, type: 'pattern', answerFormat: 'multiple_choice', difficulty: 4,
    statement: 'Las letras U, D, T, C, C, S, S, O siguen una regla. ¿Cuál es la letra que sigue?',
    options: opts('M', 'N', 'D', 'T'), correctAnswer: 'B',
    hint: 'Piensa en cosas que se cuentan en orden.',
    explanation: 'Son las iniciales de los números en español: Uno, Dos, Tres, Cuatro, Cinco, Seis, Siete, Ocho… y sigue Nueve: N.',
  },
  {
    code: 'Q15', number: 15, type: 'math_logic', answerFormat: 'numeric', difficulty: 4,
    statement: 'Hace 5 años, la suma de las edades de Rita y su madre era 52. Dentro de 5 años, la madre tendrá el triple de la edad de Rita. ¿Cuántos años tiene Rita hoy?',
    options: [], correctAnswer: '13',
    hint: 'Plantea dos ecuaciones con las edades actuales de ambas.',
    explanation: 'Sean r y m las edades actuales: r + m = 52 + 10 = 62 y m + 5 = 3(r + 5). Entonces m = 3r + 10 y 4r + 10 = 62, de modo que r = 13 (y la madre tiene 49).',
  },
]);

module.exports = { QUESTION_BANK };
