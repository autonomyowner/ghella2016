'use client';

import React, { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useEquipment } from '@/hooks/useSupabase';

const TestEquipmentSimplePage: React.FC = () => {
  const { user } = useSupabaseAuth();
  const { equipment, loading, error, fetchEquipment } = useEquipment();
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // Monitor equipment changes - only log once when loading changes
  useEffect(() => {
    if (!loading && equipment.length > 0) {
      addResult(`Equipment loaded: ${equipment.length} items`);
    }
  }, [equipment.length, loading]);

  // Monitor error changes
  useEffect(() => {
    if (error) {
      addResult(`Error occurred: ${error}`);
    }
  }, [error]);

  const testInitialLoad = async () => {
    addResult('Testing initial equipment load...');
    
    if (loading) {
      addResult('⏳ Hook is currently loading...');
      return;
    }

    addResult(`📊 Current equipment count: ${equipment.length}`);
    
    if (equipment.length === 0) {
      addResult('⚠️ No equipment loaded. Trying manual fetch...');
      try {
        await fetchEquipment();
        addResult(`🔄 Manual fetch completed. Equipment count: ${equipment.length}`);
      } catch (err) {
        addResult(`❌ Manual fetch failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    } else {
      addResult(`✅ Equipment loaded successfully: ${equipment.length} items`);
      equipment.slice(0, 3).forEach((item, index) => {
        addResult(`  ${index + 1}. ${item.title}`);
      });
    }
  };

  const testDirectQuery = async () => {
    addResult('Testing direct database query...');
    
    try {
      const response = await fetch('/api/test-equipment-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id })
      });

      if (!response.ok) {
        addResult(`❌ Direct query failed: ${response.status} ${response.statusText}`);
      } else {
        const result = await response.json();
        addResult(`✅ Direct query successful: ${result.count} equipment items`);
      }
    } catch (err) {
      addResult(`❌ Direct query error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Simple Equipment Test</h1>
      
      {!user && (
        <div style={{ color: 'red', marginBottom: '20px' }}>
          No user logged in
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testInitialLoad}
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
          {loading ? 'Loading...' : 'Test Initial Load'}
        </button>

        <button 
          onClick={testDirectQuery}
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
          Test Direct Query
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
          <div style={{ color: '#6c757d' }}>Click "Test Initial Load" to start...</div>
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
        <strong>Hook Status:</strong>
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

export default TestEquipmentSimplePage; 