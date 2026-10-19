import { useEffect, useRef } from 'react';
import { gameEventBus } from '../domain/GameEventBus.js';

/** Suscribe un manejador a uno o varios tipos de evento del juego mientras el componente esté montado. */
export function useGameEvents(types, handler) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;
  const key = [].concat(types).join('|');

  useEffect(() => {
    const unsubscribers = key.split('|').map((type) => gameEventBus.subscribe(type, (event) => handlerRef.current(event)));
    return () => unsubscribers.forEach((off) => off());
  }, [key]);
}
