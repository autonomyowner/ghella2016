import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Service key exists:', !!supabaseServiceKey);

const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

export async function GET() {
  try {
    console.log('Testing service role connection...');
    
    // Test basic connection with service role
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Service role error:', error);
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Service role connection successful',
      data: data
    });

  } catch (error) {
    console.error('Error testing service role:', error);
    return NextResponse.json({ 
      success: false, 
      error: `Service role test failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
    });
  }
} 