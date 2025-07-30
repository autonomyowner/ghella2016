'use client';

import { useState } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useRouter } from 'next/navigation';

export default function TestLogin() {
  const { signIn, user, loading } = useSupabaseAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Logging in...');

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        setMessage('❌ Login failed: ' + error.message);
      } else {
        setMessage('✅ Login successful! Redirecting...');
        setTimeout(() => {
          router.push('/test-auth-status');
        }, 2000);
      }
    } catch (error) {
      setMessage('❌ Error: ' + (error as Error).message);
    }
  };

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-800 text-white p-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">✅ Already Logged In</h1>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <p className="text-center mb-4">You are already logged in as:</p>
            <p className="text-center font-semibold">{user.email}</p>
            <button
              onClick={() => router.push('/test-auth-status')}
              className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              Check Auth Status
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-800 text-white p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">🔐 Test Login</h1>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/50"
                placeholder="your@email.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/50"
                placeholder="Your password"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          
          {message && (
            <div className="mt-4 p-4 bg-white/10 rounded-lg">
              <p className="text-sm">{message}</p>
            </div>
          )}
        </div>

        <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">📝 Test Credentials</h3>
          <p className="text-sm mb-2">Try these test credentials:</p>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Email:</span> test@example.com
            </div>
            <div>
              <span className="font-medium">Password:</span> test123
            </div>
          </div>
          <button
            onClick={() => {
              setEmail('test@example.com');
              setPassword('test123');
            }}
            className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Fill Test Credentials
          </button>
        </div>
      </div>
    </div>
  );
} 