'use client';

import React, { useState } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useEquipment } from '@/hooks/useSupabase';

const TestEquipmentDebugPage: React.FC = () => {
  const { user } = useSupabaseAuth();
  const { equipment, loading, error, fetchEquipment } = useEquipment();
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testAllEquipment = async () => {
    addResult('Testing all equipment query...');
    
    try {
      const response = await fetch('/api/test-all-equipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        addResult(`❌ All equipment query failed: ${response.status} ${response.statusText}`);
        if (errorData.error) {
          addResult(`   Error: ${errorData.error}`);
        }
        if (errorData.code) {
          addResult(`   Code: ${errorData.code}`);
        }
      } else {
        const result = await response.json();
        addResult(`✅ All equipment query successful: ${result.count} total equipment items`);
        if (result.equipment && result.equipment.length > 0) {
          result.equipment.slice(0, 3).forEach((item: any, index: number) => {
            addResult(`  ${index + 1}. ${item.title} (User: ${item.user_id})`);
          });
        }
      }
    } catch (err) {
      addResult(`❌ All equipment query error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const testUserEquipment = async () => {
    addResult('Testing user equipment query...');
    
    try {
      const response = await fetch('/api/test-equipment-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        addResult(`❌ User equipment query failed: ${response.status} ${response.statusText}`);
        if (errorData.error) {
          addResult(`   Error: ${errorData.error}`);
        }
        if (errorData.code) {
          addResult(`   Code: ${errorData.code}`);
        }
      } else {
        const result = await response.json();
        addResult(`✅ User equipment query successful: ${result.count} user equipment items`);
        if (result.equipment && result.equipment.length > 0) {
          result.equipment.slice(0, 3).forEach((item: any, index: number) => {
            addResult(`  ${index + 1}. ${item.title}`);
          });
        }
      }
    } catch (err) {
      addResult(`❌ User equipment query error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const testHookEquipment = async () => {
    addResult('Testing hook equipment...');
    addResult(`📊 Hook equipment count: ${equipment.length}`);
    
    if (equipment.length === 0) {
      addResult('⚠️ Hook shows no equipment. Trying manual fetch...');
      try {
        await fetchEquipment();
        addResult(`🔄 Manual fetch completed. Equipment count: ${equipment.length}`);
      } catch (err) {
        addResult(`❌ Manual fetch failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    } else {
      addResult(`✅ Hook shows equipment: ${equipment.length} items`);
      equipment.slice(0, 3).forEach((item, index) => {
        addResult(`  ${index + 1}. ${item.title} (User: ${item.user_id})`);
      });
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Equipment Debug Test</h1>
      
      {!user && (
        <div style={{ color: 'red', marginBottom: '20px' }}>
          No user logged in
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testAllEquipment}
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
          Test All Equipment
        </button>

        <button 
          onClick={testUserEquipment}
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
          Test User Equipment
        </button>

        <button 
          onClick={testHookEquipment}
          style={{
            padding: '10px 20px',
            backgroundColor: '#ffc107',
            color: 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Test Hook Equipment
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
          <div style={{ color: '#6c757d' }}>Click test buttons to start debugging...</div>
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
          <li>Hook Equipment Count: {equipment.length}</li>
          <li>Error: {error || 'None'}</li>
          <li>User: {user ? user.email : 'Not logged in'}</li>
          <li>User ID: {user?.id || 'None'}</li>
        </ul>
      </div>
    </div>
  );
};

export default TestEquipmentDebugPage; 