#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const SUPABASE_URL = 'https://puvmqdnvofbtmqpcjmia.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1dm1xZG52b2ZidG1xcGNqbWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5ODc2MDcsImV4cCI6MjA2ODU2MzYwN30.9rLsQz3vi8rU46OqTYHCInVMSGdj5xgZTYZvq7ZBfjY';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Simple MCP-like interface for testing
async function queryTable(tableName) {
  try {
    console.log(`🔍 Querying ${tableName} table...\n`);
    
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(10);

    if (error) {
      console.error(`❌ Error querying ${tableName}:`, error);
      return;
    }

    if (!data || data.length === 0) {
      console.log(`📭 No data found in ${tableName} table.`);
      return;
    }

    console.log(`✅ Found ${data.length} record(s) in ${tableName}:\n`);
    console.log(JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error(`❌ Unexpected error querying ${tableName}:`, error);
  }
}

// Test all available tables
async function testAllTables() {
  const tables = ['profiles', 'equipment', 'vegetables'];
  
  for (const table of tables) {
    await queryTable(table);
    console.log('\n' + '='.repeat(50) + '\n');
  }
}

// Run the test
testAllTables(); 