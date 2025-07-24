'use client';

import React, { useState } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/supabase/supabaseClient';

const TestDirectDbPage: React.FC = () => {
  const { user } = useSupabaseAuth();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testDirectQuery = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('Testing direct database query...');
      
      // Test 1: Query all equipment (this should be blocked by RLS)
      const { data: allData, error: allError } = await supabase
        .from('equipment')
        .select('*');

      console.log('All equipment query result:', { data: allData, error: allError });

      // Test 2: Query equipment with is_available filter
      const { data: availableData, error: availableError } = await supabase
        .from('equipment')
        .select('*')
        .eq('is_available', true);

      console.log('Available equipment query result:', { data: availableData, error: availableError });

      // Test 3: Query equipment by user_id (this should work if RLS is set up correctly)
      const { data: userData, error: userError } = await supabase
        .from('equipment')
        .select('*')
        .eq('user_id', user?.id);

      console.log('User equipment query result:', { data: userData, error: userError });

      // Test 4: Check if user has a profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      console.log('Profile query result:', { data: profileData, error: profileError });

      setResults({
        allEquipment: { data: allData, error: allError },
        availableEquipment: { data: availableData, error: availableError },
        userEquipment: { data: userData, error: userError },
        profile: { data: profileData, error: profileError }
      });

    } catch (error) {
      console.error('Error in direct query test:', error);
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const testRlsPolicies = async () => {
    try {
      console.log('Testing RLS policies...');
      
      // Try to query with different conditions to understand RLS behavior
      const { data: noFilterData, error: noFilterError } = await supabase
        .from('equipment')
        .select('*');

      console.log('Query without filters:', { data: noFilterData, error: noFilterError });

      // Try to query with is_available filter
      const { data: availableData, error: availableError } = await supabase
        .from('equipment')
        .select('*')
        .eq('is_available', true);

      console.log('Query with is_available filter:', { data: availableData, error: availableError });

      alert(`No filter query: ${noFilterData?.length || 0} items, Available query: ${availableData?.length || 0} items`);

    } catch (error) {
      console.error('Error testing RLS:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Direct Database Test</h1>
        
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
            onClick={testDirectQuery}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Direct Queries'}
          </button>

          <button
            onClick={testRlsPolicies}
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

        {results && (
          <div className="space-y-6">
            <div className="p-4 bg-white border rounded">
              <h3 className="font-bold mb-2">All Equipment Query:</h3>
              <p><strong>Error:</strong> {results.allEquipment.error?.message || 'None'}</p>
              <p><strong>Count:</strong> {results.allEquipment.data?.length || 0}</p>
              {results.allEquipment.data && results.allEquipment.data.length > 0 && (
                <pre className="mt-2 p-2 bg-gray-100 rounded text-sm overflow-auto">
                  {JSON.stringify(results.allEquipment.data, null, 2)}
                </pre>
              )}
            </div>

            <div className="p-4 bg-white border rounded">
              <h3 className="font-bold mb-2">Available Equipment Query:</h3>
              <p><strong>Error:</strong> {results.availableEquipment.error?.message || 'None'}</p>
              <p><strong>Count:</strong> {results.availableEquipment.data?.length || 0}</p>
              {results.availableEquipment.data && results.availableEquipment.data.length > 0 && (
                <pre className="mt-2 p-2 bg-gray-100 rounded text-sm overflow-auto">
                  {JSON.stringify(results.availableEquipment.data, null, 2)}
                </pre>
              )}
            </div>

            <div className="p-4 bg-white border rounded">
              <h3 className="font-bold mb-2">User Equipment Query:</h3>
              <p><strong>Error:</strong> {results.userEquipment.error?.message || 'None'}</p>
              <p><strong>Count:</strong> {results.userEquipment.data?.length || 0}</p>
              {results.userEquipment.data && results.userEquipment.data.length > 0 && (
                <pre className="mt-2 p-2 bg-gray-100 rounded text-sm overflow-auto">
                  {JSON.stringify(results.userEquipment.data, null, 2)}
                </pre>
              )}
            </div>

            <div className="p-4 bg-white border rounded">
              <h3 className="font-bold mb-2">User Profile:</h3>
              <p><strong>Error:</strong> {results.profile.error?.message || 'None'}</p>
              {results.profile.data && (
                <pre className="mt-2 p-2 bg-gray-100 rounded text-sm overflow-auto">
                  {JSON.stringify(results.profile.data, null, 2)}
                </pre>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestDirectDbPage; 