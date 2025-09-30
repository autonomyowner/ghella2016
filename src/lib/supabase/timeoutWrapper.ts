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
  return withTimeout(promise, 10000, 'Database query timed out');
};

export const withAuthTimeout = <T>(promise: Promise<T>): Promise<T> => {
  return withTimeout(promise, 15000, 'Authentication timed out');
};

export const withInsertTimeout = <T>(promise: Promise<T>): Promise<T> => {
  return withTimeout(promise, 15000, 'Insert operation timed out');
};

// Retry logic for failed operations
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      console.warn(`Attempt ${attempt} failed:`, error);
      
      if (attempt < maxRetries) {
        console.log(`Retrying in ${delayMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
        delayMs *= 2; // Exponential backoff
      }
    }
  }
  
  throw lastError!;
};

// Combined timeout and retry wrapper
export const withTimeoutAndRetry = <T>(
  operation: () => Promise<T>,
  timeoutMs: number = 10000,
  maxRetries: number = 2
): Promise<T> => {
  return withRetry(
    () => withTimeout(operation(), timeoutMs, 'Operation timed out'),
    maxRetries
  );
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