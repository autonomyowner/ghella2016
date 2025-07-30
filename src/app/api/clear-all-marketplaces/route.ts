import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  try {
    console.log('🧹 Starting marketplace cleanup via API...');
    
    // Clear all marketplace tables
    const tablesToClear = [
      'equipment',
      'land_listings', 
      'agricultural_products',
      'messages',
      'favorites',
      'reviews',
      'land_reviews',
      'land_favorites',
      'export_deals',
      'nurseries',
      'vegetables',
      'animals',
      'labor',
      'delivery',
      'experts'
    ];

    const results: { [key: string]: string } = {};

    for (const table of tablesToClear) {
      try {
        const { error } = await supabase
          .from(table)
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000');
        
        if (error) {
          results[table] = `Error: ${error.message}`;
        } else {
          results[table] = 'Cleared successfully';
        }
      } catch (err) {
        results[table] = `Error: ${err instanceof Error ? err.message : 'Unknown error'}`;
      }
    }

    // Verify cleanup
    const verification: { [key: string]: number } = {};
    const verificationTables = ['equipment', 'land_listings', 'agricultural_products', 'messages', 'favorites', 'reviews'];
    
    for (const table of verificationTables) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          verification[table] = -1; // Error
        } else {
          verification[table] = count || 0;
        }
      } catch (err) {
        verification[table] = -1; // Error
      }
    }

    return NextResponse.json({
      success: true,
      message: 'All marketplace data has been cleared successfully!',
      results,
      verification,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 