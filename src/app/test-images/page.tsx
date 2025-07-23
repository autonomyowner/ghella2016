'use client';

import React from 'react';
import Image from 'next/image';

const TestImagesPage = () => {
  const founders = [
    { name: 'إسلام', image: '/assets/islam.jpg' },
    { name: 'عصام', image: '/assets/issam.jpg' },
    { name: 'نونو', image: '/assets/nono.jpg' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">اختبار الصور</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {founders.map((founder) => (
            <div key={founder.name} className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">{founder.name}</h2>
              
              <div className="relative w-full h-64 rounded-lg overflow-hidden mb-4">
                <Image
                  src={founder.image}
                  alt={founder.name}
                  className="w-full h-full object-cover"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  onError={(e) => {
                    console.error('Image failed to load:', founder.image);
                    (e.currentTarget as HTMLElement).style.display = 'none';
                    ((e.currentTarget as HTMLElement).nextElementSibling as HTMLElement).style.display = 'flex';
                  }}
                  onLoadingComplete={() => {
                    console.log('Image loaded successfully:', founder.image);
                  }}
                />
                <div 
                  className="hidden w-full h-full bg-gray-200 items-center justify-center"
                  style={{ display: 'none' }}
                >
                  <span className="text-gray-500 text-lg">فشل في تحميل الصورة</span>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-600">مسار الصورة: {founder.image}</p>
                <button
                  onClick={() => {
                    const img = new window.Image();
                    img.onload = () => console.log('Image loads successfully:', founder.image);
                    img.onerror = () => console.error('Image fails to load:', founder.image);
                    img.src = founder.image;
                  }}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  اختبار التحميل
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 p-4 bg-gray-800 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">معلومات التصحيح:</h3>
          <p className="text-gray-300 mb-2">افتح وحدة تحكم المتصفح (F12) لرؤية رسائل التحميل</p>
          <p className="text-gray-300">إذا لم تظهر الصور، تحقق من:</p>
          <ul className="text-gray-300 list-disc list-inside mt-2">
            <li>وجود الملفات في مجلد public/assets</li>
            <li>صحة أسماء الملفات</li>
            <li>إعدادات Next.js للصور</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestImagesPage; 
