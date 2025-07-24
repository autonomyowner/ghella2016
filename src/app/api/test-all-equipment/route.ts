import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://puvmqdnvofbtmqpcjmia.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1dm1xZG52b2ZidG1xcGNqbWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5ODc2MDcsImV4cCI6MjA2ODU2MzYwN30.9rLsQz3vi8rU46OqTYHCInVMSGdj5xgZTYZvq7ZBfjY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request: NextRequest) {
  try {
    // Query all equipment (like the hook does)
    const { data, error } = await supabase
      .from('equipment')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ 
        error: error.message,
        details: error,
        code: error.code
      }, { status: 500 });
    }

    return NextResponse.json({ 
      count: data?.length || 0,
      equipment: data || []
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
} 