'use client';

import React, { useState } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useSupabaseData } from '@/hooks/useSupabase';

const TestAddLandPage: React.FC = () => {
  const { user } = useSupabaseAuth();
  const { addLand } = useSupabaseData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const testAddLand = async () => {
    if (!user) {
      setError('No user logged in');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Testing land addition...');
      console.log('User:', user);
      
      const testLandData = {
        user_id: user.id,
        title: 'Test Land',
        description: 'Test description',
        price: 100000,
        currency: 'DZD',
        listing_type: 'sale',
        area_size: 10.5,
        area_unit: 'hectare',
        location: 'Test Location',
        soil_type: 'Test Soil',
        water_source: 'Test Water',
        images: [],
        is_available: true,
        is_featured: false,
        view_count: 0,
      };

      console.log('Test land data:', testLandData);

      const result = await addLand(testLandData);
      console.log('Land added successfully:', result);
      setSuccess(true);
    } catch (error) {
      console.error('Error adding land:', error);
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Test Add Land</h1>
        
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

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Land added successfully!
          </div>
        )}

        <button
          onClick={testAddLand}
          disabled={!user || loading}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Test Add Land'}
        </button>

        {user && (
          <div className="mt-4 p-4 bg-gray-200 rounded">
            <h3 className="font-bold">User Info:</h3>
            <p>ID: {user.id}</p>
            <p>Email: {user.email}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestAddLandPage; 