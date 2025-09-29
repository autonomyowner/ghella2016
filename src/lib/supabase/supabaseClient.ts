import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Fallback to hardcoded values if env vars not set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://puvmqdnvofbtmqpcjmia.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1dm1xZG52b2ZidG1xcGNqbWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5ODc2MDcsImV4cCI6MjA2ODU2MzYwN30.9rLsQz3vi8rU46OqTYHCInVMSGdj5xgZTYZvq7ZBfjY';

// Singleton pattern to prevent multiple instances
let supabaseInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient => {
  if (!supabaseInstance) {
    console.log('Creating new Supabase client instance...');
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        storageKey: 'elghella-auth',
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 5, // Reduced for better performance
        },
      },
      global: {
        headers: {
          'X-Client-Info': 'elghella-web',
        },
      },
      db: {
        schema: 'public',
      },
    });
    
    console.log('Supabase client initialized with URL:', supabaseUrl);
    console.log('Supabase client config:', {
      url: supabaseUrl,
      hasKey: !!supabaseAnonKey,
      keyLength: supabaseAnonKey?.length,
      usingEnvVars: !!process.env.NEXT_PUBLIC_SUPABASE_URL
    });
  }
  
  return supabaseInstance;
};

// Export the singleton instance
export const supabase = getSupabaseClient();

export default supabase; 