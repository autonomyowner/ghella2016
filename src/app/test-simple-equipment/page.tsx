'use client';

import React, { useState, useEffect } from 'react';
import { useEquipment } from '@/hooks/useSupabase';

const TestSimpleEquipmentPage: React.FC = () => {
  const { equipment, loading, error, fetchEquipment } = useEquipment();
  const [message, setMessage] = useState('');

  useEffect(() => {
    const testFetch = async () => {
      setMessage('Testing equipment fetch...');
      try {
        const result = await fetchEquipment();
        setMessage(`Fetch completed. Found ${result?.length || 0} equipment items.`);
      } catch (err) {
        setMessage(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    };

    testFetch();
  }, [fetchEquipment]);

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Simple Equipment Test</h1>
        
        <div className="mb-4 p-4 bg-blue-100 border border-blue-400 rounded">
          <p><strong>Status:</strong> {message}</p>
          <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
          <p><strong>Error:</strong> {error || 'None'}</p>
          <p><strong>Equipment Count:</strong> {equipment.length}</p>
        </div>

        {equipment.length > 0 && (
          <div className="mb-4">
            <h2 className="text-lg font-bold mb-2">Equipment Found:</h2>
            <div className="space-y-2">
              {equipment.map((item) => (
                <div key={item.id} className="p-3 bg-white border rounded">
                  <p><strong>Title:</strong> {item.title}</p>
                  <p><strong>Price:</strong> {item.price} {item.currency}</p>
                  <p><strong>Location:</strong> {item.location}</p>
                  <p><strong>Available:</strong> {item.is_available ? 'Yes' : 'No'}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {equipment.length === 0 && !loading && !error && (
          <div className="p-4 bg-yellow-100 border border-yellow-400 rounded">
            No equipment found in database
          </div>
        )}
      </div>
    </div>
  );
};

export default TestSimpleEquipmentPage; 