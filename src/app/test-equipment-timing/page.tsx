'use client';

import React, { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useEquipment } from '@/hooks/useSupabase';

const TestEquipmentTimingPage: React.FC = () => {
  const { user } = useSupabaseAuth();
  const { equipment, loading, error, fetchEquipment } = useEquipment();
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // Monitor user and equipment changes
  useEffect(() => {
    addResult(`User state changed: ${user ? 'Logged in' : 'Not logged in'} (${user?.id || 'no id'})`);
  }, [user]);

  useEffect(() => {
    addResult(`Equipment state changed: ${equipment.length} items, loading: ${loading}`);
  }, [equipment.length, loading]);

  const testManualFetch = async () => {
    addResult('Testing manual fetch...');
    try {
      await fetchEquipment();
      addResult(`Manual fetch completed. Equipment count: ${equipment.length}`);
    } catch (err) {
      addResult(`Manual fetch failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const testWithDelay = async () => {
    addResult('Testing fetch with 2 second delay...');
    setTimeout(async () => {
      try {
        await fetchEquipment();
        addResult(`Delayed fetch completed. Equipment count: ${equipment.length}`);
      } catch (err) {
        addResult(`Delayed fetch failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }, 2000);
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Equipment Timing Test</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testManualFetch}
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
          {loading ? 'Loading...' : 'Manual Fetch'}
        </button>

        <button 
          onClick={testWithDelay}
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
          Delayed Fetch
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
          <div style={{ color: '#6c757d' }}>Monitoring state changes...</div>
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
          <li>User: {user ? user.email : 'Not logged in'}</li>
          <li>User ID: {user?.id || 'None'}</li>
          <li>Loading: {loading ? 'Yes' : 'No'}</li>
          <li>Equipment Count: {equipment.length}</li>
          <li>Error: {error || 'None'}</li>
        </ul>
      </div>

      <div style={{ 
        padding: '10px', 
        backgroundColor: '#fff3cd', 
        border: '1px solid #ffeaa7',
        borderRadius: '4px',
        marginTop: '20px'
      }}>
        <strong>Test Purpose:</strong>
        <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
          <li>Monitor when user state changes</li>
          <li>Monitor when equipment state changes</li>
          <li>Test if manual fetch works</li>
          <li>Test if delayed fetch works</li>
        </ul>
      </div>
    </div>
  );
};

export default TestEquipmentTimingPage; 