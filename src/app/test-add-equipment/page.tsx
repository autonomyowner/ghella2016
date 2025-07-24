'use client';

import React, { useState } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useEquipment } from '@/hooks/useSupabase';

const TestAddEquipmentPage: React.FC = () => {
  const { user } = useSupabaseAuth();
  const { addEquipment } = useEquipment();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const testAddEquipment = async () => {
    if (!user) {
      setError('No user logged in');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Testing equipment addition...');
      console.log('User:', user);
      
      const testEquipmentData = {
        user_id: user.id,
        title: 'Test Equipment',
        description: 'Test description',
        price: 50000,
        currency: 'DZD',
        condition: 'good' as const,
        location: 'Test Location',
        brand: 'Test Brand',
        model: 'Test Model',
        year: 2020,
        hours_used: 100,
        images: [],
        is_available: true,
        is_featured: false,
        view_count: 0,
      };

      console.log('Test equipment data:', testEquipmentData);

      const result = await addEquipment(testEquipmentData);
      console.log('Equipment added successfully:', result);
      setSuccess(true);
    } catch (error) {
      console.error('Error adding equipment:', error);
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Test Add Equipment</h1>
        
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
            Equipment added successfully!
          </div>
        )}

        <button
          onClick={testAddEquipment}
          disabled={!user || loading}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Test Add Equipment'}
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

export default TestAddEquipmentPage; 