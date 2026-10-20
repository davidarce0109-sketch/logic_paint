import { apiRequest } from '../config/api.js';
import { clientGameService } from '../domain/engine/clientGameService.js';

const isGitHubPages = typeof window !== 'undefined' && window.location.hostname.endsWith('github.io');
const isStandaloneForced = import.meta.env.VITE_STANDALONE === 'true';
const isExternalApi = import.meta.env.VITE_API_URL && /^https?:\/\//i.test(import.meta.env.VITE_API_URL);

// Use client mode if explicitly requested, if running on GitHub Pages (unless external API specified),
// or if no API URL is configured.
const defaultToClient = isStandaloneForced || (isGitHubPages && !isExternalApi);

let useClientEngine = defaultToClient;

const isClientStoredGame = (id) => typeof sessionStorage !== 'undefined' && Boolean(sessionStorage.getItem(`lp:game:${id}`));
const shouldUseClient = (id) => useClientEngine || (id ? isClientStoredGame(id) : false);

const game = (id) => `/games/${id}`;
const question = (id, questionId) => `/games/${id}/questions/${questionId}`;

const httpApi = {
  create: (playerName) => apiRequest('/games', { method: 'POST', body: { playerName } }),
  get: (id) => apiRequest(game(id)),
  start: (id) => apiRequest(`${game(id)}/start`, { method: 'POST' }),
  pause: (id) => apiRequest(`${game(id)}/pause`, { method: 'POST' }),
  resume: (id) => apiRequest(`${game(id)}/resume`, { method: 'POST' }),
  questions: (id) => apiRequest(`${game(id)}/questions`),
  answer: (id, questionId, answer) => apiRequest(`${question(id, questionId)}/answer`, { method: 'POST', body: { answer } }),
  skip: (id, questionId) => apiRequest(`${question(id, questionId)}/skip`, { method: 'POST' }),
  hint: (id, questionId) => apiRequest(`${question(id, questionId)}/hint`, { method: 'POST' }),
  result: (id) => apiRequest(`${game(id)}/result`),
};

const clientApi = {
  create: (playerName) => clientGameService.createGame({ playerName }),
  get: (id) => clientGameService.getGame(id),
  start: (id) => clientGameService.start(id),
  pause: (id) => clientGameService.pause(id),
  resume: (id) => clientGameService.resume(id),
  questions: (id) => clientGameService.getQuestions(id),
  answer: (id, questionId, answer) => clientGameService.answer(id, questionId, answer),
  skip: (id, questionId) => clientGameService.skip(id, questionId),
  hint: (id, questionId) => clientGameService.hint(id, questionId),
  result: (id) => clientGameService.result(id),
};

export const gameApi = {
  create: async (playerName) => {
    if (useClientEngine) {
      return clientApi.create(playerName);
    }
    try {
      return await httpApi.create(playerName);
    } catch (error) {
      // Fallback: If backend is not available (e.g. running statically), switch seamlessly to client engine
      if (error.code === 'NETWORK_ERROR' || error.status === 404) {
        console.warn('Backend no detectado o no disponible. Cambiando automáticamente a modo cliente autónomo.');
        useClientEngine = true;
        return clientApi.create(playerName);
      }
      throw error;
    }
  },
  get: (id) => (shouldUseClient(id) ? clientApi.get(id) : httpApi.get(id)),
  start: (id) => (shouldUseClient(id) ? clientApi.start(id) : httpApi.start(id)),
  pause: (id) => (shouldUseClient(id) ? clientApi.pause(id) : httpApi.pause(id)),
  resume: (id) => (shouldUseClient(id) ? clientApi.resume(id) : httpApi.resume(id)),
  questions: (id) => (shouldUseClient(id) ? clientApi.questions(id) : httpApi.questions(id)),
  answer: (id, questionId, answer) => (shouldUseClient(id) ? clientApi.answer(id, questionId, answer) : httpApi.answer(id, questionId, answer)),
  skip: (id, questionId) => (shouldUseClient(id) ? clientApi.skip(id, questionId) : httpApi.skip(id, questionId)),
  hint: (id, questionId) => (shouldUseClient(id) ? clientApi.hint(id, questionId) : httpApi.hint(id, questionId)),
  result: (id) => (shouldUseClient(id) ? clientApi.result(id) : httpApi.result(id)),
};
