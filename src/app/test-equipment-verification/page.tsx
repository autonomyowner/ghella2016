'use client';

import React, { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useEquipment } from '@/hooks/useSupabase';

const TestEquipmentVerificationPage: React.FC = () => {
  const { user } = useSupabaseAuth();
  const { equipment, loading, error, fetchEquipment } = useEquipment();
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // Monitor equipment changes
  useEffect(() => {
    addResult(`🔄 Equipment state changed: ${equipment.length} items`);
  }, [equipment.length]);

  const runVerification = async () => {
    addResult('=== EQUIPMENT VERIFICATION ===');
    addResult(`✅ User: ${user ? user.email : 'Not logged in'}`);
    addResult(`✅ Equipment count: ${equipment.length}`);
    addResult(`✅ Loading: ${loading}`);
    addResult(`✅ Error: ${error || 'None'}`);
    
    if (equipment.length > 0) {
      addResult('🎉 SUCCESS: Equipment is loading properly!');
      addResult('📋 Equipment list:');
      equipment.slice(0, 5).forEach((item, index) => {
        addResult(`  ${index + 1}. ${item.title}`);
      });
      if (equipment.length > 5) {
        addResult(`  ... and ${equipment.length - 5} more items`);
      }
    } else {
      addResult('❌ FAILURE: No equipment found');
    }
    
    addResult('=== VERIFICATION COMPLETE ===');
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>✅ Equipment Verification</h1>
      
      <div style={{ 
        padding: '10px', 
        backgroundColor: equipment.length > 0 ? '#d4edda' : '#f8d7da', 
        border: `1px solid ${equipment.length > 0 ? '#c3e6cb' : '#f5c6cb'}`,
        borderRadius: '4px',
        marginBottom: '20px',
        color: equipment.length > 0 ? '#155724' : '#721c24'
      }}>
        <strong>{equipment.length > 0 ? '🎉 SUCCESS' : '❌ FAILURE'}:</strong> 
        Equipment count is {equipment.length} items
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={runVerification}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Run Verification
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
          <div style={{ color: '#6c757d' }}>Click "Run Verification" to check status...</div>
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

export default TestEquipmentVerificationPage; 