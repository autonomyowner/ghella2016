'use client';

import React, { useState } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useSupabaseData } from '@/hooks/useSupabase';

const TestVegetablesFormPage: React.FC = () => {
  const { user } = useSupabaseAuth();
  const { addVegetable, getVegetables } = useSupabaseData();
  
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [testData, setTestData] = useState({
    title: 'طماطم اختبار',
    description: 'طماطم للاختبار فقط',
    vegetable_type: 'tomatoes',
    price: '150',
    quantity: '10',
    unit: 'kg',
    location: 'الجزائر العاصمة',
    harvest_date: new Date().toISOString().split('T')[0],
    contact_phone: '0770123456'
  });

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testVegetablesTable = async () => {
    setLoading(true);
    addResult('=== بدء اختبار جدول الخضروات ===');
    
    try {
      // Test 1: Check if user is logged in
      if (!user) {
        addResult('❌ المستخدم غير مسجل دخول');
        return;
      }
      
      addResult(`✅ المستخدم مسجل دخول: ${user.email}`);
      
      // Test 2: Fetch existing vegetables
      addResult('🔍 جلب الخضروات الموجودة...');
      const vegetables = await getVegetables();
      addResult(`✅ تم جلب ${vegetables.length} خضروات`);
      
      // Test 3: Test adding vegetable with minimal data
      addResult('➕ اختبار إضافة خضروات ببيانات بسيطة...');
      const minimalData = {
        user_id: user.id,
        title: 'طماطم اختبار بسيط',
        vegetable_type: 'tomatoes',
        price: 100,
        quantity: 5,
        location: 'الجزائر العاصمة',
        contact_phone: '0770123456'
      };
      
      try {
        const newVegetable = await addVegetable(minimalData);
        addResult(`✅ تم إضافة خضروات بنجاح: ${newVegetable.id}`);
        addResult(`📋 بيانات الخضروات المضافة: ${JSON.stringify(newVegetable, null, 2)}`);
      } catch (error) {
        addResult(`❌ فشل في إضافة خضروات بسيطة: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
        if (error instanceof Error) {
          addResult(`🔍 تفاصيل الخطأ: ${error.stack}`);
        }
      }
      
      // Test 4: Test adding vegetable with full data
      addResult('➕ اختبار إضافة خضروات ببيانات كاملة...');
      const fullData = {
        user_id: user.id,
        title: testData.title,
        description: testData.description,
        vegetable_type: testData.vegetable_type,
        price: parseFloat(testData.price),
        quantity: parseFloat(testData.quantity),
        unit: testData.unit,
        location: testData.location,
        harvest_date: testData.harvest_date,
        contact_phone: testData.contact_phone,
        images: [],
        is_available: true,
        is_featured: false,
        view_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      try {
        const newFullVegetable = await addVegetable(fullData);
        addResult(`✅ تم إضافة خضروات كاملة بنجاح: ${newFullVegetable.id}`);
        addResult(`📋 بيانات الخضروات الكاملة: ${JSON.stringify(newFullVegetable, null, 2)}`);
      } catch (error) {
        addResult(`❌ فشل في إضافة خضروات كاملة: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
        if (error instanceof Error) {
          addResult(`🔍 تفاصيل الخطأ: ${error.stack}`);
        }
      }
      
      // Test 5: Test database schema
      addResult('🔍 اختبار هيكل قاعدة البيانات...');
      try {
        const latestVegetables = await getVegetables();
        if (latestVegetables.length > 0) {
          const sample = latestVegetables[0];
          const requiredFields = ['id', 'title', 'vegetable_type', 'price', 'quantity', 'location', 'user_id'];
          const missingFields = requiredFields.filter(field => !(field in sample));
          
          if (missingFields.length === 0) {
            addResult('✅ هيكل قاعدة البيانات صحيح');
            addResult(`📋 الحقول المتاحة: ${Object.keys(sample).join(', ')}`);
          } else {
            addResult(`❌ حقول مفقودة: ${missingFields.join(', ')}`);
          }
        }
      } catch (error) {
        addResult(`❌ خطأ في فحص هيكل البيانات: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
      }
      
    } catch (error) {
      addResult(`❌ خطأ عام: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
    }
    
    addResult('=== انتهى اختبار جدول الخضروات ===');
    setLoading(false);
  };

  const testFormData = async () => {
    setLoading(true);
    addResult('=== بدء اختبار بيانات النموذج ===');
    
    try {
      if (!user) {
        addResult('❌ المستخدم غير مسجل دخول');
        return;
      }
      
      addResult('📋 بيانات النموذج الحالية:');
      addResult(JSON.stringify(testData, null, 2));
      
      // Test form data validation
      const errors = [];
      
      if (!testData.title) errors.push('العنوان مطلوب');
      if (!testData.vegetable_type) errors.push('نوع الخضروات مطلوب');
      if (!testData.price || parseFloat(testData.price) <= 0) errors.push('السعر يجب أن يكون أكبر من صفر');
      if (!testData.quantity || parseFloat(testData.quantity) <= 0) errors.push('الكمية يجب أن تكون أكبر من صفر');
      if (!testData.location) errors.push('الموقع مطلوب');
      if (!testData.contact_phone) errors.push('رقم الهاتف مطلوب');
      
      if (errors.length > 0) {
        addResult(`❌ أخطاء في التحقق من البيانات: ${errors.join(', ')}`);
      } else {
        addResult('✅ جميع البيانات صحيحة');
      }
      
      // Test data transformation
      const transformedData = {
        user_id: user.id,
        title: testData.title,
        description: testData.description,
        vegetable_type: testData.vegetable_type,
        price: parseFloat(testData.price),
        quantity: parseFloat(testData.quantity),
        unit: testData.unit,
        location: testData.location,
        harvest_date: testData.harvest_date,
        contact_phone: testData.contact_phone,
        images: [],
        is_available: true,
        is_featured: false,
        view_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      addResult('🔄 البيانات المحولة:');
      addResult(JSON.stringify(transformedData, null, 2));
      
      // Try to add with transformed data
      try {
        const newVegetable = await addVegetable(transformedData);
        addResult(`✅ تم إضافة الخضروات بنجاح: ${newVegetable.id}`);
      } catch (error) {
        addResult(`❌ فشل في إضافة الخضروات: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
      }
      
    } catch (error) {
      addResult(`❌ خطأ في اختبار البيانات: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
    }
    
    addResult('=== انتهى اختبار بيانات النموذج ===');
    setLoading(false);
  };

  const resetResults = () => {
    setResults([]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTestData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">🧪 اختبار نموذج الخضروات</h1>
          <p className="text-gray-600 text-lg">اختبار شامل لنموذج إضافة الخضروات وقاعدة البيانات</p>
        </div>

        {/* User Status */}
        <div className={`p-4 rounded-lg mb-6 ${user ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">
                {user ? '✅ المستخدم مسجل دخول' : '❌ المستخدم غير مسجل دخول'}
              </h3>
              <p className="text-sm text-gray-600">
                {user ? `البريد الإلكتروني: ${user.email}` : 'يجب تسجيل الدخول لاختبار النموذج'}
              </p>
            </div>
            {!user && (
              <a 
                href="/auth/login"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                تسجيل الدخول
              </a>
            )}
          </div>
        </div>

        {/* Test Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Form Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">📝 نموذج الاختبار</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عنوان الإعلان *
                </label>
                <input
                  type="text"
                  name="title"
                  value={testData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="مثال: طماطم طازجة عضوية"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الوصف
                </label>
                <textarea
                  name="description"
                  value={testData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={3}
                  placeholder="وصف الخضروات..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نوع الخضروات *
                  </label>
                  <select
                    name="vegetable_type"
                    value={testData.vegetable_type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="tomatoes">طماطم</option>
                    <option value="potatoes">بطاطس</option>
                    <option value="onions">بصل</option>
                    <option value="carrots">جزر</option>
                    <option value="cucumbers">خيار</option>
                    <option value="peppers">فلفل</option>
                    <option value="lettuce">خس</option>
                    <option value="cabbage">ملفوف</option>
                    <option value="broccoli">بروكلي</option>
                    <option value="cauliflower">قرنبيط</option>
                    <option value="spinach">سبانخ</option>
                    <option value="other">أخرى</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الوحدة
                  </label>
                  <select
                    name="unit"
                    value={testData.unit}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="kg">كيلوغرام</option>
                    <option value="g">غرام</option>
                    <option value="piece">قطعة</option>
                    <option value="box">صندوق</option>
                    <option value="bundle">حزمة</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    السعر (دج) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={testData.price}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="مثال: 150"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الكمية *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={testData.quantity}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="مثال: 10"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الموقع *
                </label>
                <input
                  type="text"
                  name="location"
                  value={testData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="مثال: الجزائر العاصمة"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تاريخ الحصاد
                  </label>
                  <input
                    type="date"
                    name="harvest_date"
                    value={testData.harvest_date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الهاتف *
                  </label>
                  <input
                    type="tel"
                    name="contact_phone"
                    value={testData.contact_phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="مثال: 0770123456"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Test Controls */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">🧪 أدوات الاختبار</h3>
            
            <div className="space-y-4">
              <button
                onClick={testVegetablesTable}
                disabled={loading || !user}
                className={`w-full px-6 py-3 rounded-lg font-semibold transition-all ${
                  loading || !user
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {loading ? '🔄 جاري الاختبار...' : '🔍 اختبار جدول الخضروات'}
              </button>

              <button
                onClick={testFormData}
                disabled={loading || !user}
                className={`w-full px-6 py-3 rounded-lg font-semibold transition-all ${
                  loading || !user
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {loading ? '🔄 جاري الاختبار...' : '📝 اختبار بيانات النموذج'}
              </button>

              <button
                onClick={resetResults}
                className="w-full px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
              >
                🔄 مسح النتائج
              </button>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">💡 نصائح للاختبار</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• تأكد من تسجيل الدخول أولاً</li>
                <li>• جرب البيانات البسيطة أولاً</li>
                <li>• تحقق من رسائل الخطأ بالتفصيل</li>
                <li>• تأكد من وجود جميع الحقول المطلوبة</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Results Log */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">📝 سجل النتائج</h3>
          <div className="bg-gray-100 rounded p-4 h-96 overflow-y-auto font-mono text-sm">
            {results.length === 0 ? (
              <div className="text-gray-500">
                انقر على أحد أزرار الاختبار لبدء الاختبار...
              </div>
            ) : (
              <div className="space-y-1">
                {results.map((result, index) => (
                  <div key={index} className="text-gray-800">
                    {result}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestVegetablesFormPage; 