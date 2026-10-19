import { createContext, useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import { gameApi } from '../services/gameApi.js';
import { gameEventBus } from '../domain/GameEventBus.js';
import { firstOpenId, nextOpenId } from '../domain/questionNavigation.js';
import { API_ERROR_CODES, GAME_STATUS, STORAGE_KEY } from '../config/constants.js';

export const GameContext = createContext(null);

const initialState = {
  game: null,
  questions: [],
  selectedId: null,
  feedback: null,
  result: null,
  busy: false,
  booting: true,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'BUSY':
      return { ...state, busy: true, error: null };
    case 'ERROR':
      return { ...state, busy: false, booting: false, error: action.error };
    case 'SYNC': {
      const questions = action.questions ?? state.questions;
      const stillThere = questions.some((q) => q.id === (action.selectedId ?? state.selectedId));
      const selectedId = stillThere ? (action.selectedId ?? state.selectedId) : firstOpenId(questions);
      return {
        ...state,
        busy: false,
        booting: false,
        error: null,
        game: action.game,
        questions,
        selectedId,
        feedback: action.feedback === undefined ? state.feedback : action.feedback,
      };
    }
    case 'SELECT':
      return { ...state, selectedId: action.id, feedback: null };
    case 'RESULT':
      return { ...state, busy: false, result: action.result };
    case 'RESET':
      return { ...initialState, booting: false };
    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const stateRef = useRef(state);
  stateRef.current = state;

  const publish = useCallback((events = []) => events.forEach((event) => gameEventBus.publish(event)), []);

  const applyResponse = useCallback((data, extra = {}) => {
    publish(data.events);
    dispatch({ type: 'SYNC', game: data.game, questions: data.questions, ...extra });
  }, [publish]);

  const run = useCallback(async (operation) => {
    dispatch({ type: 'BUSY' });
    try {
      return await operation();
    } catch (error) {
      if ([API_ERROR_CODES.GAME_TIME_EXPIRED, API_ERROR_CODES.GAME_FINISHED].includes(error.code)) {
        const id = stateRef.current.game?.id;
        if (id) {
          const data = await gameApi.get(id);
          applyResponse(data);
          return null;
        }
      }
      dispatch({ type: 'ERROR', error: error.message });
      return null;
    }
  }, [applyResponse]);

  const loadGame = useCallback((id) => run(async () => {
    const data = await gameApi.get(id);
    const withQuestions = data.questions ? data : { ...data, ...(await gameApi.questions(id).catch(() => ({}))) };
    applyResponse(withQuestions);
    return withQuestions.game;
  }), [run, applyResponse]);

  const createAndStart = useCallback((playerName) => run(async () => {
    const created = await gameApi.create(playerName);
    const started = await gameApi.start(created.game.id);
    sessionStorage.setItem(STORAGE_KEY, created.game.id);
    dispatch({ type: 'RESET' });
    applyResponse(started, { feedback: null });
    return started.game;
  }), [run, applyResponse]);

  const selectQuestion = useCallback((id) => dispatch({ type: 'SELECT', id }), []);

  const submitAnswer = useCallback((answer) => run(async () => {
    const { game, selectedId } = stateRef.current;
    const data = await gameApi.answer(game.id, selectedId, answer);
    applyResponse(data, { feedback: { questionId: selectedId, ...data.feedback } });
    return data;
  }), [run, applyResponse]);

  const skipQuestion = useCallback(() => run(async () => {
    const { game, selectedId } = stateRef.current;
    const data = await gameApi.skip(game.id, selectedId);
    applyResponse(data, { feedback: null, selectedId: nextOpenId(data.questions, selectedId) ?? selectedId });
    return data;
  }), [run, applyResponse]);

  const requestHint = useCallback(() => run(async () => {
    const { game, selectedId } = stateRef.current;
    const data = await gameApi.hint(game.id, selectedId);
    applyResponse(data);
    return data;
  }), [run, applyResponse]);

  const goToNextQuestion = useCallback(() => {
    const { questions, selectedId } = stateRef.current;
    const next = nextOpenId(questions, selectedId);
    if (next) dispatch({ type: 'SELECT', id: next });
  }, []);

  const togglePause = useCallback(() => run(async () => {
    const { game } = stateRef.current;
    const data = game.status === GAME_STATUS.PAUSED ? await gameApi.resume(game.id) : await gameApi.pause(game.id);
    const withQuestions = data.questions ? data : { ...data, ...(await gameApi.questions(game.id).catch(() => ({}))) };
    applyResponse(withQuestions);
    return data;
  }), [run, applyResponse]);

  const refresh = useCallback(async () => {
    const id = stateRef.current.game?.id;
    if (!id) return null;
    try {
      const data = await gameApi.get(id);
      applyResponse(data);
      return data.game;
    } catch (error) {
      dispatch({ type: 'ERROR', error: error.message });
      return null;
    }
  }, [applyResponse]);

  const loadResult = useCallback(() => run(async () => {
    const data = await gameApi.result(stateRef.current.game.id);
    dispatch({ type: 'RESULT', result: data.result });
    return data.result;
  }), [run]);

  const reset = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    dispatch({ type: 'RESET' });
  }, []);

  useEffect(() => {
    const storedId = sessionStorage.getItem(STORAGE_KEY);
    if (!storedId) {
      dispatch({ type: 'RESET' });
      return;
    }
    loadGame(storedId).then((game) => {
      if (game) return;
      sessionStorage.removeItem(STORAGE_KEY);
      dispatch({ type: 'RESET' });
    });
  }, [loadGame]);

  const value = useMemo(() => ({
    ...state,
    actions: { createAndStart, selectQuestion, submitAnswer, skipQuestion, requestHint, goToNextQuestion, togglePause, refresh, loadResult, reset },
  }), [state, createAndStart, selectQuestion, submitAnswer, skipQuestion, requestHint, goToNextQuestion, togglePause, refresh, loadResult, reset]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
