import { useEffect, useRef, useState } from 'react';
import { TIMER_TICK_MS } from '../config/constants.js';

/**
 * Cuenta regresiva visual. La fuente de verdad es el servidor: cada respuesta de la API
 * reancla el reloj (syncKey) y al llegar a cero se pide al servidor que confirme el estado.
 */
export function useTimer({ remainingMs, running, syncKey, onExpire }) {
  const [display, setDisplay] = useState(remainingMs ?? 0);
  const anchor = useRef({ at: Date.now(), value: remainingMs ?? 0 });
  const expired = useRef(false);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    anchor.current = { at: Date.now(), value: remainingMs ?? 0 };
    expired.current = false;
    setDisplay(remainingMs ?? 0);
  }, [remainingMs, syncKey]);

  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => {
      const left = Math.max(0, anchor.current.value - (Date.now() - anchor.current.at));
      setDisplay(left);
      if (left === 0 && !expired.current) {
        expired.current = true;
        onExpireRef.current?.();
      }
    }, TIMER_TICK_MS);
    return () => clearInterval(id);
  }, [running]);

  return display;
}
