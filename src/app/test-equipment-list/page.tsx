'use client';

import React, { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/supabase/supabaseClient';

const TestEquipmentListPage: React.FC = () => {
  const { user } = useSupabaseAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [equipment, setEquipment] = useState<any[]>([]);
  const [rawData, setRawData] = useState<any>(null);

  const testFetchEquipment = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('Testing equipment fetch...');
      
      // Test basic query without RLS
      const { data: allData, error: allError } = await supabase
        .from('equipment')
        .select('*')
        .limit(10);

      if (allError) {
        console.error('Error fetching all equipment:', allError);
        setError(`Error: ${allError.message}`);
      } else {
        console.log('All equipment data:', allData);
        setRawData(allData);
      }

      // Test with RLS (should only show available equipment)
      const { data: availableData, error: availableError } = await supabase
        .from('equipment')
        .select('*')
        .eq('is_available', true)
        .order('created_at', { ascending: false })
        .limit(10);

      if (availableError) {
        console.error('Error fetching available equipment:', availableError);
        setError(`Error: ${availableError.message}`);
      } else {
        console.log('Available equipment data:', availableData);
        setEquipment(availableData || []);
      }

    } catch (error) {
      console.error('Error:', error);
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const checkRlsPolicies = async () => {
    try {
      console.log('Checking RLS policies...');
      
      // Try to insert a test record to see if RLS allows it
      const testRecord = {
        title: 'Test Equipment RLS',
        description: 'Testing RLS policies',
        price: 1000,
        currency: 'DZD',
        condition: 'good',
        location: 'Test Location',
        user_id: user?.id,
        is_available: true,
      };

      const { data, error } = await supabase
        .from('equipment')
        .insert([testRecord])
        .select()
        .single();

      if (error) {
        console.error('RLS test failed:', error);
        setError(`RLS Error: ${error.message}`);
      } else {
        console.log('RLS test successful:', data);
        // Delete the test record
        await supabase
          .from('equipment')
          .delete()
          .eq('id', data.id);
        setError('RLS test successful - record was created and deleted');
      }
    } catch (error) {
      console.error('RLS test error:', error);
      setError((error as Error).message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Test Equipment List</h1>
        
        {!user && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            No user logged in
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="flex gap-4 mb-6">
          <button
            onClick={testFetchEquipment}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Fetch Equipment'}
          </button>

          <button
            onClick={checkRlsPolicies}
            disabled={!user || loading}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            Test RLS Policies
          </button>
        </div>

        {user && (
          <div className="mb-6 p-4 bg-gray-200 rounded">
            <h3 className="font-bold">User Info:</h3>
            <p>ID: {user.id}</p>
            <p>Email: {user.email}</p>
          </div>
        )}

        {equipment.length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold text-lg mb-2">Available Equipment ({equipment.length}):</h3>
            <div className="grid gap-4">
              {equipment.map((item) => (
                <div key={item.id} className="p-4 bg-white rounded shadow">
                  <h4 className="font-bold">{item.title}</h4>
                  <p>Price: {item.price} {item.currency}</p>
                  <p>Location: {item.location}</p>
                  <p>Condition: {item.condition}</p>
                  <p>User ID: {item.user_id}</p>
                  <p>Created: {new Date(item.created_at).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {rawData && (
          <div className="mb-6">
            <h3 className="font-bold text-lg mb-2">Raw Database Data ({rawData.length}):</h3>
            <pre className="bg-gray-800 text-green-400 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(rawData, null, 2)}
            </pre>
          </div>
        )}

        {equipment.length === 0 && !loading && !error && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            No equipment found in database
          </div>
        )}
      </div>
    </div>
  );
};

export default TestEquipmentListPage; 