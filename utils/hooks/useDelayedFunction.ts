import { useEffect, useRef } from 'react';

const useDelayedFunction = (delay: number) => {
  const timeoutRef = useRef<any>(null);

  const delayedFunction = (callback: () => void) => {
    // Clear the previous timeout (if any)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set a new timeout with the updated callback and delay
    timeoutRef.current = setTimeout(() => {
      callback();
    }, delay);
  };

  // Cleanup the timeout when the component unmounts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {delayedFunction};
}

export default useDelayedFunction