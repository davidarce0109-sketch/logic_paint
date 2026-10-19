import { apiRequest } from '../config/api.js';

const game = (id) => `/games/${id}`;
const question = (id, questionId) => `/games/${id}/questions/${questionId}`;

export const gameApi = {
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
