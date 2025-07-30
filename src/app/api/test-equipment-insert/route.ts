import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const equipmentData = await request.json();

    console.log('🔍 Testing equipment insertion with data:', equipmentData);

    // Test the insertion
    const { data, error } = await supabase
      .from('equipment')
      .insert([equipmentData])
      .select()
      .single();

    if (error) {
      console.error('❌ Equipment insertion error:', error);
      return NextResponse.json(
        { error: error.message, details: error },
        { status: 400 }
      );
    }

    console.log('✅ Equipment inserted successfully:', data);
    return NextResponse.json({ success: true, data });

  } catch (error) {
    console.error('❌ API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    );
  }
} 