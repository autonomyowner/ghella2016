'use client';

import React, { useState } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useEquipment } from '@/hooks/useSupabase';

const TestEquipmentRefreshPage: React.FC = () => {
  const { user } = useSupabaseAuth();
  const { equipment, loading, error, fetchEquipment, addEquipment } = useEquipment();
  const [result, setResult] = useState<string>('');

  const testEquipmentRefresh = async () => {
    setResult('Testing equipment refresh...');

    try {
      if (!user) {
        setResult('❌ No user logged in');
        return;
      }

      // Step 1: Check current equipment count
      const initialCount = equipment.length;
      setResult(`📊 Initial equipment count: ${initialCount}`);

      // Step 2: Add new equipment
      setResult('🔄 Adding new equipment...');
      const newEquipment = {
        title: 'Refresh Test Equipment - ' + new Date().toISOString(),
        description: 'Testing equipment refresh functionality',
        price: 75000,
        condition: 'excellent' as const,
        location: 'Test Location',
        brand: 'Test Brand',
        model: 'Refresh Test',
        year: 2024,
        hours_used: 50,
        images: ['/placeholder-image.jpg'],
        category_id: undefined,
        currency: 'DZD',
        is_available: true,
        is_featured: false,
        view_count: 0
      };

      await addEquipment(newEquipment);
      setResult('✅ Equipment added successfully');

      // Step 3: Wait a moment and check if equipment list refreshed
      setTimeout(() => {
        const newCount = equipment.length;
        if (newCount > initialCount) {
          setResult(`✅ Refresh successful! Equipment count: ${initialCount} → ${newCount}`);
        } else {
          setResult(`❌ Refresh failed! Equipment count still: ${newCount} (expected > ${initialCount})`);
        }
      }, 1000);

    } catch (error) {
      setResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const forceRefresh = async () => {
    setResult('🔄 Force refreshing equipment list...');
    try {
      await fetchEquipment();
      setResult(`✅ Refresh complete! Current equipment count: ${equipment.length}`);
    } catch (error) {
      setResult(`❌ Refresh error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Equipment Refresh Test</h1>
      
      {!user && (
        <div style={{ color: 'red', marginBottom: '20px' }}>
          No user logged in
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testEquipmentRefresh}
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
          {loading ? 'Testing...' : 'Test Equipment Refresh'}
        </button>

        <button 
          onClick={forceRefresh}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: loading ? '#ccc' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Refreshing...' : 'Force Refresh'}
        </button>
      </div>

      <div style={{ 
        padding: '10px', 
        backgroundColor: '#f8f9fa', 
        border: '1px solid #dee2e6',
        borderRadius: '4px',
        marginBottom: '20px'
      }}>
        <strong>Result:</strong> {result}
      </div>

      <div style={{ 
        padding: '10px', 
        backgroundColor: '#e9ecef', 
        border: '1px solid #dee2e6',
        borderRadius: '4px',
        marginBottom: '20px'
      }}>
        <strong>Current Equipment Count:</strong> {equipment.length}
        {equipment.length > 0 && (
          <div style={{ marginTop: '10px' }}>
            <strong>Latest Equipment:</strong>
            <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
              {equipment.slice(0, 3).map((item, index) => (
                <li key={index}>{item.title}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {error && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#f8d7da', 
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          color: '#721c24'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {user && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#e9ecef' }}>
          <strong>User:</strong> {user.email}
        </div>
      )}
    </div>
  );
};

export default TestEquipmentRefreshPage; 