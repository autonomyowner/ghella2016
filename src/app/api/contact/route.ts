import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Server-side client that bypasses RLS
const supabaseUrl = 'https://puvmqdnvofbtmqpcjmia.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1dm1xZG52b2ZidG1xcGNqbWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5ODc2MDcsImV4cCI6MjA2ODU2MzYwN30.9rLsQz3vi8rU46OqTYHCInVMSGdj5xgZTYZvq7ZBfjY';

// Create a server-side client that can bypass RLS
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, subject, message, message_type = 'general' } = await request.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'يرجى ملء جميع الحقول المطلوبة' },
        { status: 400 }
      );
    }

    // Validate email
    if (!email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'يرجى إدخال بريد إلكتروني صحيح' },
        { status: 400 }
      );
    }

    // Insert contact message
    const { error: insertError } = await supabase
      .from('contact_messages')
      .insert({
        name,
        email,
        phone: phone || null,
        subject,
        message,
        message_type,
        status: 'unread',
        created_at: new Date().toISOString()
      });

    if (insertError) {
      console.error('Error inserting contact message:', insertError);
      return NextResponse.json(
        { success: false, error: 'حدث خطأ أثناء إرسال الرسالة' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.' }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    console.log('Fetching contact messages with server-side client...');
    
    // First, let's check if we can access the table at all
    const { data: messages, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching contact messages:', error);
      return NextResponse.json(
        { success: false, error: 'حدث خطأ أثناء جلب البيانات' },
        { status: 500 }
      );
    }

    console.log('Contact messages fetched successfully:', messages?.length || 0, 'messages');
    return NextResponse.json({ success: true, data: messages });

  } catch (error) {
    console.error('Contact GET error:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const { status, admin_reply } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'معرف الرسالة مطلوب' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (admin_reply) updateData.admin_reply = admin_reply;
    updateData.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from('contact_messages')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating contact message:', error);
      return NextResponse.json(
        { success: false, error: 'حدث خطأ أثناء تحديث الرسالة' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'تم تحديث الرسالة بنجاح' });

  } catch (error) {
    console.error('Contact PATCH error:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'معرف الرسالة مطلوب' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting contact message:', error);
      return NextResponse.json(
        { success: false, error: 'حدث خطأ أثناء حذف الرسالة' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'تم حذف الرسالة بنجاح' });

  } catch (error) {
    console.error('Contact DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
} 