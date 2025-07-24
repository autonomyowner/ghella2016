'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase/supabaseClient';

const TestNurseriesSchemaPage: React.FC = () => {
  const [results, setResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testNurseriesSchema = async () => {
    setIsRunning(true);
    addResult('=== اختبار جدول المشاتل ===');

    try {
      // Test 1: Check if table exists and get sample data
      addResult('اختبار 1: التحقق من وجود الجدول...');
      const { data: sampleData, error: sampleError } = await supabase
        .from('nurseries')
        .select('*')
        .limit(1);

      if (sampleError) {
        addResult(`❌ خطأ في الوصول للجدول: ${sampleError.message}`);
        addResult(`تفاصيل الخطأ: ${JSON.stringify(sampleError)}`);
      } else {
        addResult(`✅ الجدول موجود`);
        if (sampleData && sampleData.length > 0) {
          addResult(`📋 عينة من البيانات: ${JSON.stringify(sampleData[0], null, 2)}`);
        } else {
          addResult(`📋 الجدول فارغ`);
        }
      }

      // Test 2: Check table structure by trying different column combinations
      addResult('اختبار 2: فحص هيكل الجدول...');
      
      const columnTests = [
        { name: 'id', type: 'uuid' },
        { name: 'created_at', type: 'timestamp' },
        { name: 'updated_at', type: 'timestamp' },
        { name: 'user_id', type: 'uuid' },
        { name: 'title', type: 'text' },
        { name: 'description', type: 'text' },
        { name: 'price', type: 'numeric' },
        { name: 'currency', type: 'text' },
        { name: 'plant_type', type: 'text' },
        { name: 'plant_name', type: 'text' },
        { name: 'age_months', type: 'integer' },
        { name: 'size', type: 'text' },
        { name: 'quantity', type: 'integer' },
        { name: 'health_status', type: 'text' },
        { name: 'location', type: 'text' },
        { name: 'coordinates', type: 'jsonb' },
        { name: 'images', type: 'text[]' },
        { name: 'is_available', type: 'boolean' },
        { name: 'is_featured', type: 'boolean' },
        { name: 'view_count', type: 'integer' },
        { name: 'pot_size', type: 'text' },
        { name: 'care_instructions', type: 'text' },
        { name: 'seasonality', type: 'text' }
      ];

      for (const column of columnTests) {
        try {
          const { error } = await supabase
            .from('nurseries')
            .select(column.name)
            .limit(1);
          
          if (error) {
            addResult(`❌ عمود ${column.name}: ${error.message}`);
          } else {
            addResult(`✅ عمود ${column.name}: موجود`);
          }
        } catch (err) {
          addResult(`❌ عمود ${column.name}: خطأ في الفحص`);
        }
      }

      // Test 3: Try to insert a minimal record
      addResult('اختبار 3: محاولة إدراج سجل بسيط...');
      const testRecord = {
        title: 'Test Nursery',
        description: 'Test description',
        price: 10.00,
        currency: 'DZD',
        plant_type: 'fruit_trees',
        quantity: 1,
        size: 'small',
        location: 'Test Location',
        is_available: true,
        is_featured: false,
        view_count: 0,
        seasonality: 'spring',
        user_id: 'test-user-id'
      };

      const { data: insertData, error: insertError } = await supabase
        .from('nurseries')
        .insert([testRecord])
        .select();

      if (insertError) {
        addResult(`❌ خطأ في الإدراج: ${insertError.message}`);
        addResult(`تفاصيل الخطأ: ${JSON.stringify(insertError)}`);
        addResult(`البيانات المرسلة: ${JSON.stringify(testRecord, null, 2)}`);
      } else {
        addResult(`✅ الإدراج نجح`);
        addResult(`البيانات المدرجة: ${JSON.stringify(insertData, null, 2)}`);
      }

    } catch (error) {
      addResult(`❌ خطأ عام: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
    }

    addResult('=== انتهى اختبار جدول المشاتل ===');
    setIsRunning(false);
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 className="text-3xl font-bold mb-6">🌱 اختبار جدول المشاتل</h1>
      
      <div style={{ 
        padding: '15px', 
        backgroundColor: '#fff3cd', 
        border: '1px solid #ffc107',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <strong>🔍 الغرض:</strong> هذا الاختبار يفحص هيكل جدول المشاتل ويحدد سبب فشل الاستعلام.
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testNurseriesSchema}
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
          {isRunning ? 'جاري الاختبار...' : 'اختبار جدول المشاتل'}
        </button>

        <button 
          onClick={clearResults}
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
          مسح النتائج
        </button>
      </div>

      {/* Results */}
      <div style={{ 
        padding: '15px', 
        backgroundColor: '#f8f9fa', 
        border: '1px solid #dee2e6',
        borderRadius: '8px',
        maxHeight: '500px',
        overflowY: 'auto',
        fontFamily: 'monospace',
        fontSize: '14px',
        whiteSpace: 'pre-wrap'
      }}>
        <strong>📝 نتائج الاختبار:</strong>
        {results.length === 0 ? (
          <div style={{ color: '#6c757d', marginTop: '10px' }}>
            انقر على "اختبار جدول المشاتل" لبدء الاختبار...
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
    </div>
  );
};

export default TestNurseriesSchemaPage; 