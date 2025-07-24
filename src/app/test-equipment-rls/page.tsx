'use client';

import React, { useState } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/supabase/supabaseClient';

const TestEquipmentRLSPage: React.FC = () => {
  const { user } = useSupabaseAuth();
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testEquipmentInsert = async () => {
    addResult('Testing equipment insert...');

    try {
      if (!user) {
        addResult('❌ No user logged in');
        return;
      }

      const testData = {
        user_id: user.id,
        title: 'Test Equipment - ' + new Date().toISOString(),
        description: 'Test equipment description',
        price: 50000,
        condition: 'good',
        location: 'Test Location',
        brand: 'Test Brand',
        model: 'Test Model',
        year: 2020,
        hours_used: 100,
        images: ['/placeholder-image.jpg'],
        category_id: undefined,
        currency: 'DZD',
        is_available: true,
        is_featured: false,
        view_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('equipment')
        .insert([testData])
        .select()
        .single();

      if (error) {
        addResult(`❌ Insert failed: ${error.message}`);
      } else {
        addResult(`✅ Insert successful! ID: ${data.id}`);
      }

    } catch (error) {
      addResult(`❌ Exception: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const testEquipmentRead = async () => {
    addResult('Testing equipment read...');

    try {
      // Test 1: Read all equipment
      const { data: allEquipment, error: allError } = await supabase
        .from('equipment')
        .select('*');

      if (allError) {
        addResult(`❌ Read all failed: ${allError.message}`);
      } else {
        addResult(`✅ Read all successful! Found ${allEquipment?.length || 0} equipment items`);
      }

      // Test 2: Read available equipment (what the page should show)
      const { data: availableEquipment, error: availableError } = await supabase
        .from('equipment')
        .select('*')
        .eq('is_available', true);

      if (availableError) {
        addResult(`❌ Read available failed: ${availableError.message}`);
      } else {
        addResult(`✅ Read available successful! Found ${availableEquipment?.length || 0} available equipment items`);
        
        if (availableEquipment && availableEquipment.length > 0) {
          addResult(`📋 Available equipment: ${availableEquipment.map(e => e.title).join(', ')}`);
        }
      }

      // Test 3: Read user's equipment
      if (user) {
        const { data: userEquipment, error: userError } = await supabase
          .from('equipment')
          .select('*')
          .eq('user_id', user.id);

        if (userError) {
          addResult(`❌ Read user equipment failed: ${userError.message}`);
        } else {
          addResult(`✅ Read user equipment successful! Found ${userEquipment?.length || 0} user equipment items`);
        }
      }

    } catch (error) {
      addResult(`❌ Read test exception: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const testEquipmentPageQuery = async () => {
    addResult('Testing equipment page query (same as useEquipment hook)...');

    try {
      // This is the exact query that the equipment page uses
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        addResult(`❌ Equipment page query failed: ${error.message}`);
      } else {
        addResult(`✅ Equipment page query successful! Found ${data?.length || 0} equipment items`);
        
        if (data && data.length > 0) {
          addResult(`📋 Equipment titles: ${data.map(e => e.title).join(', ')}`);
        }
      }

    } catch (error) {
      addResult(`❌ Equipment page query exception: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Equipment RLS & Display Test</h1>
      
      {!user && (
        <div style={{ color: 'red', marginBottom: '20px' }}>
          No user logged in
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testEquipmentInsert}
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
          Test Equipment Insert
        </button>

        <button 
          onClick={testEquipmentRead}
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
          Test Equipment Read
        </button>

        <button 
          onClick={testEquipmentPageQuery}
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
          Test Page Query
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
          <div style={{ color: '#6c757d' }}>Click a test button to start...</div>
        ) : (
          results.map((result, index) => (
            <div key={index} style={{ marginBottom: '5px' }}>
              {result}
            </div>
          ))
        )}
      </div>

      {user && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#e9ecef' }}>
          <strong>User:</strong> {user.email} (ID: {user.id})
        </div>
      )}

      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#fff3cd', border: '1px solid #ffeaa7' }}>
        <strong>What this tests:</strong>
        <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li><strong>Insert:</strong> Tests if equipment can be added to database</li>
          <li><strong>Read:</strong> Tests if equipment can be read from database</li>
          <li><strong>Page Query:</strong> Tests the exact query used by the equipment page</li>
        </ul>
      </div>
    </div>
  );
};

export default TestEquipmentRLSPage; 