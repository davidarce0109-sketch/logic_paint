// Strategy Pattern
class QuestionValidationStrategy {
    validate(userAnswer, correctAnswer) {
        throw new Error("Method must be implemented");
    }
}

class MultipleChoiceStrategy extends QuestionValidationStrategy {
    validate(userAnswer, correctAnswer) {
        return String(userAnswer).trim().toLowerCase() === String(correctAnswer).trim().toLowerCase();
    }
}

class NumericAnswerStrategy extends QuestionValidationStrategy {
    validate(userAnswer, correctAnswer) {
        return Number(userAnswer) === Number(correctAnswer);
    }
}

// Factory Method Pattern
class QuestionFactory {
    static createQuestion(data) {
        const strategy = data.type === 'numeric' ? new NumericAnswerStrategy() : new MultipleChoiceStrategy();
        return new Question(data, strategy);
    }
}

class Question {
    constructor(data, validationStrategy) {
        this.id = data.id;
        this.number = data.question_number;
        this.type = data.type;
        this.statement = data.statement;
        this.options = data.options;
        this.correctAnswer = data.correct_answer;
        this.explanation = data.explanation;
        this.difficulty = data.difficulty;
        this.piece = {
            shape: data.shape,
            color: data.color,
            position: { x: data.pos_x, y: data.pos_y }
        };
        this.validationStrategy = validationStrategy;
    }

    checkAnswer(answer) {
        return this.validationStrategy.validate(answer, this.correctAnswer);
    }
}

// Decorator Pattern
class TimedQuestionDecorator {
    constructor(question, timeLimitSeconds = 60) {
        this.question = question;
        this.timeLimitSeconds = timeLimitSeconds;
    }
    getDetails() {
        return { ...this.question, timeLimitSeconds: this.timeLimitSeconds };
    }
}

// Observer Pattern
class GameEventSubject {
    constructor() {
        this.observers = [];
    }
    subscribe(observer) {
        this.observers.push(observer);
    }
    notify(event, data) {
        this.observers.forEach(obs => obs.update(event, data));
    }
}

class ScoreObserver {
    update(event, data) {
        if (event === 'QuestionAnswered' && data.correct) {
            console.log(`[ScoreObserver] Puntuación actualizada para juego ${data.gameId}`);
        }
    }
}

module.exports = {
    QuestionFactory,
    TimedQuestionDecorator,
    GameEventSubject,
    ScoreObserver
};