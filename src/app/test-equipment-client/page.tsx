'use client';

import React, { useState } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/supabase/supabaseClient';

const TestEquipmentClientPage: React.FC = () => {
  const { user } = useSupabaseAuth();
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testClientQuery = async () => {
    setLoading(true);
    addResult('Testing client-side Supabase query...');
    
    try {
      if (!user) {
        addResult('❌ No user logged in');
        return;
      }

      addResult(`👤 User ID: ${user.id}`);
      addResult(`🔑 User email: ${user.email}`);

      // Test the exact same query as the hook
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        addResult(`❌ Client query failed: ${error.message}`);
        addResult(`   Error code: ${error.code}`);
        addResult(`   Error details: ${JSON.stringify(error)}`);
      } else {
        addResult(`✅ Client query successful: ${data?.length || 0} items`);
        if (data && data.length > 0) {
          data.slice(0, 3).forEach((item: any, index: number) => {
            addResult(`  ${index + 1}. ${item.title} (User: ${item.user_id})`);
          });
        }
      }

      // Test user-specific query
      addResult('Testing user-specific query...');
      const { data: userData, error: userError } = await supabase
        .from('equipment')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (userError) {
        addResult(`❌ User query failed: ${userError.message}`);
        addResult(`   Error code: ${userError.code}`);
      } else {
        addResult(`✅ User query successful: ${userData?.length || 0} items`);
      }

    } catch (err) {
      addResult(`❌ Unexpected error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Client-Side Equipment Test</h1>
      
      {!user && (
        <div style={{ color: 'red', marginBottom: '20px' }}>
          No user logged in
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testClientQuery}
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
          {loading ? 'Testing...' : 'Test Client Query'}
        </button>

        <button 
          onClick={clearResults}
          style={{
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Clear Results
        </button>
      </div>

      <div style={{ 
        padding: '10px', 
        backgroundColor: '#f8f9fa', 
        border: '1px solid #dee2e6',
        borderRadius: '4px',
        maxHeight: '400px',
        overflowY: 'auto',
        fontFamily: 'monospace',
        fontSize: '12px'
      }}>
        {results.length === 0 ? (
          <div style={{ color: '#6c757d' }}>Click "Test Client Query" to start...</div>
        ) : (
          results.map((result, index) => (
            <div key={index} style={{ marginBottom: '5px' }}>
              {result}
            </div>
          ))
        )}
      </div>

      <div style={{ 
        padding: '10px', 
        backgroundColor: '#e9ecef', 
        border: '1px solid #dee2e6',
        borderRadius: '4px',
        marginTop: '20px'
      }}>
        <strong>Test Info:</strong>
        <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
          <li>This test uses the same client-side Supabase instance as the hook</li>
          <li>If this fails, the hook will also fail</li>
          <li>If this works but the hook doesn't, there's an issue in the hook logic</li>
        </ul>
      </div>
    </div>
  );
};

export default TestEquipmentClientPage; 