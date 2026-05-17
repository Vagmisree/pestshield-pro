import { useState, useCallback } from 'react';

export type AsyncState<T> = {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  success: boolean;
};

interface UseMockApiOptions {
  delay?: number;
  shouldFail?: boolean;
  errorMessage?: string;
}

export function useMockApi<T>(
  mockFn: () => T | Promise<T>,
  options: UseMockApiOptions = {}
) {
  const { delay = 800, shouldFail = false, errorMessage = 'An error occurred' } = options;
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    isLoading: false,
    error: null,
    success: false,
  });

  const execute = useCallback(async () => {
    setState({ data: null, isLoading: true, error: null, success: false });
    
    try {
      await new Promise((resolve) => setTimeout(resolve, delay));
      
      if (shouldFail) {
        throw new Error(errorMessage);
      }
      
      const result = await mockFn();
      setState({ data: result, isLoading: false, error: null, success: true });
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : errorMessage;
      setState({ data: null, isLoading: false, error: message, success: false });
      throw err;
    }
  }, [mockFn, delay, shouldFail, errorMessage]);

  const reset = useCallback(() => {
    setState({ data: null, isLoading: false, error: null, success: false });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}
