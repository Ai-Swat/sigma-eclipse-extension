// https://github.com/reactjs/rfcs/blob/useevent/text/0000-useevent.md#when-useevent-should-not-be-used

import { useCallback, useEffect, useRef } from 'react';

// type Fn = (...args: unknown[]) => any
// type ReturnUseEvent<T extends Fn> = (...args: Parameters<T>) => ReturnType<T>

type AnyFunction = (...args: never[]) => unknown;

export function useEvent<T extends AnyFunction>(callback: T): T {
  const handlerRef = useRef(callback);

  // In a real implementation, this would run before layout effects
  useEffect(() => {
    handlerRef.current = callback;
  });

  const action = useCallback((...args: Parameters<T>) => {
    // In a real implementation, this would throw if called during render.
    const fn = handlerRef.current;
    return fn(...args);
  }, []);

  return action as T;
}
