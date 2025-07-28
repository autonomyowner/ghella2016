'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/supabaseClient';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

export default function ClearTestDataPage() {
  const [isClearing, setIsClearing] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { user } = useSupabaseAuth();

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const clearAllTestData = async () => {
    if (!user) {
      addResult('❌ يجب تسجيل الدخول أولاً');
      return;
    }

    setIsClearing(true);
    setResults([]);
    addResult('🧹 بدء عملية مسح البيانات التجريبية...');

    const tables = [
      { name: 'vegetables', displayName: 'الخضروات والفواكه' },
      { name: 'land_listings', displayName: 'الأراضي الزراعية' },
      { name: 'equipment', displayName: 'المعدات الزراعية' },
      { name: 'animal_listings', displayName: 'الحيوانات' },
      { name: 'nurseries', displayName: 'المشاتل والشتلات' }
    ];

    let totalDeleted = 0;

    for (const table of tables) {
      try {
        addResult(`📊 فحص ${table.displayName}...`);
        
        // Count existing records
        const { count, error: countError } = await supabase
          .from(table.name)
          .select('*', { count: 'exact', head: true });

        if (countError) {
          addResult(`❌ خطأ في فحص ${table.displayName}: ${countError.message}`);
          continue;
        }

        addResult(`   وجد ${count || 0} سجل`);

        if ((count || 0) > 0) {
          // Delete all records
          const { error: deleteError } = await supabase
            .from(table.name)
            .delete()
            .neq('id', 0);

          if (deleteError) {
            addResult(`❌ خطأ في حذف من ${table.displayName}: ${deleteError.message}`);
          } else {
            addResult(`✅ تم حذف ${count || 0} سجل من ${table.displayName}`);
            totalDeleted += (count || 0);
          }
        } else {
          addResult(`   لا توجد سجلات للحذف`);
        }

      } catch (error) {
        addResult(`❌ خطأ في معالجة ${table.name}: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
      }
    }

    addResult(`\n🎉 اكتملت عملية المسح!`);
    addResult(`📈 إجمالي السجلات المحذوفة: ${totalDeleted}`);
    addResult(`\n✅ جميع جداول السوق فارغة وجاهزة للبيانات الحقيقية.`);
    addResult(`🚀 يمكنك الآن البدء في إعلان موقعك!`);

    setIsClearing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">مسح البيانات التجريبية</h1>
          <p className="text-red-600 text-center">❌ يجب تسجيل الدخول أولاً للوصول إلى هذه الصفحة</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">مسح البيانات التجريبية</h1>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold text-yellow-800 mb-2">⚠️ تحذير مهم</h2>
            <p className="text-yellow-700">
              هذا الإجراء سيحذف جميع البيانات التجريبية من جميع الأسواق (الخضروات، الأراضي، المعدات، الحيوانات، المشاتل).
              لا يمكن التراجع عن هذا الإجراء. تأكد من أنك تريد المتابعة قبل الضغط على الزر.
            </p>
          </div>

          {!showConfirmation ? (
            <div className="text-center">
              <button
                onClick={() => setShowConfirmation(true)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                🧹 مسح جميع البيانات التجريبية
              </button>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-red-800 mb-2">تأكيد الحذف</h3>
                <p className="text-red-700 mb-4">
                  هل أنت متأكد من أنك تريد حذف جميع البيانات التجريبية؟ هذا الإجراء لا يمكن التراجع عنه.
                </p>
                <div className="space-x-4">
                  <button
                    onClick={clearAllTestData}
                    disabled={isClearing}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded transition-colors"
                  >
                    {isClearing ? '⏳ جاري المسح...' : '✅ نعم، احذف جميع البيانات'}
                  </button>
                  <button
                    onClick={() => setShowConfirmation(false)}
                    disabled={isClearing}
                    className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded transition-colors"
                  >
                    ❌ إلغاء
                  </button>
                </div>
              </div>
            </div>
          )}

          {results.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">نتائج العملية:</h3>
              <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                {results.map((result, index) => (
                  <div key={index} className="text-sm text-gray-700 mb-1 font-mono">
                    {result}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 