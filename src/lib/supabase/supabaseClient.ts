import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

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
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase env vars. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
    }
  }
  
  return supabaseInstance;
};

// Export the singleton instance
export const supabase = getSupabaseClient();

export default supabase; 