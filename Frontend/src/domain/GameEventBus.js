/** Observer del lado del cliente: los eventos que devuelve la API se difunden a quien esté suscrito. */
class GameEventBus {
  constructor() {
    this.listeners = new Map();
  }

  subscribe(type, listener) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type).add(listener);
    return () => this.listeners.get(type)?.delete(listener);
  }

  publish(event) {
    this.listeners.get(event.type)?.forEach((listener) => listener(event));
  }
}

export const gameEventBus = new GameEventBus();
