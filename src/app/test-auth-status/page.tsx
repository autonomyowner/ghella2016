'use client';

import { useState } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

const TestAuthStatusPage: React.FC = () => {
  const { user } = useSupabaseAuth();
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testAuthStatus = async () => {
    setLoading(true);
    setResults([]);
    addResult('🚀 بدء اختبار حالة المصادقة...');

    try {
      // Test 1: Check user status
      addResult(`🔍 حالة المستخدم: ${user ? 'مسجل دخول' : 'غير مسجل دخول'}`);
      if (user) {
        addResult(`🔍 معرف المستخدم: ${user.id}`);
        addResult(`🔍 البريد الإلكتروني: ${user.email}`);
      }

      // Test 2: Check Supabase connection
      addResult('🧪 اختبار الاتصال بـ Supabase...');
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

      // Test 3: Check if we can query the database
      addResult('🧪 اختبار استعلام قاعدة البيانات...');
      const { data: testData, error: testError } = await supabase
        .from('land_listings')
        .select('id')
        .limit(1);

      if (testError) {
        addResult(`❌ فشل في استعلام قاعدة البيانات: ${testError.message}`);
      } else {
        addResult(`✅ نجح استعلام قاعدة البيانات: ${testData?.length || 0} نتائج`);
      }

      // Test 4: Check current user session
      addResult('🧪 اختبار جلسة المستخدم الحالي...');
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        addResult(`❌ فشل في الحصول على الجلسة: ${sessionError.message}`);
      } else if (session) {
        addResult(`✅ جلسة المستخدم موجودة: ${session.user.id}`);
        addResult(`✅ البريد الإلكتروني: ${session.user.email}`);
      } else {
        addResult('⚠️ لا توجد جلسة مستخدم نشطة');
      }

      // Test 5: Try to get user info from Supabase
      addResult('🧪 اختبار معلومات المستخدم من Supabase...');
      const { data: { user: supabaseUser }, error: userError } = await supabase.auth.getUser();

      if (userError) {
        addResult(`❌ فشل في الحصول على معلومات المستخدم: ${userError.message}`);
      } else if (supabaseUser) {
        addResult(`✅ معلومات المستخدم من Supabase: ${supabaseUser.id}`);
        addResult(`✅ البريد الإلكتروني: ${supabaseUser.email}`);
      } else {
        addResult('⚠️ لا توجد معلومات مستخدم من Supabase');
      }

    } catch (error) {
      addResult(`❌ خطأ عام: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
      console.error('Full error:', error);
    }

    addResult('✅ انتهى اختبار حالة المصادقة');
    setLoading(false);
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">🔐 اختبار حالة المصادقة</h1>
          <p className="text-gray-600 text-lg">اختبار حالة المصادقة والاتصال بـ Supabase</p>
        </div>

        {/* User Status */}
        <div className={`p-4 rounded-lg mb-6 ${user ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">
                {user ? '✅ المستخدم مسجل دخول' : '⚠️ المستخدم غير مسجل دخول'}
              </h3>
              <p className="text-sm text-gray-600">
                {user ? `البريد الإلكتروني: ${user.email}` : 'يجب تسجيل الدخول لاختبار المصادقة'}
              </p>
            </div>
          </div>
        </div>

        {/* Test Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex gap-4 mb-4">
            <button
              onClick={testAuthStatus}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '🔄 جاري الاختبار...' : '🧪 اختبار حالة المصادقة'}
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

export default TestAuthStatusPage; 