import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Require env vars in all environments; never fall back to hardcoded keys
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase environment variables are missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
}

// Singleton pattern to prevent multiple instances
let supabaseInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient => {
  if (!supabaseInstance) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('Creating new Supabase client instance...');
    }
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

    if (process.env.NODE_ENV !== 'production') {
      console.log('Supabase client initialized with URL:', supabaseUrl);
    }
  }
  
  return supabaseInstance;
};

// Export the singleton instance
export const supabase = getSupabaseClient();

export default supabase; 