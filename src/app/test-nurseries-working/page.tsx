'use client';

import React, { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useSupabaseData } from '@/hooks/useSupabase';

const TestNurseriesWorkingPage: React.FC = () => {
  const { user } = useSupabaseAuth();
  const { getNurseries, addNursery } = useSupabaseData();
  const [results, setResults] = useState<string[]>([]);
  const [nurseries, setNurseries] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testNurseries = async () => {
    setIsRunning(true);
    addResult('=== اختبار جدول المشاتل ===');

    try {
      // Test 1: Fetch nurseries
      addResult('اختبار 1: جلب بيانات المشاتل...');
      const data = await getNurseries();
      setNurseries(data || []);
      addResult(`✅ تم جلب ${data?.length || 0} مشتل`);

      // Test 2: Try to add a test nursery
      if (user) {
        addResult('اختبار 2: إضافة مشتل تجريبي...');
        const testNursery = {
          title: 'مشتل تجريبي للاختبار',
          description: 'هذا مشتل تجريبي لاختبار النظام',
          price: 25.00,
          currency: 'DZD',
          plant_type: 'fruit_trees',
          plant_name: 'شجرة تفاح',
          quantity: 10,
          size: 'medium',
          location: 'الجزائر العاصمة',
          is_available: true,
          is_featured: false,
          view_count: 0,
          seasonality: 'spring',
          user_id: user.id
        };

        const newNursery = await addNursery(testNursery);
        addResult(`✅ تم إضافة المشتل التجريبي بنجاح`);
        addResult(`🆔 معرف المشتل الجديد: ${newNursery.id}`);

        // Test 3: Fetch again to see the new nursery
        addResult('اختبار 3: جلب البيانات مرة أخرى...');
        const updatedData = await getNurseries();
        setNurseries(updatedData || []);
        addResult(`✅ تم جلب ${updatedData?.length || 0} مشتل (بعد الإضافة)`);
      } else {
        addResult('⏭️ تخطي اختبار الإضافة - المستخدم غير مسجل الدخول');
      }

    } catch (error) {
      addResult(`❌ خطأ: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
    }

    addResult('=== انتهى اختبار المشاتل ===');
    setIsRunning(false);
  };

  const clearResults = () => {
    setResults([]);
    setNurseries([]);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 className="text-3xl font-bold mb-6">🌱 اختبار المشاتل</h1>
      
      <div style={{ 
        padding: '15px', 
        backgroundColor: '#e8f5e8', 
        border: '1px solid #4caf50',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <strong>✅ نجح إنشاء جدول المشاتل!</strong> هذا الاختبار يتحقق من أن المشاتل تعمل بشكل صحيح.
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testNurseries}
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
          {isRunning ? 'جاري الاختبار...' : 'اختبار المشاتل'}
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
        maxHeight: '300px',
        overflowY: 'auto',
        fontFamily: 'monospace',
        fontSize: '14px',
        marginBottom: '20px'
      }}>
        <strong>📝 نتائج الاختبار:</strong>
        {results.length === 0 ? (
          <div style={{ color: '#6c757d', marginTop: '10px' }}>
            انقر على "اختبار المشاتل" لبدء الاختبار...
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

      {/* Nurseries List */}
      {nurseries.length > 0 && (
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#e3f2fd', 
          border: '1px solid #2196f3',
          borderRadius: '8px'
        }}>
          <strong>🌱 قائمة المشاتل ({nurseries.length}):</strong>
          <div style={{ marginTop: '10px' }}>
            {nurseries.map((nursery, index) => (
              <div key={nursery.id || index} style={{
                padding: '10px',
                margin: '5px 0',
                backgroundColor: 'white',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}>
                <div style={{ fontWeight: 'bold' }}>{nursery.title}</div>
                <div style={{ color: '#666', fontSize: '14px' }}>{nursery.description}</div>
                <div style={{ color: '#28a745', fontWeight: 'bold' }}>
                  {nursery.price} {nursery.currency}
                </div>
                <div style={{ fontSize: '12px', color: '#999' }}>
                  النوع: {nursery.plant_type} | الحجم: {nursery.size} | الموقع: {nursery.location}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Steps */}
      <div style={{ 
        padding: '15px', 
        backgroundColor: '#fff3cd', 
        border: '1px solid #ffc107',
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <strong>📋 الخطوات التالية:</strong>
        <ol style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li>إذا نجح الاختبار، اذهب إلى <a href="/nurseries" style={{ color: '#2196f3' }}>صفحة المشاتل</a></li>
          <li>اختبر إضافة مشتل جديد</li>
          <li>اختبر البحث والتصفية</li>
          <li>إذا كان هناك مشاكل، راجع الأخطاء أعلاه</li>
        </ol>
      </div>
    </div>
  );
};

export default TestNurseriesWorkingPage; 