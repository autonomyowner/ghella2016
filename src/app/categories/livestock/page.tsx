'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LivestockCategoryPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to our animals page
    router.replace('/animals');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
        <p>جاري التوجيه إلى صفحة الحيوانات...</p>
      </div>
    </div>
  );
}
