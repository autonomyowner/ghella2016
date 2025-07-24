'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase/supabaseClient';

interface TableTest {
  name: string;
  status: 'pending' | 'success' | 'error';
  count: number;
  error?: string;
}

const TestDatabaseStructurePage: React.FC = () => {
  const [tests, setTests] = useState<TableTest[]>([
    { name: 'equipment', status: 'pending', count: 0 },
    { name: 'animal_listings', status: 'pending', count: 0 },
    { name: 'land_listings', status: 'pending', count: 0 },
    { name: 'nurseries', status: 'pending', count: 0 },
    { name: 'vegetables', status: 'pending', count: 0 },
    { name: 'labor', status: 'pending', count: 0 },
    { name: 'analysis', status: 'pending', count: 0 },
    { name: 'delivery', status: 'pending', count: 0 },
    { name: 'categories', status: 'pending', count: 0 },
    { name: 'profiles', status: 'pending', count: 0 },
    { name: 'messages', status: 'pending', count: 0 }
  ]);

  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testTable = async (tableName: string) => {
    try {
      const { data, error, count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });

      if (error) {
        throw error;
      }

      return { success: true, count: count || 0 };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    addResult('=== بدء اختبار هيكل قاعدة البيانات ===');

    for (const test of tests) {
      addResult(`اختبار جدول ${test.name}...`);
      
      const result = await testTable(test.name);
      
      if (result.success) {
                 setTests(prev => prev.map(t => 
           t.name === test.name 
             ? { ...t, status: 'success', count: result.count || 0 }
             : t
         ));
        addResult(`✅ ${test.name}: ${result.count} صف`);
      } else {
        setTests(prev => prev.map(t => 
          t.name === test.name 
            ? { ...t, status: 'error', error: result.error }
            : t
        ));
        addResult(`❌ ${test.name}: ${result.error}`);
      }
    }

    addResult('=== انتهى اختبار هيكل قاعدة البيانات ===');
    setIsRunning(false);
  };

  const resetTests = () => {
    setTests(prev => prev.map(test => ({
      ...test,
      status: 'pending',
      count: 0,
      error: undefined
    })));
    setResults([]);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 className="text-3xl font-bold mb-6">🗄️ اختبار هيكل قاعدة البيانات</h1>
      
      <div style={{ 
        padding: '15px', 
        backgroundColor: '#fff3cd', 
        border: '1px solid #ffc107',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <strong>⚠️ تحذير:</strong> هذا الاختبار يتحقق من وجود الجداول في قاعدة البيانات. 
        إذا فشل أي جدول، فهذا يعني أن الجدول غير موجود أو لا يمكن الوصول إليه.
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={runAllTests}
          disabled={isRunning}
          style={{
            padding: '12px 24px',
            backgroundColor: isRunning ? '#ccc' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: isRunning ? 'not-allowed' : 'pointer',
            marginRight: '10px',
            fontSize: '16px'
          }}
        >
          {isRunning ? 'جاري الاختبار...' : 'اختبار جميع الجداول'}
        </button>

        <button 
          onClick={resetTests}
          style={{
            padding: '12px 24px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          إعادة تعيين
        </button>
      </div>

      {/* Table Results */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '15px',
        marginBottom: '30px'
      }}>
        {tests.map((test) => (
          <div key={test.name} style={{
            border: '1px solid #ddd',
            borderRadius: '6px',
            padding: '15px',
            backgroundColor: 'white',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '0' }}>
                {test.name}
              </h3>
              <span style={{
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 'bold',
                backgroundColor: test.status === 'success' ? '#d4edda' : 
                               test.status === 'error' ? '#f8d7da' : '#e2e3e5',
                color: test.status === 'success' ? '#155724' : 
                       test.status === 'error' ? '#721c24' : '#6c757d'
              }}>
                {test.status === 'pending' && '⏳'}
                {test.status === 'success' && '✅'}
                {test.status === 'error' && '❌'}
              </span>
            </div>

            {test.status === 'success' && (
              <div style={{ 
                padding: '8px', 
                backgroundColor: '#e8f5e8', 
                borderRadius: '4px',
                fontSize: '14px'
              }}>
                <strong>عدد الصفوف:</strong> {test.count}
              </div>
            )}

            {test.status === 'error' && test.error && (
              <div style={{ 
                padding: '8px', 
                backgroundColor: '#ffeaea', 
                borderRadius: '4px',
                fontSize: '12px',
                color: '#d32f2f'
              }}>
                <strong>خطأ:</strong> {test.error}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Results Log */}
      <div style={{ 
        padding: '15px', 
        backgroundColor: '#f8f9fa', 
        border: '1px solid #dee2e6',
        borderRadius: '8px',
        maxHeight: '300px',
        overflowY: 'auto',
        fontFamily: 'monospace',
        fontSize: '14px'
      }}>
        <strong>📝 سجل النتائج:</strong>
        {results.length === 0 ? (
          <div style={{ color: '#6c757d', marginTop: '10px' }}>
            انقر على "اختبار جميع الجداول" لبدء الاختبار...
          </div>
        ) : (
          <div style={{ marginTop: '10px' }}>
            {results.map((result, index) => (
              <div key={index} style={{ marginBottom: '5px' }}>
                {result}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      {tests.some(t => t.status !== 'pending') && (
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#e8f5e8', 
          border: '1px solid #4caf50',
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          <strong>📊 ملخص النتائج:</strong>
          <div style={{ marginTop: '10px' }}>
            <div>✅ جداول موجودة: {tests.filter(t => t.status === 'success').length}</div>
            <div>❌ جداول مفقودة: {tests.filter(t => t.status === 'error').length}</div>
            <div>⏳ في الانتظار: {tests.filter(t => t.status === 'pending').length}</div>
            <div>📦 إجمالي الصفوف: {tests.reduce((sum, t) => sum + t.count, 0)}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestDatabaseStructurePage; 