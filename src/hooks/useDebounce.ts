import { useEffect, useRef } from 'react';

const useDebounce = ({
  delay, callback, trigger,
}:{
  delay: number;
  trigger: unknown;
  callback: (...args: never[]) => unknown;
}) => {
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    debounceRef.current = setTimeout(async () => {
      callback();
    }, delay);

    return () => {
      if (debounceRef.current) {
        clearInterval(debounceRef.current);

        debounceRef.current = null;
      }
    };
  }, [trigger]);
};

export default useDebounce;
