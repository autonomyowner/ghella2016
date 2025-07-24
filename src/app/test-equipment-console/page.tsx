'use client';

import React, { useState } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useEquipment } from '@/hooks/useSupabase';
import { supabase } from '@/lib/supabase/supabaseClient';

const TestEquipmentConsolePage: React.FC = () => {
  const { user } = useSupabaseAuth();
  const { equipment, loading, error, fetchEquipment } = useEquipment();
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testHookFetch = async () => {
    addResult('Testing hook fetchEquipment function...');
    addResult(`Current equipment count: ${equipment.length}`);
    addResult(`Loading state: ${loading}`);
    addResult(`Error state: ${error || 'None'}`);
    
    try {
      addResult('Calling fetchEquipment()...');
      const result = await fetchEquipment();
      addResult(`fetchEquipment returned: ${result?.length || 0} items`);
      addResult(`Equipment state after fetch: ${equipment.length} items`);
    } catch (err) {
      addResult(`fetchEquipment failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const testDirectSupabase = async () => {
    addResult('Testing direct Supabase query (same as hook)...');
    
    try {
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        addResult(`Direct query failed: ${error.message}`);
        addResult(`Error code: ${error.code}`);
      } else {
        addResult(`Direct query successful: ${data?.length || 0} items`);
        if (data && data.length > 0) {
          data.slice(0, 3).forEach((item: any, index: number) => {
            addResult(`  ${index + 1}. ${item.title}`);
          });
        }
      }
    } catch (err) {
      addResult(`Direct query error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Equipment Console Test</h1>
      
      <div style={{ 
        padding: '10px', 
        backgroundColor: '#fff3cd', 
        border: '1px solid #ffeaa7',
        borderRadius: '4px',
        marginBottom: '20px'
      }}>
        <strong>Instructions:</strong>
        <ol style={{ margin: '5px 0', paddingLeft: '20px' }}>
          <li>Open browser developer tools (F12)</li>
          <li>Go to Console tab</li>
          <li>Click test buttons below</li>
          <li>Watch both this page and the console for logs</li>
        </ol>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testHookFetch}
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
          {loading ? 'Loading...' : 'Test Hook Fetch'}
        </button>

        <button 
          onClick={testDirectSupabase}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Test Direct Supabase
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
        maxHeight: '300px',
        overflowY: 'auto',
        fontFamily: 'monospace',
        fontSize: '12px'
      }}>
        {results.length === 0 ? (
          <div style={{ color: '#6c757d' }}>Click test buttons and watch console...</div>
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
        <strong>Current Hook Status:</strong>
        <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
          <li>Loading: {loading ? 'Yes' : 'No'}</li>
          <li>Equipment Count: {equipment.length}</li>
          <li>Error: {error || 'None'}</li>
          <li>User: {user ? user.email : 'Not logged in'}</li>
        </ul>
      </div>
    </div>
  );
};

export default TestEquipmentConsolePage; 