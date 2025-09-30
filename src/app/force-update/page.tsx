'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ForceUpdatePage() {
  const [updating, setUpdating] = useState(false);
  const [result, setResult] = useState<string>('');

  const forceUpdate = async () => {
    setUpdating(true);
    setResult('جاري التحديث...');
    
    try {
      const updateResult = await updateWebsiteSettings({
        homepage_subtitle: 'كل ما تحتاجه الفلاحة في مكان واحد',
        announcement_text: '🌟 منصة الغلة - كل ما تحتاجه الفلاحة في مكان واحد',
        about_content: 'منصة الغلة هي منصة رائدة في مجال التكنولوجيا الزراعية، تهدف إلى توفير كل ما يحتاجه المزارع في مكان واحد. نقدم خدمات متكاملة تشمل التسويق، التشغيل، والدعم الفني.',
        seo_description: 'منصة الغلة - كل ما تحتاجه الفلاحة في مكان واحد. خدمات زراعية متكاملة وتسويق المنتجات الزراعية.'
      });

      if (updateResult.success) {
        setResult('✅ تم التحديث بنجاح! اذهب إلى الصفحة الرئيسية لرؤية التغيير.');
      } else {
        setResult(`❌ خطأ في التحديث: ${updateResult.error}`);
      }
    } catch (error) {
      setResult(`❌ خطأ: ${error}`);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          تحديث نص الصفحة الرئيسية
        </h1>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">النص الجديد:</h2>
          <div className="bg-emerald-50 p-4 rounded-lg">
            <p className="text-emerald-800 font-medium">
              "كل ما تحتاجه الفلاحة في مكان واحد"
            </p>
          </div>
        </div>

        <button
          onClick={forceUpdate}
          disabled={updating}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-xl transition-colors mb-4"
        >
          {updating ? 'جاري التحديث...' : 'تحديث النص'}
        </button>

        {result && (
          <div className={`p-4 rounded-lg text-center ${
            result.includes('✅') ? 'bg-green-50 text-green-800' : 
            result.includes('❌') ? 'bg-red-50 text-red-800' : 
            'bg-blue-50 text-blue-800'
          }`}>
            {result}
          </div>
        )}

        <div className="mt-6 text-center">
          <Link 
            href="/" 
            className="text-emerald-600 hover:text-emerald-700 font-medium"
          >
            ← العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
} 
