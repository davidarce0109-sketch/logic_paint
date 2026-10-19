import { useState } from 'react';
import { ANSWER_FORMAT } from '../config/constants.js';

const FORMAT_HELP = {
  [ANSWER_FORMAT.NUMERIC]: 'Escribe un número.',
  [ANSWER_FORMAT.LOGICAL_EXPRESSION]: 'Escribe solo las letras V o F, en orden.',
};

/** Formulario según el formato de la pregunta. Se remonta (key) al cambiar de pregunta. */
export default function AnswerForm({ question, disabled, onSubmit, onSkip }) {
  const [value, setValue] = useState('');
  const isChoice = question.answerFormat === ANSWER_FORMAT.MULTIPLE_CHOICE;

  const submit = (event) => {
    event.preventDefault();
    if (value.trim() !== '') onSubmit(value.trim());
  };

  return (
    <form className="answer-form" onSubmit={submit}>
      {isChoice ? (
        <fieldset className="options" disabled={disabled}>
          <legend className="visually-hidden">Opciones de respuesta</legend>
          {question.options.map((option) => (
            <label key={option.id} className={`option${value === option.id ? ' option--picked' : ''}`}>
              <input type="radio" name={`q-${question.id}`} value={option.id} checked={value === option.id} onChange={() => setValue(option.id)} />
              <span className="option__id">{option.id}</span>
              <span className="option__text">{option.text}</span>
            </label>
          ))}
        </fieldset>
      ) : (
        <div className="field">
          <label htmlFor="answer-input" className="field__label">Tu respuesta</label>
          <input
            id="answer-input"
            className="field__input"
            type="text"
            inputMode={question.answerFormat === ANSWER_FORMAT.NUMERIC ? 'decimal' : 'text'}
            autoComplete="off"
            autoCapitalize="characters"
            maxLength={64}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            disabled={disabled}
          />
          <p className="field__help">{FORMAT_HELP[question.answerFormat]}</p>
        </div>
      )}
      <div className="answer-form__actions">
        <button type="submit" className="btn btn--primary" disabled={disabled || value.trim() === ''}>Responder</button>
        <button type="button" className="btn btn--ghost" onClick={onSkip} disabled={disabled}>Pasar</button>
      </div>
    </form>
  );
}
