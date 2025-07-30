'use client';

import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useState } from 'react';

export default function TestAuthStatus() {
  const { user, profile, loading, session } = useSupabaseAuth();
  const [testResult, setTestResult] = useState<string>('');

  const testEquipmentPosting = async () => {
    try {
      setTestResult('Testing equipment posting...');
      
      if (!user) {
        setTestResult('❌ No user found - please login first');
        return;
      }

      const testEquipment = {
        user_id: user.id,
        title: 'Test Equipment ' + Date.now(),
        description: 'This is a test equipment posting',
        price: 100000,
        currency: 'DZD',
        condition: 'good',
        location: 'Test Location',
        contact_phone: '+213 555 123 456',
        images: [],
        is_available: true,
        is_featured: false,
        view_count: 0,
        coordinates: null
      };

      const response = await fetch('/api/test-equipment-insert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testEquipment),
      });

      const result = await response.json();

      if (!response.ok) {
        setTestResult('❌ Error: ' + (result.error || 'Unknown error'));
      } else {
        setTestResult('✅ Equipment posted successfully!');
      }
    } catch (error) {
      setTestResult('❌ Error: ' + (error as Error).message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-800 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 Authentication & Equipment Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Auth Status */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">🔐 Authentication Status</h2>
            
            <div className="space-y-4">
              <div>
                <span className="font-medium">Loading:</span> 
                <span className={`ml-2 ${loading ? 'text-yellow-400' : 'text-green-400'}`}>
                  {loading ? 'Yes' : 'No'}
                </span>
              </div>
              
              <div>
                <span className="font-medium">User:</span> 
                <span className={`ml-2 ${user ? 'text-green-400' : 'text-red-400'}`}>
                  {user ? 'Logged In' : 'Not Logged In'}
                </span>
              </div>
              
              <div>
                <span className="font-medium">User ID:</span> 
                <span className="ml-2 text-gray-300">
                  {user?.id || 'None'}
                </span>
              </div>
              
              <div>
                <span className="font-medium">Profile:</span> 
                <span className={`ml-2 ${profile ? 'text-green-400' : 'text-red-400'}`}>
                  {profile ? 'Loaded' : 'Not Loaded'}
                </span>
              </div>
              
              <div>
                <span className="font-medium">Profile Name:</span> 
                <span className="ml-2 text-gray-300">
                  {profile?.full_name || 'None'}
                </span>
              </div>
              
              <div>
                <span className="font-medium">Session:</span> 
                <span className={`ml-2 ${session ? 'text-green-400' : 'text-red-400'}`}>
                  {session ? 'Active' : 'No Session'}
                </span>
              </div>
            </div>
          </div>

          {/* Equipment Test */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">🚜 Equipment Test</h2>
            
            <button
              onClick={testEquipmentPosting}
              disabled={!user || loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              Test Equipment Posting
            </button>
            
            {testResult && (
              <div className="mt-4 p-4 bg-white/10 rounded-lg">
                <p className="text-sm">{testResult}</p>
              </div>
            )}
          </div>
        </div>

        {/* Debug Info */}
        <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">🐛 Debug Information</h2>
          
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">User Object:</span>
              <pre className="mt-2 p-2 bg-black/20 rounded text-xs overflow-x-auto">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
            
            <div>
              <span className="font-medium">Profile Object:</span>
              <pre className="mt-2 p-2 bg-black/20 rounded text-xs overflow-x-auto">
                {JSON.stringify(profile, null, 2)}
              </pre>
            </div>
            
            <div>
              <span className="font-medium">Session Object:</span>
              <pre className="mt-2 p-2 bg-black/20 rounded text-xs overflow-x-auto">
                {JSON.stringify(session, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 