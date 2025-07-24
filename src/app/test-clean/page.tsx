'use client';

import React, { useState } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/supabase/supabaseClient';

const TestCleanPage: React.FC = () => {
  const { user } = useSupabaseAuth();
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testEquipment = async () => {
    setLoading(true);
    setResult('Testing...');

    try {
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .eq('is_available', true);

      if (error) {
        setResult(`Error: ${error.message}`);
      } else {
        setResult(`Found ${data?.length || 0} equipment items`);
        if (data && data.length > 0) {
          setResult(`Found ${data.length} equipment items: ${data.map(item => item.title).join(', ')}`);
        }
      }
    } catch (error) {
      setResult(`Exception: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Clean Equipment Test</h1>
      
      {!user && (
        <div style={{ color: 'red', marginBottom: '20px' }}>
          No user logged in
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testEquipment}
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
          {loading ? 'Testing...' : 'Test Equipment'}
        </button>
      </div>

      <div style={{ 
        padding: '10px', 
        backgroundColor: '#f8f9fa', 
        border: '1px solid #dee2e6',
        borderRadius: '4px'
      }}>
        <strong>Result:</strong> {result}
      </div>

      {user && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#e9ecef' }}>
          <strong>User:</strong> {user.email}
        </div>
      )}
    </div>
  );
};

export default TestCleanPage; 