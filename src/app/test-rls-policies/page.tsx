'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase/supabaseClient';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

const TestRLSPoliciesPage: React.FC = () => {
  const { user } = useSupabaseAuth();
  const [results, setResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testRLSPolicies = async () => {
    setIsRunning(true);
    addResult('=== اختبار سياسات RLS ===');

    // Test 1: Check authentication status
    addResult('اختبار 1: حالة المصادقة...');
    if (user) {
      addResult(`✅ المستخدم مسجل الدخول: ${user.email}`);
      addResult(`🆔 معرف المستخدم: ${user.id}`);
    } else {
      addResult(`❌ المستخدم غير مسجل الدخول`);
    }

    // Test 2: Check current session
    addResult('اختبار 2: جلسة المستخدم الحالية...');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      addResult(`❌ خطأ في الجلسة: ${sessionError.message}`);
    } else if (session) {
      addResult(`✅ الجلسة صالحة`);
      addResult(`👤 معرف المستخدم في الجلسة: ${session.user.id}`);
    } else {
      addResult(`❌ لا توجد جلسة صالحة`);
    }

    // Test 3: Test vegetables table with RLS
    addResult('اختبار 3: اختبار جدول الخضروات مع RLS...');
    
    // Try to select from vegetables table
    const { data: vegData, error: vegError } = await supabase
      .from('vegetables')
      .select('*')
      .limit(1);

    if (vegError) {
      addResult(`❌ خطأ في قراءة الخضروات: ${vegError.message}`);
      addResult(`🔍 تفاصيل الخطأ: ${JSON.stringify(vegError)}`);
    } else {
      addResult(`✅ قراءة الخضروات نجحت`);
      addResult(`📊 عدد النتائج: ${vegData?.length || 0}`);
    }

    // Test 4: Test nurseries table with RLS
    addResult('اختبار 4: اختبار جدول المشاتل مع RLS...');
    
    const { data: nurseryData, error: nurseryError } = await supabase
      .from('nurseries')
      .select('*')
      .limit(1);

    if (nurseryError) {
      addResult(`❌ خطأ في قراءة المشاتل: ${nurseryError.message}`);
      addResult(`🔍 تفاصيل الخطأ: ${JSON.stringify(nurseryError)}`);
    } else {
      addResult(`✅ قراءة المشاتل نجحت`);
      addResult(`📊 عدد النتائج: ${nurseryData?.length || 0}`);
    }

    // Test 5: Try to insert with proper user_id
    if (user) {
      addResult('اختبار 5: محاولة إدراج مع معرف المستخدم الصحيح...');
      
      const testVegetable = {
        title: 'Test Vegetable RLS',
        description: 'Testing RLS policies',
        price: 15.00,
        currency: 'DZD',
        vegetable_type: 'tomatoes',
        quantity: 1,
        unit: 'kg',
        freshness: 'excellent',
        organic: false,
        location: 'Test Location',
        is_available: true,
        is_featured: false,
        view_count: 0,
        packaging: 'loose',
        user_id: user.id // Use actual user ID
      };

      const { data: insertData, error: insertError } = await supabase
        .from('vegetables')
        .insert([testVegetable])
        .select();

      if (insertError) {
        addResult(`❌ خطأ في الإدراج: ${insertError.message}`);
        addResult(`🔍 تفاصيل الخطأ: ${JSON.stringify(insertError)}`);
        addResult(`📝 البيانات المرسلة: ${JSON.stringify(testVegetable, null, 2)}`);
      } else {
        addResult(`✅ الإدراج نجح مع RLS`);
        addResult(`📝 البيانات المدرجة: ${JSON.stringify(insertData, null, 2)}`);
      }
    } else {
      addResult('⏭️ تخطي اختبار الإدراج - المستخدم غير مسجل الدخول');
    }

    // Test 6: Check if tables have RLS enabled
    addResult('اختبار 6: فحص تفعيل RLS على الجداول...');
    
    // This is a bit tricky to test directly, but we can infer from the errors
    addResult('💡 ملاحظة: إذا كانت الأخطاء تتعلق بـ "new row violates row-level security policy" فهذا يعني أن RLS مفعل');
    addResult('💡 إذا كانت الأخطاء تتعلق بـ "relation does not exist" فهذا يعني أن الجدول غير موجود');

    addResult('=== انتهى اختبار سياسات RLS ===');
    setIsRunning(false);
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 className="text-3xl font-bold mb-6">🔒 اختبار سياسات RLS</h1>
      
      <div style={{ 
        padding: '15px', 
        backgroundColor: '#e3f2fd', 
        border: '1px solid #2196f3',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <strong>🔍 الغرض:</strong> هذا الاختبار يفحص سياسات Row Level Security (RLS) ويحدد سبب فشل العمليات.
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testRLSPolicies}
          disabled={isRunning}
          style={{
            padding: '12px 24px',
            backgroundColor: isRunning ? '#ccc' : '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: isRunning ? 'not-allowed' : 'pointer',
            marginRight: '10px',
            fontSize: '16px'
          }}
        >
          {isRunning ? 'جاري الاختبار...' : 'اختبار سياسات RLS'}
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
            انقر على "اختبار سياسات RLS" لبدء الاختبار...
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

      {/* User Status */}
      <div style={{ 
        padding: '15px', 
        backgroundColor: user ? '#e8f5e8' : '#ffeaea', 
        border: `1px solid ${user ? '#4caf50' : '#f44336'}`,
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <strong>👤 حالة المستخدم:</strong>
        <div style={{ marginTop: '10px' }}>
          {user ? (
            <>
              <div>✅ مسجل الدخول</div>
              <div>📧 البريد الإلكتروني: {user.email}</div>
              <div>🆔 المعرف: {user.id}</div>
            </>
          ) : (
            <>
              <div>❌ غير مسجل الدخول</div>
              <div>⚠️ يجب تسجيل الدخول لاختبار RLS</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestRLSPoliciesPage; 