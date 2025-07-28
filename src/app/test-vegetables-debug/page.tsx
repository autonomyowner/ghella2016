'use client';

import { useState } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useSupabaseData } from '@/hooks/useSupabase';

export default function VegetablesDebugPage() {
  const { user } = useSupabaseAuth();
  const { addVegetable } = useSupabaseData();
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testVegetablesInsert = async () => {
    setLoading(true);
    setResults([]);

    addResult('🚀 بدء اختبار إدراج الخضروات...');

    if (!user) {
      addResult('❌ المستخدم غير مسجل دخول');
      setLoading(false);
      return;
    }

    addResult(`✅ المستخدم مسجل دخول: ${user.id}`);

    // Test data with explicit quantity
    const testData = {
      user_id: user.id,
      title: 'طماطم اختبار DEBUG',
      description: 'اختبار إدراج مع quantity صريح',
      vegetable_type: 'tomatoes',
      price: 150.00,
      currency: 'د.ج',
      quantity: 50,  // ← Explicit quantity
      unit: 'kg',
      freshness: 'excellent',
      organic: false,
      location: 'الجزائر العاصمة',
      packaging: 'packaged',
      harvest_date: new Date().toISOString().split('T')[0],
      is_available: true
    };

    addResult('📋 بيانات الاختبار:');
    addResult(JSON.stringify(testData, null, 2));

    try {
      addResult('🔄 محاولة الإدراج...');
      
      const startTime = Date.now();
      const result = await addVegetable(testData);
      const endTime = Date.now();
      
      addResult(`✅ نجح الإدراج في ${endTime - startTime}ms`);
      addResult(`📊 النتيجة: ${JSON.stringify(result, null, 2)}`);
      
    } catch (error) {
      addResult(`❌ فشل الإدراج: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
      
      if (error instanceof Error) {
        addResult(`🔍 تفاصيل الخطأ: ${error.stack || 'لا توجد تفاصيل إضافية'}`);
      }
    }

    setLoading(false);
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-black/50 backdrop-blur-lg border border-green-500/30 rounded-xl shadow-xl p-6">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">
            🥬 اختبار إدراج الخضروات - DEBUG
          </h1>

          <div className="flex gap-4 mb-6">
            <button
              onClick={testVegetablesInsert}
              disabled={loading}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
            >
              {loading ? '🔄 جاري الاختبار...' : '🧪 اختبار الإدراج'}
            </button>

            <button
              onClick={clearResults}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
            >
              🗑️ مسح النتائج
            </button>
          </div>

          <div className="bg-black/30 border border-green-500/20 rounded-lg p-4">
            <h2 className="text-xl font-semibold text-white mb-4">📊 النتائج:</h2>
            
            {results.length === 0 ? (
              <p className="text-gray-400">لا توجد نتائج بعد. اضغط على "اختبار الإدراج" للبدء.</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {results.map((result, index) => (
                  <div key={index} className="text-sm font-mono text-green-300 bg-black/20 p-2 rounded">
                    {result}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-300 mb-2">ℹ️ معلومات مهمة:</h3>
            <ul className="text-blue-200 text-sm space-y-1">
              <li>• حقل <code className="bg-blue-900/50 px-1 rounded">quantity</code> مطلوب (NOT NULL)</li>
              <li>• <code className="bg-blue-900/50 px-1 rounded">freshness</code> يجب أن يكون: excellent, good, fair, poor</li>
              <li>• <code className="bg-blue-900/50 px-1 rounded">packaging</code> يجب أن يكون: loose, packaged, bulk</li>
              <li>• <code className="bg-blue-900/50 px-1 rounded">user_id</code> مطلوب للـ RLS</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 