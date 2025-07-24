'use client';

import React, { useState } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/supabase/supabaseClient';

const TestDirectInsertPage: React.FC = () => {
  const { user } = useSupabaseAuth();
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testDirectInsert = async () => {
    setLoading(true);
    setResult('Testing direct insert...');

    try {
      if (!user) {
        setResult('No user logged in');
        return;
      }

      const testData = {
        user_id: user.id,
        title: 'Direct Test - ' + new Date().toISOString(),
        description: 'Direct insert test',
        price: 1000,
        currency: 'DZD',
        listing_type: 'sale',
        area_size: 1,
        area_unit: 'hectare',
        location: 'Test',
        soil_type: 'clay',
        water_source: 'well',
        images: ['/placeholder-image.jpg'],
        is_available: true,
        is_featured: false,
        view_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('Attempting direct insert with data:', testData);

      // Test 1: Check if we can read from the table
      setResult('Testing table access...');
      const { data: readData, error: readError } = await supabase
        .from('land_listings')
        .select('count')
        .limit(1);

      if (readError) {
        setResult(`❌ Read error: ${readError.message}`);
        return;
      }
      setResult('✅ Table read successful');

      // Test 2: Try direct insert without timeout
      setResult('Attempting insert...');
      const startTime = Date.now();
      
      const { data, error } = await supabase
        .from('land_listings')
        .insert([testData])
        .select()
        .single();

      const elapsed = Date.now() - startTime;

      if (error) {
        setResult(`❌ Insert failed after ${elapsed}ms: ${error.message}`);
        console.error('Full error:', error);
      } else {
        setResult(`✅ Insert successful after ${elapsed}ms! ID: ${data.id}`);
      }

    } catch (error) {
      setResult(`❌ Exception: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('Full exception:', error);
    } finally {
      setLoading(false);
    }
  };

  const testRLS = async () => {
    setLoading(true);
    setResult('Testing RLS policies...');

    try {
      // Check current RLS policies
      const { data: policies, error: policiesError } = await supabase
        .rpc('get_rls_policies', { table_name: 'land_listings' });

      if (policiesError) {
        setResult(`❌ Cannot check RLS: ${policiesError.message}`);
        return;
      }

      setResult(`✅ RLS policies found: ${policies?.length || 0}`);

      // Test if RLS is blocking us
      const { data: testData, error: testError } = await supabase
        .from('land_listings')
        .select('*')
        .limit(1);

      if (testError) {
        setResult(`❌ RLS blocking read: ${testError.message}`);
      } else {
        setResult(`✅ RLS allows read, found ${testData?.length || 0} records`);
      }

    } catch (error) {
      setResult(`❌ RLS test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const testSimpleInsert = async () => {
    setLoading(true);
    setResult('Testing minimal insert...');

    try {
      const minimalData = {
        user_id: user?.id,
        title: 'Minimal Test',
        description: 'Test',
        price: 100,
        currency: 'DZD',
        listing_type: 'sale',
        area_size: 1,
        area_unit: 'hectare',
        location: 'Test',
        is_available: true
      };

      const { data, error } = await supabase
        .from('land_listings')
        .insert([minimalData])
        .select()
        .single();

      if (error) {
        setResult(`❌ Minimal insert failed: ${error.message}`);
      } else {
        setResult(`✅ Minimal insert successful! ID: ${data.id}`);
      }

    } catch (error) {
      setResult(`❌ Minimal insert exception: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Direct Database Insert Test</h1>
      
      {!user && (
        <div style={{ color: 'red', marginBottom: '20px' }}>
          No user logged in
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testDirectInsert}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginRight: '10px'
          }}
        >
          {loading ? 'Testing...' : 'Test Direct Insert'}
        </button>

        <button 
          onClick={testRLS}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: loading ? '#ccc' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginRight: '10px'
          }}
        >
          {loading ? 'Testing...' : 'Test RLS'}
        </button>

        <button 
          onClick={testSimpleInsert}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: loading ? '#ccc' : '#ffc107',
            color: 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Testing...' : 'Test Minimal Insert'}
        </button>
      </div>

      <div style={{ 
        padding: '10px', 
        backgroundColor: '#f8f9fa', 
        border: '1px solid #dee2e6',
        borderRadius: '4px',
        marginBottom: '20px',
        fontFamily: 'monospace',
        fontSize: '12px',
        whiteSpace: 'pre-wrap'
      }}>
        <strong>Result:</strong> {result}
      </div>

      {user && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#e9ecef' }}>
          <strong>User:</strong> {user.email} (ID: {user.id})
        </div>
      )}

      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#fff3cd', border: '1px solid #ffeaa7' }}>
        <strong>What this tests:</strong>
        <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li><strong>Direct Insert:</strong> Bypasses timeout wrapper to see real error</li>
          <li><strong>RLS Test:</strong> Checks if Row Level Security is blocking operations</li>
          <li><strong>Minimal Insert:</strong> Tests with minimal required fields only</li>
        </ul>
      </div>
    </div>
  );
};

export default TestDirectInsertPage; 