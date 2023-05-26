
import { useEffect, useRef } from 'react';

function useThrottleFn(fn: Function, delay: number) {
  const lastFn = useRef<Function>();
  const lastRan = useRef<number>(0);

  useEffect(() => {
    lastFn.current = fn;
  }, [fn]);

  return  (...args: any[]) => {
    const now = Date.now();
    if (now - lastRan.current >= delay) {
      lastRan.current = now;
      lastFn.current?.apply(this, args);
    }
  };
}

export default useThrottleFn;


