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
    const { email, full_name } = await request.json();

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'يرجى إدخال بريد إلكتروني صحيح' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const { data: existingSubscription } = await supabase
      .from('newsletter_subscriptions')
      .select('*')
      .eq('email', email)
      .single();

    if (existingSubscription) {
      if (existingSubscription.status === 'active') {
        return NextResponse.json(
          { success: false, error: 'أنت مشترك بالفعل في النشرة الإخبارية' },
          { status: 400 }
        );
      } else {
        // Reactivate subscription
        const { error: updateError } = await supabase
          .from('newsletter_subscriptions')
          .update({ 
            status: 'active',
            full_name: full_name || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingSubscription.id);

        if (updateError) {
          console.error('Error reactivating subscription:', updateError);
          return NextResponse.json(
            { success: false, error: 'حدث خطأ أثناء إعادة تفعيل الاشتراك' },
            { status: 500 }
          );
        }

        return NextResponse.json(
          { success: true, message: 'تم إعادة تفعيل اشتراكك بنجاح!' }
        );
      }
    }

    // Insert new subscription
    const { error: insertError } = await supabase
      .from('newsletter_subscriptions')
      .insert({
        email,
        full_name: full_name || null,
        status: 'active',
        source: 'website',
        subscribed_at: new Date().toISOString()
      });

    if (insertError) {
      console.error('Error inserting newsletter subscription:', insertError);
      return NextResponse.json(
        { success: false, error: 'حدث خطأ أثناء الاشتراك في النشرة الإخبارية' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'تم الاشتراك بنجاح في النشرة الإخبارية!' }
    );

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    console.log('Fetching newsletter subscriptions with server-side client...');
    const { data: subscriptions, error } = await supabase
      .from('newsletter_subscriptions')
      .select('*')
      .order('subscribed_at', { ascending: false });

    if (error) {
      console.error('Error fetching newsletter subscriptions:', error);
      return NextResponse.json(
        { success: false, error: 'حدث خطأ أثناء جلب البيانات' },
        { status: 500 }
      );
    }

    console.log('Newsletter subscriptions fetched successfully:', subscriptions?.length || 0, 'subscriptions');
    return NextResponse.json({ success: true, data: subscriptions });

  } catch (error) {
    console.error('Newsletter GET error:', error);
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
    const { status } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'معرف الاشتراك مطلوب' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    updateData.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from('newsletter_subscriptions')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating newsletter subscription:', error);
      return NextResponse.json(
        { success: false, error: 'حدث خطأ أثناء تحديث الاشتراك' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'تم تحديث الاشتراك بنجاح' });

  } catch (error) {
    console.error('Newsletter PATCH error:', error);
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
        { success: false, error: 'معرف الاشتراك مطلوب' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('newsletter_subscriptions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting newsletter subscription:', error);
      return NextResponse.json(
        { success: false, error: 'حدث خطأ أثناء حذف الاشتراك' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'تم حذف الاشتراك بنجاح' });

  } catch (error) {
    console.error('Newsletter DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
} 