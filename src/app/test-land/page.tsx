'use client';

import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/lib/firebaseConfig';

export default function TestLandPage() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addLog = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testFirebaseConnection = async () => {
    setLoading(true);
    setTestResults([]);
    
    try {
      addLog('Testing Firebase connection...');
      
      // Test 1: Check if we can access the collection
      addLog('Step 1: Checking land_listings collection...');
      const collectionRef = collection(firestore, 'land_listings');
      addLog('Collection reference created successfully');
      
      // Test 2: Try to get all documents
      addLog('Step 2: Fetching all documents...');
      const snapshot = await getDocs(collectionRef);
      addLog(`Found ${snapshot.docs.length} documents in land_listings collection`);
      
      // Test 3: Log each document
      snapshot.docs.forEach((doc, index) => {
        const data = doc.data();
        addLog(`Document ${index + 1} (ID: ${doc.id}):`);
        addLog(`  - Title: ${data.title || 'No title'}`);
        addLog(`  - Price: ${data.price || 'No price'}`);
        addLog(`  - Available: ${data.is_available}`);
        addLog(`  - Created: ${data.created_at ? 'Yes' : 'No'}`);
      });
      
      // Test 4: Add a test document
      addLog('Step 3: Adding test document...');
      const testDoc = await addDoc(collection(firestore, 'land_listings'), {
        title: 'Test Land - ' + new Date().toISOString(),
        description: 'This is a test land listing',
        price: 100000,
        currency: 'DZD',
        listing_type: 'sale',
        area_size: 10,
        area_unit: 'hectare',
        location: 'Test Location',
        is_available: true,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      });
      addLog(`Test document added with ID: ${testDoc.id}`);
      
      // Test 5: Fetch again to see the new document
      addLog('Step 4: Fetching documents again...');
      const newSnapshot = await getDocs(collectionRef);
      addLog(`Now found ${newSnapshot.docs.length} documents`);
      
      addLog('✅ All tests completed successfully!');
      
    } catch (error) {
      addLog(`❌ Error: ${error}`);
      console.error('Test error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Land Listings Debug Test</h1>
        
        <button
          onClick={testFirebaseConnection}
          disabled={loading}
          className="mb-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Running Tests...' : 'Run Firebase Tests'}
        </button>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Test Results:</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm max-h-96 overflow-y-auto">
            {testResults.length === 0 ? (
              <p>No tests run yet. Click the button above to start testing.</p>
            ) : (
              testResults.map((result, index) => (
                <div key={index} className="mb-1">{result}</div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
