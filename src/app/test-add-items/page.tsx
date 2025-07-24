'use client';

import React, { useState } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useSupabaseData } from '@/hooks/useSupabase';

const TestAddItemsPage: React.FC = () => {
  const { user } = useSupabaseAuth();
  const { 
    addLand, 
    addNursery, 
    addVegetable, 
    addEquipment,
    getLand,
    getNurseries,
    getVegetables,
    getEquipment
  } = useSupabaseData();
  
  const [results, setResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testAddItems = async () => {
    setIsRunning(true);
    addResult('=== اختبار إضافة العناصر ===');

    if (!user) {
      addResult('❌ المستخدم غير مسجل الدخول');
      setIsRunning(false);
      return;
    }

    try {
      // Test 1: Add Land
      addResult('اختبار 1: إضافة أرض...');
      const landData = {
        title: 'أرض تجريبية للاختبار',
        description: 'هذه أرض تجريبية لاختبار النظام',
        price: 50000.00,
        currency: 'DZD',
        listing_type: 'sale',
        area_size: 10.5,
        area_unit: 'hectare',
        location: 'الجزائر العاصمة',
        soil_type: 'طينية',
        water_source: 'بئر',
        images: [],
        user_id: user.id,
        is_available: true,
        is_featured: false,
        view_count: 0
      };

      console.log('Land data to submit:', landData);
      const newLand = await addLand(landData);
      addResult(`✅ تم إضافة الأرض بنجاح: ${newLand.id}`);

      // Test 2: Add Nursery
      addResult('اختبار 2: إضافة مشتل...');
      const nurseryData = {
        title: 'مشتل تجريبي للاختبار',
        description: 'هذا مشتل تجريبي لاختبار النظام',
        price: 25.00,
        currency: 'DZD',
        plant_type: 'fruit_trees',
        plant_name: 'شجرة تفاح',
        age_months: 6,
        size: 'medium',
        quantity: 10,
        health_status: 'ممتازة',
        location: 'الجزائر العاصمة',
        images: [],
        user_id: user.id,
        is_available: true,
        is_featured: false,
        view_count: 0
      };

      console.log('Nursery data to submit:', nurseryData);
      const newNursery = await addNursery(nurseryData);
      addResult(`✅ تم إضافة المشتل بنجاح: ${newNursery.id}`);

      // Test 3: Add Vegetable
      addResult('اختبار 3: إضافة خضروات...');
      const vegetableData = {
        title: 'خضروات تجريبية للاختبار',
        description: 'هذه خضروات تجريبية لاختبار النظام',
        price: 15.00,
        currency: 'DZD',
        vegetable_type: 'tomatoes',
        quantity: 5,
        unit: 'kg',
        freshness: 'excellent',
        organic: false,
        location: 'الجزائر العاصمة',
        images: [],
        user_id: user.id,
        is_available: true,
        is_featured: false,
        view_count: 0,
        packaging: 'loose'
      };

      console.log('Vegetable data to submit:', vegetableData);
      const newVegetable = await addVegetable(vegetableData);
      addResult(`✅ تم إضافة الخضروات بنجاح: ${newVegetable.id}`);

      // Test 4: Add Equipment
      addResult('اختبار 4: إضافة معدات...');
      const equipmentData = {
        title: 'معدات تجريبية للاختبار',
        description: 'هذه معدات تجريبية لاختبار النظام',
        price: 1000.00,
        currency: 'DZD',
        condition: 'good',
        location: 'الجزائر العاصمة',
        brand: 'جون دير',
        model: '5000',
        year: 2020,
        hours_used: 500,
        images: [],
        user_id: user.id,
        is_available: true,
        is_featured: false,
        view_count: 0
      };

      console.log('Equipment data to submit:', equipmentData);
      const newEquipment = await addEquipment(equipmentData);
      addResult(`✅ تم إضافة المعدات بنجاح: ${newEquipment.id}`);

      // Test 5: Verify all items were added
      addResult('اختبار 5: التحقق من إضافة جميع العناصر...');
      
      const landItems = await getLand();
      const nurseryItems = await getNurseries();
      const vegetableItems = await getVegetables();
      const equipmentItems = await getEquipment();

      addResult(`📊 عدد الأراضي: ${landItems?.length || 0}`);
      addResult(`📊 عدد المشاتل: ${nurseryItems?.length || 0}`);
      addResult(`📊 عدد الخضروات: ${vegetableItems?.length || 0}`);
      addResult(`📊 عدد المعدات: ${equipmentItems?.length || 0}`);

      addResult('✅ تم إضافة جميع العناصر بنجاح!');

    } catch (error) {
      addResult(`❌ خطأ: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
      console.error('Test error:', error);
    }

    addResult('=== انتهى اختبار إضافة العناصر ===');
    setIsRunning(false);
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 className="text-3xl font-bold mb-6">🧪 اختبار إضافة العناصر</h1>
      
      <div style={{ 
        padding: '15px', 
        backgroundColor: '#fff3cd', 
        border: '1px solid #ffc107',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <strong>🔍 تشخيص المشكلة:</strong> هذا الاختبار يتحقق من سبب عدم إضافة العناصر في النماذج.
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testAddItems}
          disabled={isRunning}
          style={{
            padding: '12px 24px',
            backgroundColor: isRunning ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: isRunning ? 'not-allowed' : 'pointer',
            marginRight: '10px',
            fontSize: '16px'
          }}
        >
          {isRunning ? 'جاري الاختبار...' : 'اختبار إضافة العناصر'}
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
        maxHeight: '400px',
        overflowY: 'auto',
        fontFamily: 'monospace',
        fontSize: '14px',
        marginBottom: '20px'
      }}>
        <strong>📝 نتائج الاختبار:</strong>
        {results.length === 0 ? (
          <div style={{ color: '#6c757d', marginTop: '10px' }}>
            انقر على "اختبار إضافة العناصر" لبدء الاختبار...
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

      {/* User Info */}
      <div style={{ 
        padding: '15px', 
        backgroundColor: '#e3f2fd', 
        border: '1px solid #2196f3',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <strong>👤 معلومات المستخدم:</strong>
        <div style={{ marginTop: '10px' }}>
          {user ? (
            <>
              <div>✅ مسجل الدخول: {user.email}</div>
              <div>🆔 معرف المستخدم: {user.id}</div>
            </>
          ) : (
            <div>❌ غير مسجل الدخول</div>
          )}
        </div>
      </div>

      {/* Next Steps */}
      <div style={{ 
        padding: '15px', 
        backgroundColor: '#e8f5e8', 
        border: '1px solid #4caf50',
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <strong>📋 الخطوات التالية:</strong>
        <ol style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li>إذا نجح الاختبار، المشكلة في النماذج وليس في الدوال</li>
          <li>إذا فشل الاختبار، المشكلة في الدوال أو قاعدة البيانات</li>
          <li>راجع الأخطاء في وحدة التحكم (F12) للحصول على تفاصيل أكثر</li>
          <li>اختبر النماذج الفعلية بعد إصلاح المشكلة</li>
        </ol>
      </div>
    </div>
  );
};

export default TestAddItemsPage; 