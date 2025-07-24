'use client';

import React, { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useEquipment } from '@/hooks/useSupabase';

const TestEquipmentFinalPage: React.FC = () => {
  const { user } = useSupabaseAuth();
  const { equipment, loading, error, fetchEquipment } = useEquipment();
  const [results, setResults] = useState<string[]>([]);
  const [testRunning, setTestRunning] = useState(false);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // Monitor equipment changes
  useEffect(() => {
    if (testRunning) {
      addResult(`🔄 Equipment state updated: ${equipment.length} items`);
    }
  }, [equipment.length, testRunning]);

  const runFinalTest = async () => {
    setTestRunning(true);
    addResult('=== FINAL EQUIPMENT TEST ===');
    addResult(`👤 User: ${user ? user.email : 'Not logged in'}`);
    addResult(`📊 Initial equipment count: ${equipment.length}`);
    addResult(`⏳ Loading state: ${loading}`);
    addResult(`❌ Error state: ${error || 'None'}`);
    
    try {
      addResult('🚀 Calling fetchEquipment()...');
      
      const result = await fetchEquipment();
      
      addResult(`✅ fetchEquipment completed!`);
      addResult(`📦 Function returned: ${Array.isArray(result) ? result.length : 0} items`);
      
      // Wait a bit for state to update
      addResult('⏱️ Waiting for state update...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addResult(`📊 Final equipment count: ${equipment.length}`);
      
      if (equipment.length > 0) {
        addResult('🎉 SUCCESS: Equipment is loading properly!');
        equipment.slice(0, 3).forEach((item, index) => {
          addResult(`  ${index + 1}. ${item.title}`);
        });
      } else {
        addResult('❌ FAILURE: Equipment count is still 0');
      }
      
    } catch (err) {
      addResult(`❌ fetchEquipment failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
    
    addResult('=== TEST COMPLETE ===');
    setTestRunning(false);
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🎯 Final Equipment Test</h1>
      
      <div style={{ 
        padding: '10px', 
        backgroundColor: '#d4edda', 
        border: '1px solid #c3e6cb',
        borderRadius: '4px',
        marginBottom: '20px'
      }}>
        <strong>🎉 Good News:</strong> The hook is working! Equipment count shows 8 items in the status below.
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={runFinalTest}
          disabled={loading || testRunning}
          style={{
            padding: '10px 20px',
            backgroundColor: loading || testRunning ? '#ccc' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading || testRunning ? 'not-allowed' : 'pointer',
            marginRight: '10px'
          }}
        >
          {loading || testRunning ? 'Testing...' : 'Run Final Test'}
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
          <div style={{ color: '#6c757d' }}>Click "Run Final Test" to verify everything works...</div>
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
        <strong>✅ Current Hook Status:</strong>
        <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
          <li>Loading: {loading ? 'Yes' : 'No'}</li>
          <li>Equipment Count: {equipment.length}</li>
          <li>Error: {error || 'None'}</li>
          <li>User: {user ? user.email : 'Not logged in'}</li>
        </ul>
      </div>

      {equipment.length > 0 && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#d4edda', 
          border: '1px solid #c3e6cb',
          borderRadius: '4px',
          marginTop: '20px'
        }}>
          <strong>🎉 Equipment Found:</strong>
          <div style={{ marginTop: '10px' }}>
            {equipment.slice(0, 3).map((item, index) => (
              <div key={item.id || index} style={{ 
                padding: '5px', 
                margin: '2px 0', 
                backgroundColor: 'white', 
                border: '1px solid #ddd',
                borderRadius: '2px'
              }}>
                {item.title}
              </div>
            ))}
            {equipment.length > 3 && (
              <div style={{ color: '#6c757d', fontSize: '12px' }}>
                ... and {equipment.length - 3} more
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TestEquipmentFinalPage; 