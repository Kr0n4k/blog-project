import { useState, useCallback, useRef, useEffect } from 'react';

interface UseAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (...args: any[]) => Promise<T>;
  reset: () => void;
}

export function useAsync<T>(
  asyncFunction: (...args: any[]) => Promise<T>,
  immediate: boolean = false
): UseAsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(immediate);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const execute = useCallback(async (...args: any[]): Promise<T> => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await asyncFunction(...args);
      
      if (isMountedRef.current) {
        setData(result);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка';
      
      if (isMountedRef.current) {
        setError(errorMessage);
      }
      
      throw err;
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [asyncFunction]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}
