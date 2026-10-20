import GameEventSubject from './GameEventSubject.js';

const PRIVATE_KEYS = ['answer'];

export default class EventCollectorObserver {
  static EVENTS = [GameEventSubject.WILDCARD];

  constructor() {
    this.events = [];
  }

  update(event) {
    const payload = Object.fromEntries(Object.entries(event.payload).filter(([key]) => !PRIVATE_KEYS.includes(key)));
    this.events.push({ type: event.type, payload, at: event.at });
  }

  drain() {
    const drained = this.events;
    this.events = [];
    return drained;
  }
}
