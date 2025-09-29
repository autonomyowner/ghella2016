'use client';

import React, { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useSupabaseData } from '@/hooks/useSupabase';
import { supabase } from '@/lib/supabase/supabaseClient';

const TestAuthFixPage: React.FC = () => {
  const { user, session, loading: authLoading } = useSupabaseAuth();
  const { addLand } = useSupabaseData();
  const [testResult, setTestResult] = useState<string>('');
  const [isTesting, setIsTesting] = useState(false);

  const testAuth = async () => {
    setIsTesting(true);
    setTestResult('Testing authentication...\n');
    
    try {
      // Test 1: Check session
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setTestResult(prev => prev + `Session: ${currentSession ? 'Found' : 'Not found'}\n`);
      
      if (currentSession?.user) {
        setTestResult(prev => prev + `User ID: ${currentSession.user.id}\n`);
        setTestResult(prev => prev + `User Email: ${currentSession.user.email}\n`);
        
        // Test 2: Test database connection
        setTestResult(prev => prev + 'Testing database connection...\n');
        const { data, error } = await supabase
          .from('profiles')
          .select('id, user_type')
          .eq('id', currentSession.user.id)
          .single();
        
        if (error) {
          setTestResult(prev => prev + `Database error: ${error.message}\n`);
        } else {
          setTestResult(prev => prev + `Profile found: ${data?.user_type}\n`);
        }
        
        // Test 3: Test land insertion
        setTestResult(prev => prev + 'Testing land insertion...\n');
        const testLandData = {
          user_id: currentSession.user.id,
          title: 'Test Land - ' + new Date().toISOString(),
          description: 'Test description',
          price: 100000,
          currency: 'DZD',
          listing_type: 'sale',
          area_size: 5.0,
          area_unit: 'hectare',
          location: 'Test Location',
          contact_phone: '123456789',
          water_source: 'Test Water',
          images: [],
          is_available: true,
          is_featured: false,
          view_count: 0
        };
        
        try {
          const newLand = await addLand(testLandData);
          setTestResult(prev => prev + `✅ Land created successfully: ${newLand.id}\n`);
        } catch (landError) {
          setTestResult(prev => prev + `❌ Land creation failed: ${landError}\n`);
        }
      } else {
        setTestResult(prev => prev + 'No authenticated user found\n');
      }
    } catch (error) {
      setTestResult(prev => prev + `Error: ${error}\n`);
    } finally {
      setIsTesting(false);
    }
  };

  const clearTest = () => {
    setTestResult('');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Authentication & Database Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Current Status</h2>
          <div className="space-y-2">
            <p><strong>Auth Loading:</strong> {authLoading ? 'Yes' : 'No'}</p>
            <p><strong>User:</strong> {user ? user.email : 'Not logged in'}</p>
            <p><strong>Session:</strong> {session ? 'Active' : 'None'}</p>
            <p><strong>User ID:</strong> {user?.id || 'N/A'}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
          <div className="space-x-4">
            <button
              onClick={testAuth}
              disabled={isTesting}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {isTesting ? 'Testing...' : 'Run Test'}
            </button>
            <button
              onClick={clearTest}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Clear Results
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm whitespace-pre-wrap">
            {testResult || 'No test results yet. Click "Run Test" to start.'}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default TestAuthFixPage;

