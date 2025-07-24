'use client';

import React, { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/supabase/supabaseClient';

const TestDbConnectionPage: React.FC = () => {
  const { user } = useSupabaseAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>('');

  const testConnection = async () => {
    if (!user) {
      setError('No user logged in');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Testing database connection...');
      
      // Test basic connection
      const { data: testData, error: testError } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);

      if (testError) {
        throw testError;
      }

      setConnectionStatus('Database connection successful');

      // Get user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Profile error:', profileError);
        setError(`Profile error: ${profileError.message}`);
      } else {
        setProfile(profileData);
        console.log('User profile:', profileData);
      }

    } catch (error) {
      console.error('Connection error:', error);
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const newProfile = {
        id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        full_name: null,
        phone: null,
        location: null,
        avatar_url: null,
        user_type: 'farmer' as const,
        is_verified: false,
        bio: null,
        website: null,
        social_links: {},
      };

      const { data, error } = await supabase
        .from('profiles')
        .insert([newProfile])
        .select()
        .single();

      if (error) {
        throw error;
      }

      setProfile(data);
      console.log('Profile created:', data);
    } catch (error) {
      console.error('Error creating profile:', error);
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Test Database Connection</h1>
        
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

        {connectionStatus && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {connectionStatus}
          </div>
        )}

        <button
          onClick={testConnection}
          disabled={!user || loading}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 mb-4"
        >
          {loading ? 'Testing...' : 'Test Connection'}
        </button>

        {user && !profile && (
          <button
            onClick={createProfile}
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            Create Profile
          </button>
        )}

        {user && (
          <div className="mt-4 p-4 bg-gray-200 rounded">
            <h3 className="font-bold">User Info:</h3>
            <p>ID: {user.id}</p>
            <p>Email: {user.email}</p>
          </div>
        )}

        {profile && (
          <div className="mt-4 p-4 bg-blue-200 rounded">
            <h3 className="font-bold">Profile Info:</h3>
            <p>ID: {profile.id}</p>
            <p>User Type: {profile.user_type}</p>
            <p>Verified: {profile.is_verified ? 'Yes' : 'No'}</p>
            <p>Created: {new Date(profile.created_at).toLocaleString()}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestDbConnectionPage; 