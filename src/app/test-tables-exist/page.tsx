'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/supabaseClient';

export default function TestTablesExist() {
  const [tables, setTables] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tableStatus, setTableStatus] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    async function checkTables() {
      try {
        console.log('🔍 Checking which tables exist...');
        
        // Test specific tables we need by trying to query them
        const requiredTables = ['vegetables', 'land_listings', 'equipment', 'nurseries', 'animal_listings', 'labor', 'analysis', 'delivery'];
        const existingTables: string[] = [];
        const status: {[key: string]: boolean} = {};
        
        console.log('🧪 Testing required tables...');
        for (const tableName of requiredTables) {
          try {
            console.log(`Testing table: ${tableName}`);
            const { data, error } = await supabase
              .from(tableName)
              .select('*')
              .limit(1);
            
            if (error) {
              console.error(`❌ Table ${tableName}: ${error.message}`);
              status[tableName] = false;
            } else {
              console.log(`✅ Table ${tableName}: exists and accessible`);
              existingTables.push(tableName);
              status[tableName] = true;
            }
          } catch (err) {
            console.error(`❌ Table ${tableName}: ${err instanceof Error ? err.message : 'Unknown error'}`);
            status[tableName] = false;
          }
        }

        console.log('✅ Existing tables:', existingTables);
        setTables(existingTables);
        setTableStatus(status);

        // Also test some common tables that might exist
        const commonTables = ['profiles', 'categories', 'messages', 'reviews', 'favorites'];
        for (const tableName of commonTables) {
          try {
            const { data, error } = await supabase
              .from(tableName)
              .select('*')
              .limit(1);
            
            if (!error && !existingTables.includes(tableName)) {
              console.log(`✅ Additional table ${tableName}: exists`);
              existingTables.push(tableName);
            }
          } catch (err) {
            // Ignore errors for additional tables
          }
        }

        setTables(existingTables);

      } catch (err) {
        console.error('❌ Unexpected error:', err);
        setError(`Unexpected error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    }

    checkTables();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🗄️ Database Tables Check</h1>
        
        {loading && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
            🔍 Checking database tables...
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            ❌ Error: {error}
          </div>
        )}

        {tables.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">📋 Available Tables ({tables.length})</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {tables.map((table, index) => (
                <div key={index} className="bg-green-50 p-3 rounded border border-green-200">
                  <span className="font-mono text-sm text-green-800">✅ {table}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">🎯 Required Tables Status</h2>
          <div className="space-y-2">
            {['vegetables', 'land_listings', 'equipment', 'nurseries', 'animal_listings', 'labor', 'analysis', 'delivery'].map(table => (
              <div key={table} className="flex items-center space-x-2">
                <span className={`w-3 h-3 rounded-full ${tableStatus[table] ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span className="font-mono">{table}</span>
                <span className="text-sm text-gray-500">
                  {tableStatus[table] ? '✅ Found' : '❌ Missing'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">🔧 Debug Information</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Total Tables Found:</strong> {tables.length}</p>
            <p><strong>Required Tables:</strong> 8</p>
            <p><strong>Missing Tables:</strong> {8 - Object.values(tableStatus).filter(Boolean).length}</p>
            <p><strong>Status:</strong> {loading ? 'Checking...' : error ? 'Error' : 'Complete'}</p>
          </div>
        </div>

        {Object.values(tableStatus).some(Boolean) && (
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-yellow-800">⚠️ Important Note</h2>
            <p className="text-yellow-700">
              Some tables exist and work (like land_listings and equipment), but others are missing. 
              This explains why some marketplace sections work while others don't.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 