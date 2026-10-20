const WILDCARD = '*';

export default class GameEventSubject {
  constructor(clock = Date.now) {
    this.clock = clock;
    this.observers = new Map();
  }

  subscribe(types, observer) {
    [].concat(types).forEach((type) => {
      if (!this.observers.has(type)) this.observers.set(type, new Set());
      this.observers.get(type).add(observer);
    });
    return () => this.unsubscribe(types, observer);
  }

  unsubscribe(types, observer) {
    [].concat(types).forEach((type) => this.observers.get(type)?.delete(observer));
  }

  emit(type, payload = {}) {
    const event = Object.freeze({ type, payload, at: this.clock() });
    const targets = [...(this.observers.get(type) || []), ...(this.observers.get(WILDCARD) || [])];
    targets.forEach((observer) => {
      try {
        observer.update(event);
      } catch (error) {
        console.error(`Observer fallido en ${type}:`, error.message);
      }
    });
    return event;
  }
}

GameEventSubject.WILDCARD = WILDCARD;
