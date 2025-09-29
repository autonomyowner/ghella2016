'use client';

import React, { useState } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/supabase/supabaseClient';

const TestLoginPage: React.FC = () => {
  const { user, session, loading, signIn, signOut } = useSupabaseAuth();
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [testResult, setTestResult] = useState<string>('');
  const [isTesting, setIsTesting] = useState(false);

  const testLogin = async () => {
    setIsTesting(true);
    setTestResult('Testing login...\n');
    
    try {
      // Test direct Supabase login
      setTestResult(prev => prev + 'Attempting direct Supabase login...\n');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        setTestResult(prev => prev + `Direct login error: ${error.message}\n`);
      } else {
        setTestResult(prev => prev + `Direct login success: ${data.user?.email}\n`);
      }
      
      // Test context login
      setTestResult(prev => prev + 'Testing context login...\n');
      const { error: contextError } = await signIn(email, password);
      
      if (contextError) {
        setTestResult(prev => prev + `Context login error: ${contextError.message}\n`);
      } else {
        setTestResult(prev => prev + `Context login success\n`);
      }
      
      // Check session after login
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setTestResult(prev => prev + `Session after login: ${currentSession ? 'Found' : 'Not found'}\n`);
      
      if (currentSession?.user) {
        setTestResult(prev => prev + `User ID: ${currentSession.user.id}\n`);
        setTestResult(prev => prev + `User Email: ${currentSession.user.email}\n`);
      }
      
    } catch (error) {
      setTestResult(prev => prev + `Error: ${error}\n`);
    } finally {
      setIsTesting(false);
    }
  };

  const testLogout = async () => {
    try {
      await signOut();
      setTestResult(prev => prev + 'Logged out successfully\n');
    } catch (error) {
      setTestResult(prev => prev + `Logout error: ${error}\n`);
    }
  };

  const clearTest = () => {
    setTestResult('');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Login Test Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Current Status</h2>
          <div className="space-y-2">
            <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
            <p><strong>User:</strong> {user ? user.email : 'Not logged in'}</p>
            <p><strong>Session:</strong> {session ? 'Active' : 'None'}</p>
            <p><strong>User ID:</strong> {user?.id || 'N/A'}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Login</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="space-x-4">
              <button
                onClick={testLogin}
                disabled={isTesting}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {isTesting ? 'Testing...' : 'Test Login'}
              </button>
              <button
                onClick={testLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
              <button
                onClick={clearTest}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Clear Results
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm whitespace-pre-wrap">
            {testResult || 'No test results yet. Click "Test Login" to start.'}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default TestLoginPage;