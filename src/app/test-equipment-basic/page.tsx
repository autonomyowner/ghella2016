'use client';

import React, { useState } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useEquipment } from '@/hooks/useSupabase';

const TestEquipmentBasicPage: React.FC = () => {
  const { user } = useSupabaseAuth();
  const { equipment, loading, error, fetchEquipment } = useEquipment();
  const [testResult, setTestResult] = useState<string>('');

  const runTest = async () => {
    setTestResult('Running test...');
    
    try {
      if (!user) {
        setTestResult('❌ No user logged in');
        return;
      }

      setTestResult(`📊 Equipment count: ${equipment.length}`);
      
      if (equipment.length === 0) {
        setTestResult('⚠️ No equipment found. Trying manual fetch...');
        await fetchEquipment();
        setTestResult(`🔄 Manual fetch completed. Equipment count: ${equipment.length}`);
      } else {
        setTestResult(`✅ Equipment loaded successfully: ${equipment.length} items`);
      }
    } catch (err) {
      setTestResult(`❌ Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Basic Equipment Test</h1>
      
      {!user && (
        <div style={{ color: 'red', marginBottom: '20px' }}>
          No user logged in
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={runTest}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Loading...' : 'Run Test'}
        </button>
      </div>

      <div style={{ 
        padding: '10px', 
        backgroundColor: '#f8f9fa', 
        border: '1px solid #dee2e6',
        borderRadius: '4px',
        marginBottom: '20px'
      }}>
        <strong>Test Result:</strong> {testResult || 'Click "Run Test" to start'}
      </div>

      <div style={{ 
        padding: '10px', 
        backgroundColor: '#e9ecef', 
        border: '1px solid #dee2e6',
        borderRadius: '4px'
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
          <strong>Equipment Found:</strong>
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

export default TestEquipmentBasicPage; 