'use client';

import React, { useState } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/supabase/supabaseClient';

const TestLandInsertPage: React.FC = () => {
  const { user } = useSupabaseAuth();
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testLandInsert = async () => {
    setLoading(true);
    setResult('Testing land insertion...');

    try {
      if (!user) {
        setResult('No user logged in');
        return;
      }

      const testLandData = {
        user_id: user.id,
        title: 'Test Land - ' + new Date().toISOString(),
        description: 'Test land description',
        price: 100000,
        currency: 'DZD',
        listing_type: 'sale',
        area_size: 10,
        area_unit: 'hectare',
        location: 'Test Location',
        soil_type: 'clay',
        water_source: 'well',
        images: ['/placeholder-image.jpg'],
        is_available: true,
        is_featured: false,
        view_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('land_listings')
        .insert([testLandData])
        .select()
        .single();

      if (error) {
        setResult(`Error: ${error.message}`);
      } else {
        setResult(`Success! Land inserted with ID: ${data.id}`);
      }
    } catch (error) {
      setResult(`Exception: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Test Land Insertion</h1>
      
      {!user && (
        <div style={{ color: 'red', marginBottom: '20px' }}>
          No user logged in
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testLandInsert}
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
          {loading ? 'Testing...' : 'Test Land Insert'}
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

export default TestLandInsertPage; 