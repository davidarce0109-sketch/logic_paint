export default class QuestionStrategy {
  parse() {
    throw new Error('QuestionStrategy.parse() debe implementarse');
  }

  matches() {
    throw new Error('QuestionStrategy.matches() debe implementarse');
  }
}
