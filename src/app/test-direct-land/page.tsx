'use client';

import { useState } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

const TestDirectLandPage: React.FC = () => {
  const { user } = useSupabaseAuth();
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testDirectInsert = async () => {
    if (!user) {
      addResult('❌ يجب تسجيل الدخول أولاً');
      return;
    }

    setLoading(true);
    setResults([]);
    addResult('🚀 بدء اختبار الإدراج المباشر...');

    try {
      // Import Supabase client directly
      const { createClient } = await import('@supabase/supabase-js');
      
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      addResult(`🔍 Supabase URL: ${supabaseUrl ? 'موجود' : 'غير موجود'}`);
      addResult(`🔍 Supabase Key: ${supabaseKey ? 'موجود' : 'غير موجود'}`);

      if (!supabaseUrl || !supabaseKey) {
        addResult('❌ متغيرات البيئة غير موجودة');
        return;
      }

      const supabase = createClient(supabaseUrl, supabaseKey);

      // Test data with explicit area_size
      const testData = {
        user_id: user.id,
        title: 'أرض اختبار مباشر',
        description: 'اختبار الإدراج المباشر',
        price: 50000,
        area_size: 1000,
        area_unit: 'hectare',
        location: 'الجزائر العاصمة',
        listing_type: 'sale'
      };

      addResult(`🔍 البيانات المرسلة: ${JSON.stringify(testData)}`);
      addResult(`🔍 area_size موجود: ${testData.area_size !== undefined ? 'نعم' : 'لا'}`);
      addResult(`🔍 area_size القيمة: ${testData.area_size}`);

      // Test 1: Direct insert with explicit fields
      addResult('🧪 اختبار 1: إدراج مباشر مع الحقول الصريحة...');
      
      const { data: result1, error: error1 } = await supabase
        .from('land_listings')
        .insert([testData])
        .select()
        .single();

      if (error1) {
        addResult(`❌ اختبار 1 فشل: ${error1.message}`);
        addResult(`❌ تفاصيل الخطأ: ${JSON.stringify(error1)}`);
      } else {
        addResult(`✅ اختبار 1 نجح: ${result1.id}`);
        addResult(`✅ البيانات المدرجة: ${JSON.stringify(result1)}`);
        
        // Clean up
        await supabase.from('land_listings').delete().eq('id', result1.id);
        addResult('🧹 تم تنظيف البيانات التجريبية');
      }

      // Test 2: Insert with minimal fields
      addResult('🧪 اختبار 2: إدراج بالحد الأدنى من الحقول...');
      
      const minimalData = {
        user_id: user.id,
        title: 'أرض اختبار بسيط',
        price: 50000,
        area_size: 1000,
        location: 'الجزائر العاصمة'
      };

      addResult(`🔍 البيانات البسيطة: ${JSON.stringify(minimalData)}`);

      const { data: result2, error: error2 } = await supabase
        .from('land_listings')
        .insert([minimalData])
        .select()
        .single();

      if (error2) {
        addResult(`❌ اختبار 2 فشل: ${error2.message}`);
        addResult(`❌ تفاصيل الخطأ: ${JSON.stringify(error2)}`);
      } else {
        addResult(`✅ اختبار 2 نجح: ${result2.id}`);
        
        // Clean up
        await supabase.from('land_listings').delete().eq('id', result2.id);
        addResult('🧹 تم تنظيف البيانات التجريبية');
      }

      // Test 3: Check table structure (simplified)
      addResult('🧪 اختبار 3: فحص هيكل الجدول...');
      
      const { data: tableInfo, error: error3 } = await supabase
        .from('land_listings')
        .select('*')
        .limit(1);

      if (error3) {
        addResult(`❌ فحص الهيكل فشل: ${error3.message}`);
      } else {
        addResult(`✅ هيكل الجدول متاح للاستعلام`);
        addResult(`✅ عدد الحقول: ${Object.keys(tableInfo?.[0] || {}).length}`);
      }

    } catch (error) {
      addResult(`❌ خطأ عام: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
      console.error('Full error:', error);
    }

    addResult('✅ انتهى الاختبار المباشر');
    setLoading(false);
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">🔧 اختبار الإدراج المباشر</h1>
          <p className="text-gray-600 text-lg">اختبار الإدراج المباشر في جدول الأراضي</p>
        </div>

        {/* User Status */}
        <div className={`p-4 rounded-lg mb-6 ${user ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">
                {user ? '✅ المستخدم مسجل دخول' : '⚠️ المستخدم غير مسجل دخول'}
              </h3>
              <p className="text-sm text-gray-600">
                {user ? `البريد الإلكتروني: ${user.email}` : 'يجب تسجيل الدخول لاختبار الإدراج المباشر'}
              </p>
            </div>
          </div>
        </div>

        {/* Test Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex gap-4 mb-4">
            <button
              onClick={testDirectInsert}
              disabled={loading || !user}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '🔄 جاري الاختبار...' : '🧪 اختبار الإدراج المباشر'}
            </button>
            <button
              onClick={clearResults}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              🗑️ مسح النتائج
            </button>
          </div>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">📊 النتائج</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {results.map((result, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded border-l-4 border-blue-500">
                  <pre className="text-sm whitespace-pre-wrap">{result}</pre>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestDirectLandPage; 