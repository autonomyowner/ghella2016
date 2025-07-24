'use client';

import React, { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useSupabaseData } from '@/hooks/useSupabase';

const TestVegetablesUpdatePage: React.FC = () => {
  const { user } = useSupabaseAuth();
  const { getVegetables, addVegetable, updateVegetable, deleteVegetable } = useSupabaseData();
  const [results, setResults] = useState<string[]>([]);
  const [vegetables, setVegetables] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [testVegetableId, setTestVegetableId] = useState<string | null>(null);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testVegetablesUpdate = async () => {
    setIsRunning(true);
    addResult('=== اختبار تحديث الخضروات ===');

    try {
      // Test 1: Fetch existing vegetables
      addResult('اختبار 1: جلب الخضروات الموجودة...');
      const existingData = await getVegetables();
      setVegetables(existingData || []);
      addResult(`✅ تم جلب ${existingData?.length || 0} خضروات`);

      // Test 2: Create a test vegetable if user is logged in
      if (user) {
        addResult('اختبار 2: إنشاء خضروات تجريبية...');
        const testVegetable = {
          title: 'خضروات تجريبية للاختبار',
          description: 'هذه خضروات تجريبية لاختبار التحديث',
          price: 15.00,
          currency: 'DZD',
          vegetable_type: 'tomatoes',
          quantity: 5,
          unit: 'kg',
          freshness: 'excellent',
          organic: false,
          location: 'الجزائر العاصمة',
          is_available: true,
          is_featured: false,
          view_count: 0,
          packaging: 'loose',
          user_id: user.id
        };

        const newVegetable = await addVegetable(testVegetable);
        setTestVegetableId(newVegetable.id);
        addResult(`✅ تم إنشاء الخضروات التجريبية بنجاح`);
        addResult(`🆔 معرف الخضروات الجديدة: ${newVegetable.id}`);

        // Test 3: Update the vegetable
        addResult('اختبار 3: تحديث الخضروات التجريبية...');
        const updateData = {
          title: 'خضروات محدثة للاختبار',
          description: 'هذه خضروات محدثة لاختبار التحديث',
          price: 20.00,
          view_count: 5
        };

        const updatedVegetable = await updateVegetable(newVegetable.id, updateData);
        addResult(`✅ تم تحديث الخضروات بنجاح`);
        addResult(`📝 العنوان الجديد: ${updatedVegetable.title}`);
        addResult(`💰 السعر الجديد: ${updatedVegetable.price} ${updatedVegetable.currency}`);
        addResult(`👁️ عدد المشاهدات: ${updatedVegetable.view_count}`);

        // Test 4: Fetch again to see the updated data
        addResult('اختبار 4: جلب البيانات المحدثة...');
        const updatedData = await getVegetables();
        setVegetables(updatedData || []);
        addResult(`✅ تم جلب ${updatedData?.length || 0} خضروات (بعد التحديث)`);

        // Test 5: Clean up - delete the test vegetable
        addResult('اختبار 5: حذف الخضروات التجريبية...');
        await deleteVegetable(newVegetable.id);
        addResult(`✅ تم حذف الخضروات التجريبية بنجاح`);

        // Test 6: Final fetch
        addResult('اختبار 6: جلب البيانات النهائية...');
        const finalData = await getVegetables();
        setVegetables(finalData || []);
        addResult(`✅ تم جلب ${finalData?.length || 0} خضروات (النتيجة النهائية)`);

      } else {
        addResult('⏭️ تخطي اختبارات الإضافة والتحديث - المستخدم غير مسجل الدخول');
      }

    } catch (error) {
      addResult(`❌ خطأ: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
    }

    addResult('=== انتهى اختبار تحديث الخضروات ===');
    setIsRunning(false);
  };

  const clearResults = () => {
    setResults([]);
    setVegetables([]);
    setTestVegetableId(null);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 className="text-3xl font-bold mb-6">🍅 اختبار تحديث الخضروات</h1>
      
      <div style={{ 
        padding: '15px', 
        backgroundColor: '#e8f5e8', 
        border: '1px solid #4caf50',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <strong>🔧 تم إصلاح معالجة الأخطاء!</strong> هذا الاختبار يتحقق من أن عمليات التحديث تعمل بشكل صحيح.
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testVegetablesUpdate}
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
          {isRunning ? 'جاري الاختبار...' : 'اختبار تحديث الخضروات'}
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
            انقر على "اختبار تحديث الخضروات" لبدء الاختبار...
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

      {/* Vegetables List */}
      {vegetables.length > 0 && (
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#e3f2fd', 
          border: '1px solid #2196f3',
          borderRadius: '8px'
        }}>
          <strong>🍅 قائمة الخضروات ({vegetables.length}):</strong>
          <div style={{ marginTop: '10px' }}>
            {vegetables.map((vegetable, index) => (
              <div key={vegetable.id || index} style={{
                padding: '10px',
                margin: '5px 0',
                backgroundColor: 'white',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}>
                <div style={{ fontWeight: 'bold' }}>{vegetable.title}</div>
                <div style={{ color: '#666', fontSize: '14px' }}>{vegetable.description}</div>
                <div style={{ color: '#28a745', fontWeight: 'bold' }}>
                  {vegetable.price} {vegetable.currency}
                </div>
                <div style={{ fontSize: '12px', color: '#999' }}>
                  النوع: {vegetable.vegetable_type} | الكمية: {vegetable.quantity} {vegetable.unit} | المشاهدات: {vegetable.view_count}
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
          <li>إذا نجح الاختبار، اذهب إلى <a href="/VAR/marketplace" style={{ color: '#2196f3' }}>صفحة الخضروات</a></li>
          <li>اختبر عرض تفاصيل الخضروات (view count update)</li>
          <li>اختبر تحرير الخضروات</li>
          <li>إذا كان هناك مشاكل، راجع الأخطاء أعلاه</li>
        </ol>
      </div>
    </div>
  );
};

export default TestVegetablesUpdatePage; 