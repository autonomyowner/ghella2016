'use client';

import React from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useEquipment } from '@/hooks/useSupabase';

const TestEquipmentPage: React.FC = () => {
  const { user } = useSupabaseAuth();
  const { equipment, loading, error } = useEquipment();

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Equipment Page Test</h1>
      
      {!user && (
        <div style={{ color: 'red', marginBottom: '20px' }}>
          No user logged in
        </div>
      )}

      <div style={{ 
        padding: '10px', 
        backgroundColor: '#e9ecef', 
        border: '1px solid #dee2e6',
        borderRadius: '4px',
        marginBottom: '20px'
      }}>
        <strong>Equipment Hook Status:</strong>
        <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
          <li>Loading: {loading ? 'Yes' : 'No'}</li>
          <li>Equipment Count: {equipment.length}</li>
          <li>Error: {error || 'None'}</li>
          <li>User: {user ? user.email : 'Not logged in'}</li>
        </ul>
      </div>

      {loading && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#fff3cd', 
          border: '1px solid #ffeaa7',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          ⏳ Loading equipment...
        </div>
      )}

      {error && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#f8d7da', 
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          color: '#721c24',
          marginBottom: '20px'
        }}>
          ❌ Error: {error}
        </div>
      )}

      {!loading && !error && equipment.length === 0 && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#d1ecf1', 
          border: '1px solid #bee5eb',
          borderRadius: '4px',
          color: '#0c5460',
          marginBottom: '20px'
        }}>
          📭 No equipment found
        </div>
      )}

      {!loading && !error && equipment.length > 0 && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#d4edda', 
          border: '1px solid #c3e6cb',
          borderRadius: '4px',
          color: '#155724',
          marginBottom: '20px'
        }}>
          ✅ Found {equipment.length} equipment items
        </div>
      )}

      {equipment.length > 0 && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#f8f9fa', 
          border: '1px solid #dee2e6',
          borderRadius: '4px'
        }}>
          <strong>Equipment List:</strong>
          <div style={{ marginTop: '10px' }}>
            {equipment.map((item, index) => (
              <div key={item.id || index} style={{ 
                padding: '8px', 
                margin: '5px 0', 
                backgroundColor: 'white', 
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}>
                <strong>{item.title}</strong>
                <br />
                <small>Price: {item.price} {item.currency}</small>
                <br />
                <small>Location: {item.location}</small>
                <br />
                <small>Condition: {item.condition}</small>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#fff3cd', border: '1px solid #ffeaa7' }}>
        <strong>Debug Info:</strong>
        <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
          <li>This page uses the same useEquipment hook as the main equipment page</li>
          <li>If equipment shows here but not on the main page, the issue is in the main page component</li>
          <li>If equipment doesn't show here, the issue is in the useEquipment hook</li>
        </ul>
      </div>
    </div>
  );
};

export default TestEquipmentPage; 