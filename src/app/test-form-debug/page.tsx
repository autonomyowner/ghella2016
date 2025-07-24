'use client';

import React, { useState } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useSupabaseData } from '@/hooks/useSupabase';

const TestFormDebugPage: React.FC = () => {
  const { user } = useSupabaseAuth();
  const { addLand, addNursery, addVegetable } = useSupabaseData();
  
  const [results, setResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: ''
  });

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const testLandForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRunning(true);
    addResult('=== اختبار نموذج الأرض ===');

    if (!user) {
      addResult('❌ المستخدم غير مسجل الدخول');
      setIsRunning(false);
      return;
    }

    try {
      addResult('📝 البيانات المدخلة:');
      addResult(`- العنوان: ${formData.title}`);
      addResult(`- الوصف: ${formData.description}`);
      addResult(`- السعر: ${formData.price}`);
      addResult(`- الموقع: ${formData.location}`);

      if (!formData.title || !formData.description || !formData.price || !formData.location) {
        addResult('❌ خطأ: جميع الحقول مطلوبة');
        setIsRunning(false);
        return;
      }

      const landData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        currency: 'DZD',
        listing_type: 'sale',
        area_size: 10.0,
        area_unit: 'hectare',
        location: formData.location,
        images: [],
        user_id: user.id,
        is_available: true,
        is_featured: false,
        view_count: 0
      };

      addResult('🔄 إرسال البيانات...');
      const newLand = await addLand(landData);
      addResult(`✅ تم إضافة الأرض بنجاح: ${newLand.id}`);
      alert('تم إضافة الأرض بنجاح!');

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'خطأ غير معروف';
      addResult(`❌ خطأ: ${errorMessage}`);
      alert(`خطأ: ${errorMessage}`);
    }

    setIsRunning(false);
  };

  const testNurseryForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRunning(true);
    addResult('=== اختبار نموذج المشتل ===');

    if (!user) {
      addResult('❌ المستخدم غير مسجل الدخول');
      setIsRunning(false);
      return;
    }

    try {
      addResult('📝 البيانات المدخلة:');
      addResult(`- العنوان: ${formData.title}`);
      addResult(`- الوصف: ${formData.description}`);
      addResult(`- السعر: ${formData.price}`);
      addResult(`- الموقع: ${formData.location}`);

      if (!formData.title || !formData.description || !formData.price || !formData.location) {
        addResult('❌ خطأ: جميع الحقول مطلوبة');
        setIsRunning(false);
        return;
      }

      const nurseryData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        currency: 'DZD',
        plant_type: 'fruit_trees',
        plant_name: 'شجرة تجريبية',
        age_months: 6,
        size: 'medium',
        quantity: 10,
        location: formData.location,
        images: [],
        user_id: user.id,
        is_available: true,
        is_featured: false,
        view_count: 0
      };

      addResult('🔄 إرسال البيانات...');
      const newNursery = await addNursery(nurseryData);
      addResult(`✅ تم إضافة المشتل بنجاح: ${newNursery.id}`);
      alert('تم إضافة المشتل بنجاح!');

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'خطأ غير معروف';
      addResult(`❌ خطأ: ${errorMessage}`);
      alert(`خطأ: ${errorMessage}`);
    }

    setIsRunning(false);
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 className="text-3xl font-bold mb-6">🔧 اختبار النماذج</h1>
      
      <div style={{ 
        padding: '15px', 
        backgroundColor: '#fff3cd', 
        border: '1px solid #ffc107',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <strong>🔍 تشخيص النماذج:</strong> هذا الاختبار يتحقق من سبب عدم عمل النماذج الفعلية.
      </div>

      {/* Simple Form */}
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#f8f9fa', 
        border: '1px solid #dee2e6',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h3 className="text-xl font-bold mb-4">📝 نموذج تجريبي بسيط</h3>
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">العنوان *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="أدخل العنوان"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">الوصف *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="أدخل الوصف"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">السعر *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="أدخل السعر"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">الموقع *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="أدخل الموقع"
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={testLandForm}
              disabled={isRunning}
              style={{
                padding: '10px 20px',
                backgroundColor: isRunning ? '#ccc' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isRunning ? 'not-allowed' : 'pointer'
              }}
            >
              اختبار الأرض
            </button>

            <button
              type="button"
              onClick={testNurseryForm}
              disabled={isRunning}
              style={{
                padding: '10px 20px',
                backgroundColor: isRunning ? '#ccc' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isRunning ? 'not-allowed' : 'pointer'
              }}
            >
              اختبار المشتل
            </button>
          </div>
        </form>
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
            املأ النموذج واضغط على أحد الأزرار لبدء الاختبار...
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

      <button 
        onClick={clearResults}
        style={{
          padding: '10px 20px',
          backgroundColor: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        مسح النتائج
      </button>

      {/* Instructions */}
      <div style={{ 
        padding: '15px', 
        backgroundColor: '#e8f5e8', 
        border: '1px solid #4caf50',
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <strong>📋 التعليمات:</strong>
        <ol style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li>املأ جميع الحقول في النموذج أعلاه</li>
          <li>اضغط على "اختبار الأرض" أو "اختبار المشتل"</li>
          <li>راقب النتائج والرسائل</li>
          <li>إذا نجح الاختبار، المشكلة في النماذج الفعلية</li>
          <li>إذا فشل الاختبار، المشكلة في الدوال أو البيانات</li>
        </ol>
      </div>
    </div>
  );
};

export default TestFormDebugPage; 