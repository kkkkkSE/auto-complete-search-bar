/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef } from 'react';

const useDebounce = <T extends any[]>({
  delay,
  callback,
}: {
  delay: number;
  callback: (...args: T) => unknown;
}) => {
  const debounceRef = useRef<NodeJS.Timeout>();

  const debounceCallback = (...args: T) => {
    clearInterval(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      callback(...args);
    }, delay);
  };

  return debounceCallback;
};

export default useDebounce;
