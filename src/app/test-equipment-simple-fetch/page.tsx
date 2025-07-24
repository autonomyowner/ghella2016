'use client';

import React, { useState } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useEquipment } from '@/hooks/useSupabase';

const TestEquipmentSimpleFetchPage: React.FC = () => {
  const { user } = useSupabaseAuth();
  const { equipment, loading, error, fetchEquipment } = useEquipment();
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testSimpleFetch = async () => {
    addResult('=== Starting Simple Fetch Test ===');
    addResult(`User: ${user ? user.email : 'Not logged in'}`);
    addResult(`Current equipment count: ${equipment.length}`);
    addResult(`Loading: ${loading}`);
    addResult(`Error: ${error || 'None'}`);
    
    try {
      addResult('About to call fetchEquipment()...');
      
      // Call fetchEquipment with a timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Function call timed out after 10 seconds')), 10000)
      );
      
      const fetchPromise = fetchEquipment();
      
      const result = await Promise.race([fetchPromise, timeoutPromise]);
      
      addResult(`fetchEquipment completed successfully!`);
      addResult(`Returned: ${Array.isArray(result) ? result.length : 0} items`);
      addResult(`Equipment state after: ${equipment.length} items`);
      
    } catch (err) {
      addResult(`❌ fetchEquipment failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
    
    addResult('=== Test Complete ===');
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Simple Fetch Test</h1>
      
      <div style={{ 
        padding: '10px', 
        backgroundColor: '#fff3cd', 
        border: '1px solid #ffeaa7',
        borderRadius: '4px',
        marginBottom: '20px'
      }}>
        <strong>Instructions:</strong>
        <ol style={{ margin: '5px 0', paddingLeft: '20px' }}>
          <li>Open browser console (F12)</li>
          <li>Click "Test Simple Fetch"</li>
          <li>Watch both this page and console</li>
          <li>This test has a 10-second timeout</li>
        </ol>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testSimpleFetch}
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
          {loading ? 'Loading...' : 'Test Simple Fetch'}
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
          <div style={{ color: '#6c757d' }}>Click "Test Simple Fetch" to start...</div>
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
        <strong>Current Status:</strong>
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

export default TestEquipmentSimpleFetchPage; 