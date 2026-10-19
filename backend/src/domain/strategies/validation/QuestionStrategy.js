/**
 * Contrato de Strategy para validar respuestas. Interfaz mínima (ISP):
 * parse() interpreta la entrada cruda y matches() la compara con la respuesta correcta.
 */
class QuestionStrategy {
  parse() {
    throw new Error('QuestionStrategy.parse() debe implementarse');
  }

  matches() {
    throw new Error('QuestionStrategy.matches() debe implementarse');
  }
}

module.exports = QuestionStrategy;
