'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function QuickFixPage() {
  const [status, setStatus] = useState('');

  const updateText = async () => {
    setStatus('جاري التحديث...');
    
    try {
      const response = await fetch('/api/update-homepage-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          homepage_subtitle: 'كل ما تحتاجه الفلاحة في مكان واحد'
        }),
      });

      if (response.ok) {
        setStatus('✅ تم التحديث بنجاح! اذهب إلى الصفحة الرئيسية.');
      } else {
        setStatus('❌ خطأ في التحديث');
      }
    } catch (error) {
      setStatus('❌ خطأ في الاتصال');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          تحديث سريع للنص
        </h1>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-4">النص الجديد:</p>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-green-800 font-medium text-lg">
              "كل ما تحتاجه الفلاحة في مكان واحد"
            </p>
          </div>
        </div>

        <button
          onClick={updateText}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors mb-4"
        >
          تحديث النص
        </button>

        {status && (
          <div className={`p-4 rounded-lg text-center ${
            status.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {status}
          </div>
        )}

        <div className="mt-6 text-center">
          import Link from 'next/link';
<Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
  ← العودة للصفحة الرئيسية
</Link>
        </div>
      </div>
    </div>
  );
} 
