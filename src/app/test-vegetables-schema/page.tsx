'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/supabaseClient';

export default function TestVegetablesSchema() {
  const [schemaInfo, setSchemaInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tableExists, setTableExists] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkSchema() {
      try {
        console.log('🔍 Checking vegetables table...');
        
        // First, check if the table exists
        const { data: tableData, error: tableError } = await supabase
          .from('vegetables')
          .select('*')
          .limit(1);

        if (tableError) {
          console.error('❌ Vegetables table error:', tableError);
          setTableExists(false);
          setError(`Table error: ${tableError.message} - ${tableError.details || tableError.hint || 'No additional details'}`);
          return;
        }

        console.log('✅ Vegetables table exists and is accessible');
        setTableExists(true);

        // Try to get a sample record to understand the structure
        const { data: sampleData, error: sampleError } = await supabase
          .from('vegetables')
          .select('*')
          .limit(1);

        if (sampleError) {
          console.error('❌ Error getting sample data:', sampleError);
          setError(`Sample data error: ${sampleError.message}`);
          return;
        }

        console.log('📋 Sample data structure:', sampleData);

        // Try a simple insert to see what happens
        console.log('🧪 Testing simple insert...');
        const testData = {
          title: 'Test Vegetable',
          description: 'Test description',
          price: 10.50,
          quantity: 5,
          location: 'Test Location',
          vegetable_type: 'tomatoes',
          is_available: true,
          is_featured: false,
          view_count: 0,
          images: [],
          user_id: 'test-user-id',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        console.log('📝 Test data:', testData);

        const { data: insertData, error: insertError } = await supabase
          .from('vegetables')
          .insert([testData])
          .select()
          .single();

        if (insertError) {
          console.error('❌ Insert test failed:', insertError);
          console.error('Insert error details:', {
            code: insertError.code,
            message: insertError.message,
            details: insertError.details,
            hint: insertError.hint
          });
          setError(`Insert test failed: ${insertError.message} - ${insertError.details || insertError.hint || 'No additional details'}`);
        } else {
          console.log('✅ Insert test successful:', insertData);
          setSchemaInfo({
            sampleData: sampleData[0] || {},
            insertResult: insertData,
            columns: Object.keys(insertData || {})
          });
          // Clean up test data
          await supabase.from('vegetables').delete().eq('id', insertData.id);
        }

      } catch (err) {
        console.error('❌ Unexpected error:', err);
        setError(`Unexpected error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    }

    checkSchema();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🧪 Vegetables Table Test</h1>
        
        {loading && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
            🔍 Checking vegetables table...
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            ❌ Error: {error}
          </div>
        )}

        {tableExists === false && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-red-800">❌ Table Missing</h2>
            <p className="text-red-700">
              The vegetables table does not exist in your database. This is why the vegetables form is failing.
            </p>
          </div>
        )}

        {schemaInfo && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">📋 Vegetables Table Structure</h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">🔍 Available Columns ({schemaInfo.columns.length})</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {schemaInfo.columns.map((column: string, index: number) => (
                  <div key={index} className="bg-gray-50 p-2 rounded border">
                    <span className="font-mono text-sm">{column}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">📝 Sample Data Structure</h3>
              <pre className="bg-gray-50 p-4 rounded border overflow-x-auto text-sm">
                {JSON.stringify(schemaInfo.sampleData, null, 2)}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">✅ Insert Test Result</h3>
              <pre className="bg-green-50 p-4 rounded border overflow-x-auto text-sm">
                {JSON.stringify(schemaInfo.insertResult, null, 2)}
              </pre>
            </div>
          </div>
        )}

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">🔧 Debug Information</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Table:</strong> vegetables</p>
            <p><strong>Schema:</strong> public</p>
            <p><strong>Table Exists:</strong> {tableExists === null ? 'Checking...' : tableExists ? '✅ Yes' : '❌ No'}</p>
            <p><strong>Total Columns:</strong> {schemaInfo?.columns?.length || 0}</p>
            <p><strong>Status:</strong> {loading ? 'Checking...' : error ? 'Error' : 'Ready'}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 