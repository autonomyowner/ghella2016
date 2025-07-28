'use client';

import { useState } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

const TestDirectVegetablesPage: React.FC = () => {
  const { user } = useSupabaseAuth();
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testDirectVegetablesInsert = async () => {
    if (!user) {
      addResult('❌ يجب تسجيل الدخول أولاً');
      return;
    }

    setLoading(true);
    setResults([]);
    addResult('🚀 بدء اختبار الإدراج المباشر للخضروات...');

    try {
      // Import Supabase client directly
      const { createClient } = await import('@supabase/supabase-js');
      
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      
      addResult(`🔍 Supabase URL: ${supabaseUrl ? 'موجود' : 'غير موجود'}`);
      addResult(`🔍 Supabase Key: ${supabaseKey ? 'موجود' : 'غير موجود'}`);
      addResult(`🔍 Service Role Key: ${serviceRoleKey ? 'موجود' : 'غير موجود'}`);

      if (!supabaseUrl || !supabaseKey) {
        addResult('❌ متغيرات البيئة غير موجودة');
        return;
      }

      // Create both anon and service role clients
      const supabase = createClient(supabaseUrl, supabaseKey);
      const supabaseAdmin = serviceRoleKey ? createClient(supabaseUrl, serviceRoleKey) : null;

      // Test data with explicit quantity and freshness
      const testData = {
        user_id: user.id,
        title: 'خضروات اختبار مباشر',
        description: 'اختبار الإدراج المباشر',
        price: 100,
        vegetable_type: 'tomatoes',
        quantity: 10,
        unit: 'kg',
        freshness: 'excellent',
        organic: false,
        location: 'الجزائر العاصمة',
        packaging: 'packaged',
        harvest_date: new Date().toISOString().split('T')[0]
      };

      addResult(`🔍 البيانات المرسلة: ${JSON.stringify(testData)}`);
      addResult(`🔍 quantity موجود: ${testData.quantity !== undefined ? 'نعم' : 'لا'}`);
      addResult(`🔍 quantity القيمة: ${testData.quantity}`);
      addResult(`🔍 freshness القيمة: ${testData.freshness}`);

      // Test 1: Direct insert with explicit fields
      addResult('🧪 اختبار 1: إدراج مباشر مع الحقول الصريحة...');
      
      let result1, error1;
      
      // Try with regular client first
      const { data: regularResult, error: regularError } = await supabase
        .from('vegetables')
        .insert([testData])
        .select()
        .single();

      if (regularError) {
        addResult(`⚠️ فشل مع العميل العادي: ${regularError.message}`);
        
        // Try with admin client if available
        if (supabaseAdmin) {
          addResult('🔄 محاولة مع عميل الإدارة...');
          const { data: adminResult, error: adminError } = await supabaseAdmin
            .from('vegetables')
            .insert([testData])
            .select()
            .single();

          if (adminError) {
            addResult(`❌ اختبار 1 فشل: ${adminError.message}`);
            addResult(`❌ تفاصيل الخطأ: ${JSON.stringify(adminError)}`);
            result1 = null;
            error1 = adminError;
          } else {
            addResult(`✅ اختبار 1 نجح مع عميل الإدارة: ${adminResult.id}`);
            addResult(`✅ البيانات المدرجة: ${JSON.stringify(adminResult)}`);
            result1 = adminResult;
            error1 = null;
            
            // Clean up
            await supabaseAdmin.from('vegetables').delete().eq('id', adminResult.id);
            addResult('🧹 تم تنظيف البيانات التجريبية');
          }
        } else {
          addResult('❌ مفتاح الإدارة غير متوفر للاختبار');
          result1 = null;
          error1 = regularError;
        }
      } else {
        addResult(`✅ اختبار 1 نجح: ${regularResult.id}`);
        addResult(`✅ البيانات المدرجة: ${JSON.stringify(regularResult)}`);
        result1 = regularResult;
        error1 = null;
        
        // Clean up
        await supabase.from('vegetables').delete().eq('id', regularResult.id);
        addResult('🧹 تم تنظيف البيانات التجريبية');
      }

      // Test 2: Insert with different freshness values
      addResult('🧪 اختبار 2: إدراج بقيم freshness مختلفة...');
      
      const freshnessValues = ['excellent', 'good', 'fair', 'poor'];
      
      for (const freshness of freshnessValues) {
        const testData2 = {
          ...testData,
          title: `خضروات اختبار ${freshness}`,
          freshness: freshness
        };

        addResult(`🔍 اختبار freshness: ${freshness}`);
        
        let result2, error2;
        
        // Try with regular client first
        const { data: regularResult2, error: regularError2 } = await supabase
          .from('vegetables')
          .insert([testData2])
          .select()
          .single();

        if (regularError2) {
          // Try with admin client if available
          if (supabaseAdmin) {
            const { data: adminResult2, error: adminError2 } = await supabaseAdmin
              .from('vegetables')
              .insert([testData2])
              .select()
              .single();

            if (adminError2) {
              addResult(`❌ فشل مع freshness "${freshness}": ${adminError2.message}`);
              result2 = null;
              error2 = adminError2;
            } else {
              addResult(`✅ نجح مع freshness "${freshness}": ${adminResult2.id}`);
              result2 = adminResult2;
              error2 = null;
              
              // Clean up
              await supabaseAdmin.from('vegetables').delete().eq('id', adminResult2.id);
              addResult(`🧹 تم تنظيف البيانات التجريبية لـ ${freshness}`);
              break; // Stop after first success
            }
          } else {
            addResult(`❌ فشل مع freshness "${freshness}": ${regularError2.message}`);
            result2 = null;
            error2 = regularError2;
          }
        } else {
          addResult(`✅ نجح مع freshness "${freshness}": ${regularResult2.id}`);
          result2 = regularResult2;
          error2 = null;
          
          // Clean up
          await supabase.from('vegetables').delete().eq('id', regularResult2.id);
          addResult(`🧹 تم تنظيف البيانات التجريبية لـ ${freshness}`);
          break; // Stop after first success
        }
      }

      // Test 3: Insert with different packaging values
      addResult('🧪 اختبار 3: إدراج بقيم packaging مختلفة...');
      
      const packagingValues = ['loose', 'packaged', 'bulk'];
      
      for (const packaging of packagingValues) {
        const testData3 = {
          ...testData,
          title: `خضروات اختبار ${packaging}`,
          packaging: packaging
        };

        addResult(`🔍 اختبار packaging: ${packaging}`);
        
        let result3, error3;
        
        // Try with regular client first
        const { data: regularResult3, error: regularError3 } = await supabase
          .from('vegetables')
          .insert([testData3])
          .select()
          .single();

        if (regularError3) {
          // Try with admin client if available
          if (supabaseAdmin) {
            const { data: adminResult3, error: adminError3 } = await supabaseAdmin
              .from('vegetables')
              .insert([testData3])
              .select()
              .single();

            if (adminError3) {
              addResult(`❌ فشل مع packaging "${packaging}": ${adminError3.message}`);
              result3 = null;
              error3 = adminError3;
            } else {
              addResult(`✅ نجح مع packaging "${packaging}": ${adminResult3.id}`);
              result3 = adminResult3;
              error3 = null;
              
              // Clean up
              await supabaseAdmin.from('vegetables').delete().eq('id', adminResult3.id);
              addResult(`🧹 تم تنظيف البيانات التجريبية لـ ${packaging}`);
              break; // Stop after first success
            }
          } else {
            addResult(`❌ فشل مع packaging "${packaging}": ${regularError3.message}`);
            result3 = null;
            error3 = regularError3;
          }
        } else {
          addResult(`✅ نجح مع packaging "${packaging}": ${regularResult3.id}`);
          result3 = regularResult3;
          error3 = null;
          
          // Clean up
          await supabase.from('vegetables').delete().eq('id', regularResult3.id);
          addResult(`🧹 تم تنظيف البيانات التجريبية لـ ${packaging}`);
          break; // Stop after first success
        }
      }

      // Test 4: Check table structure
      addResult('🧪 اختبار 4: فحص هيكل الجدول...');
      
      const { data: tableInfo, error: error4 } = await supabase
        .from('vegetables')
        .select('*')
        .limit(1);

      if (error4) {
        addResult(`❌ فحص الهيكل فشل: ${error4.message}`);
      } else {
        addResult(`✅ هيكل الجدول متاح للاستعلام`);
        addResult(`✅ عدد الحقول: ${Object.keys(tableInfo?.[0] || {}).length}`);
      }

    } catch (error) {
      addResult(`❌ خطأ عام: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
      console.error('Full error:', error);
    }

    addResult('✅ انتهى اختبار الإدراج المباشر للخضروات');
    setLoading(false);
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">🥬 اختبار الإدراج المباشر للخضروات</h1>
          <p className="text-gray-600 text-lg">اختبار الإدراج المباشر في جدول الخضروات</p>
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
              onClick={testDirectVegetablesInsert}
              disabled={loading || !user}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '🔄 جاري الاختبار...' : '🥬 اختبار الإدراج المباشر للخضروات'}
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
                <div key={index} className="p-3 bg-gray-50 rounded border-l-4 border-green-500">
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

export default TestDirectVegetablesPage; 