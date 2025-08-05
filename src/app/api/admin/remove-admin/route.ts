import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
    }

    // Update user to remove admin privileges
    const { data: updatedUsers, error: updateError } = await supabase
      .from('profiles')
      .update({
        user_type: 'user',
        role: 'user',
        is_admin: false
      })
      .eq('id', userId)
      .select();

    if (updateError) {
      console.error('Error removing admin privileges:', updateError);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to remove admin privileges' 
      }, { status: 500 });
    }

    if (!updatedUsers || updatedUsers.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'User not found' 
      }, { status: 404 });
    }

    const updatedUser = updatedUsers[0];

    // Create admin notification
    await supabase
      .from('admin_notifications')
      .insert({
        title: 'Admin Removed',
        message: `Admin privileges removed from user ${updatedUser.full_name || userId}`,
        type: 'warning',
        created_at: new Date().toISOString()
      });

    return NextResponse.json({ 
      success: true, 
      message: `Admin privileges removed from user ${updatedUser.full_name || userId}`,
      user: updatedUser
    });

  } catch (error) {
    console.error('Error removing admin:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
} 