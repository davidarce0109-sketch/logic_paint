const { LIMITS } = require('../constants');

class Player {
  constructor({ id, name }) {
    this.id = id;
    this.name = Player.sanitizeName(name);
  }

  static sanitizeName(name) {
    const clean = String(name ?? '')
      .replace(/[<>\u0000-\u001f]/g, '')
      .trim()
      .slice(0, LIMITS.MAX_PLAYER_NAME_LENGTH);
    return clean || LIMITS.DEFAULT_PLAYER_NAME;
  }
}

module.exports = Player;
