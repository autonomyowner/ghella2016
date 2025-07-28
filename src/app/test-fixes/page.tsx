'use client';

import React, { useState } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useSupabaseData } from '@/hooks/useSupabase';
import Link from 'next/link';

const TestFixesPage: React.FC = () => {
  const { user } = useSupabaseAuth();
  const { 
    getEquipment, addEquipment, updateEquipment, deleteEquipment,
    getVegetables, addVegetable, updateVegetable, deleteVegetable,
    getLand, addLand, updateLand, deleteLand
  } = useSupabaseData();
  
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testVegetablesFix = async () => {
    if (!user) {
      addResult('❌ يجب تسجيل الدخول أولاً');
      return;
    }

    try {
      addResult('🧪 اختبار إصلاح الخضروات...');
      
      const testData = {
        title: 'طماطم اختبار الإصلاح',
        description: 'اختبار الإصلاح',
        vegetable_type: 'tomatoes',
        price: 150,
        quantity: 10,
        unit: 'kg',
        location: 'الجزائر العاصمة',
        user_id: user.id,
        freshness: 'fresh', // Try 'fresh', 'very_fresh', or 'new'
        organic: false,
        packaging: 'plastic_bag',
        harvest_date: new Date().toISOString().split('T')[0]
      };

      const newVegetable = await addVegetable(testData);
      addResult(`✅ تم إضافة خضروات بنجاح: ${newVegetable.id}`);

      const updatedVegetable = await updateVegetable(newVegetable.id, {
        title: 'طماطم محدثة'
      });
      addResult(`✅ تم تحديث خضروات بنجاح`);

      await deleteVegetable(newVegetable.id);
      addResult(`✅ تم حذف خضروات بنجاح`);

      addResult('🎉 إصلاح الخضروات يعمل بشكل صحيح!');

    } catch (error) {
      addResult(`❌ خطأ في اختبار الخضروات: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
    }
  };

  const testLandFix = async () => {
    if (!user) {
      addResult('❌ يجب تسجيل الدخول أولاً');
      return;
    }

    try {
      addResult('🧪 اختبار إصلاح الأراضي...');
      
      const testData = {
        title: 'أرض اختبار الإصلاح',
        description: 'اختبار الإصلاح',
        price: 50000,
        area_size: 1000,
        area_unit: 'hectare',
        location: 'الجزائر العاصمة',
        user_id: user.id,
        listing_type: 'sale'
      };

      let newLand;
      try {
        newLand = await addLand(testData);
        addResult(`✅ تم إضافة أرض بنجاح: ${newLand.id}`);
      } catch (error) {
        addResult(`❌ خطأ في إضافة الأرض: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
        throw error;
      }

      const updatedLand = await updateLand(newLand.id, {
        title: 'أرض محدثة'
      });
      addResult(`✅ تم تحديث أرض بنجاح`);

      await deleteLand(newLand.id);
      addResult(`✅ تم حذف أرض بنجاح`);

      addResult('🎉 إصلاح الأراضي يعمل بشكل صحيح!');

    } catch (error) {
      addResult(`❌ خطأ في اختبار الأراضي: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
    }
  };

  const testEquipmentFix = async () => {
    if (!user) {
      addResult('❌ يجب تسجيل الدخول أولاً');
      return;
    }

    try {
      addResult('🧪 اختبار إصلاح المعدات...');
      
      const testData = {
        title: 'معدة اختبار الإصلاح',
        description: 'اختبار الإصلاح',
        price: 1000,
        category_id: '550e8400-e29b-41d4-a716-446655440000', // Real UUID format
        condition: 'good',
        location: 'الجزائر العاصمة',
        user_id: user.id,
        currency: 'DZD'
      };

      const newEquipment = await addEquipment(testData);
      addResult(`✅ تم إضافة معدة بنجاح: ${newEquipment.id}`);

      const updatedEquipment = await updateEquipment(newEquipment.id, {
        title: 'معدة محدثة'
      });
      addResult(`✅ تم تحديث معدة بنجاح`);

      await deleteEquipment(newEquipment.id);
      addResult(`✅ تم حذف معدة بنجاح`);

      addResult('🎉 إصلاح المعدات يعمل بشكل صحيح!');

    } catch (error) {
      addResult(`❌ خطأ في اختبار المعدات: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
    }
  };

  const runAllTests = async () => {
    setLoading(true);
    setResults([]);
    addResult('🚀 بدء اختبار جميع الإصلاحات...');

    await testVegetablesFix();
    await testLandFix();
    await testEquipmentFix();

    addResult('✅ انتهى اختبار جميع الإصلاحات');
    setLoading(false);
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">🔧 اختبار الإصلاحات</h1>
          <p className="text-gray-600 text-lg">اختبار الإصلاحات المطبقة على الأسواق</p>
        </div>

        {/* User Status */}
        <div className={`p-4 rounded-lg mb-6 ${user ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">
                {user ? '✅ المستخدم مسجل دخول' : '⚠️ المستخدم غير مسجل دخول'}
              </h3>
              <p className="text-sm text-gray-600">
                {user ? `البريد الإلكتروني: ${user.email}` : 'يجب تسجيل الدخول لاختبار الإصلاحات'}
              </p>
            </div>
            {!user && (
              <Link 
                href="/auth/login"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                تسجيل الدخول
              </Link>
            )}
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button 
            onClick={runAllTests}
            disabled={loading || !user}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              loading || !user
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {loading ? '🔄 جاري الاختبار...' : '🚀 اختبار جميع الإصلاحات'}
          </button>

          <button 
            onClick={testVegetablesFix}
            disabled={loading || !user}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              loading || !user
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            🍅 اختبار الخضروات
          </button>

          <button 
            onClick={testLandFix}
            disabled={loading || !user}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              loading || !user
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-emerald-500 hover:bg-emerald-600 text-white'
            }`}
          >
            🌾 اختبار الأراضي
          </button>

          <button 
            onClick={testEquipmentFix}
            disabled={loading || !user}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              loading || !user
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            🚜 اختبار المعدات
          </button>

          <button 
            onClick={clearResults}
            className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
          >
            🗑️ مسح النتائج
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">📋 الإصلاحات المطبقة</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-green-600 text-xl">✅</span>
              <div>
                <h3 className="font-semibold text-gray-800">إصلاح الخضروات</h3>
                <p className="text-gray-600">تم إضافة الحقول المطلوبة: quantity, freshness, organic, packaging</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-green-600 text-xl">✅</span>
              <div>
                <h3 className="font-semibold text-gray-800">إصلاح الأراضي</h3>
                <p className="text-gray-600">تم تصحيح اسم الجدول من 'land' إلى 'land_listings'</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-green-600 text-xl">✅</span>
              <div>
                <h3 className="font-semibold text-gray-800">إصلاح RLS</h3>
                <p className="text-gray-600">تم إنشاء سياسات RLS صحيحة لجميع الجداول</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-blue-600 text-xl">💡</span>
              <div>
                <h3 className="font-semibold text-gray-800">ملاحظة</h3>
                <p className="text-gray-600">يجب تطبيق ملف SQL لإصلاح سياسات RLS في Supabase</p>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">📝 نتائج الاختبار</h3>
          <div className="bg-gray-100 rounded p-4 h-64 overflow-y-auto font-mono text-sm">
            {results.length === 0 ? (
              <div className="text-gray-500">
                انقر على "اختبار جميع الإصلاحات" لبدء الاختبار...
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

        {/* SQL Instructions */}
        <div className="mt-8 bg-yellow-50 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">⚙️ خطوات إضافية</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">1. تطبيق إصلاحات RLS</h4>
              <p className="text-gray-600 mb-2">قم بتشغيل ملف SQL التالي في Supabase:</p>
              <div className="bg-gray-100 p-3 rounded text-sm">
                <code>fix-rls-policies.sql</code>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">2. اختبار التشخيص</h4>
              <p className="text-gray-600 mb-2">استخدم صفحة التشخيص الشامل للتحقق من الإصلاحات:</p>
              <Link 
                href="/test-marketplace-diagnostic"
                className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                🔧 صفحة التشخيص الشامل
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestFixesPage; 