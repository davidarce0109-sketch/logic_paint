import { LIMITS } from '../constants.js';

export default class Player {
  constructor({ id, name }) {
    this.id = id;
    this.name = Player.sanitizeName(name);
  }

  static sanitizeName(raw) {
    const trimmed = String(raw ?? '').trim();
    return trimmed === '' ? LIMITS.DEFAULT_PLAYER_NAME : trimmed.slice(0, LIMITS.MAX_PLAYER_NAME_LENGTH);
  }
}
