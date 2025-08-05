import { useState, useCallback } from 'react';

export interface ErrorState {
  message: string;
  code?: string;
  timestamp: number;
}

export interface UseErrorHandlerReturn {
  error: ErrorState | null;
  setError: (message: string, code?: string) => void;
  clearError: () => void;
  handleAsyncError: <T>(promise: Promise<T>) => Promise<T>;
}

export const useErrorHandler = (): UseErrorHandlerReturn => {
  const [error, setErrorState] = useState<ErrorState | null>(null);

  const setError = useCallback((message: string, code?: string) => {
    setErrorState({
      message,
      code,
      timestamp: Date.now(),
    });
  }, []);

  const clearError = useCallback(() => {
    setErrorState(null);
  }, []);

  const handleAsyncError = useCallback(async <T>(promise: Promise<T>): Promise<T> => {
    try {
      return await promise;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      throw err;
    }
  }, [setError]);

  return {
    error,
    setError,
    clearError,
    handleAsyncError,
  };
}; 