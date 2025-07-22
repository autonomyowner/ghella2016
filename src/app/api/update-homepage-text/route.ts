import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { homepage_subtitle } = await request.json();

    // Update the website settings
    const { error } = await supabase
      .from('website_settings')
      .upsert([{
        homepage_subtitle,
        announcement_text: `🌟 منصة الغلة - ${homepage_subtitle}`,
        updated_at: new Date().toISOString()
      }], { onConflict: 'id' });

    if (error) {
      console.error('Error updating website settings:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in update-homepage-text API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 