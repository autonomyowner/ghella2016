import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/supabaseClient';

export async function POST() {
  try {
    // Create nurseries table
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS public.nurseries (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        currency TEXT DEFAULT 'DZD',
        plant_type TEXT CHECK (plant_type IN ('fruit_trees', 'ornamental', 'vegetables', 'herbs', 'forest', 'other')),
        plant_name TEXT,
        age_months INTEGER,
        size TEXT CHECK (size IN ('seedling', 'small', 'medium', 'large', 'mature')),
        quantity INTEGER NOT NULL DEFAULT 1,
        health_status TEXT,
        location TEXT NOT NULL,
        coordinates JSONB,
        images TEXT[],
        is_available BOOLEAN DEFAULT true,
        is_featured BOOLEAN DEFAULT false,
        view_count INTEGER DEFAULT 0,
        pot_size TEXT,
        care_instructions TEXT,
        seasonality TEXT CHECK (seasonality IN ('spring', 'summer', 'autumn', 'winter', 'all_year'))
      );
    `;

    // Enable RLS
    const enableRLSSQL = `
      ALTER TABLE public.nurseries ENABLE ROW LEVEL SECURITY;
    `;

    // Create RLS policies
    const createPoliciesSQL = `
      -- Policy for users to read all nurseries
      CREATE POLICY "Users can view all nurseries" ON public.nurseries
        FOR SELECT USING (true);

      -- Policy for users to insert their own nurseries
      CREATE POLICY "Users can insert their own nurseries" ON public.nurseries
        FOR INSERT WITH CHECK (auth.uid() = user_id);

      -- Policy for users to update their own nurseries
      CREATE POLICY "Users can update their own nurseries" ON public.nurseries
        FOR UPDATE USING (auth.uid() = user_id);

      -- Policy for users to delete their own nurseries
      CREATE POLICY "Users can delete their own nurseries" ON public.nurseries
        FOR DELETE USING (auth.uid() = user_id);
    `;

    // Execute the SQL commands
    const { error: createError } = await supabase.rpc('exec_sql', { sql: createTableSQL });
    if (createError) {
      console.error('Error creating table:', createError);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to create table',
        details: createError 
      }, { status: 500 });
    }

    const { error: rlsError } = await supabase.rpc('exec_sql', { sql: enableRLSSQL });
    if (rlsError) {
      console.error('Error enabling RLS:', rlsError);
    }

    const { error: policiesError } = await supabase.rpc('exec_sql', { sql: createPoliciesSQL });
    if (policiesError) {
      console.error('Error creating policies:', policiesError);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Nurseries table created successfully' 
    });

  } catch (error) {
    console.error('Error in create-nurseries-table:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error',
      details: error 
    }, { status: 500 });
  }
} 