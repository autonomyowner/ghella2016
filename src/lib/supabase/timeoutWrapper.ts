// Timeout wrapper for Supabase operations to prevent hanging
export const withTimeout = <T>(
  promise: Promise<T>,
  timeoutMs: number = 10000,
  errorMessage: string = 'Operation timed out'
): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(errorMessage)), timeoutMs)
    ),
  ]);
};

// Specific timeout wrappers for common operations
export const withQueryTimeout = <T>(promise: Promise<T>): Promise<T> => {
  return withTimeout(promise, 15000, 'Database query timed out');
};

export const withAuthTimeout = <T>(promise: Promise<T>): Promise<T> => {
  return withTimeout(promise, 20000, 'Authentication timed out');
};

export const withInsertTimeout = <T>(promise: Promise<T>): Promise<T> => {
  return withTimeout(promise, 30000, 'Insert operation timed out');
};

// Utility to check if operation is taking too long
export const createProgressTracker = (operationName: string) => {
  const startTime = Date.now();
  
  return {
    checkProgress: () => {
      const elapsed = Date.now() - startTime;
      if (elapsed > 5000) {
        console.warn(`${operationName} is taking longer than expected: ${elapsed}ms`);
      }
      return elapsed;
    },
    getElapsed: () => Date.now() - startTime,
  };
}; 