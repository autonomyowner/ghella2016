'use client';

import { useEffect, useState } from 'react';
import { isFirebaseAvailable } from '@/lib/firebaseConfig';

export default function FirebaseStatus() {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    // Check Firebase availability after component mounts
    const checkFirebase = () => {
      const available = isFirebaseAvailable();
      setIsAvailable(available);
      
      if (!available) {
        console.warn('Firebase is not available. Some features may be limited.');
      }
    };

    // Check immediately
    checkFirebase();

    // Check again after a short delay to ensure initialization
    const timer = setTimeout(checkFirebase, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Don't render anything if Firebase is available or still checking
  if (isAvailable === null || isAvailable) {
    return null;
  }

  // Show a subtle warning if Firebase is not available
  return (
    <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded-lg shadow-lg z-50 max-w-sm">
      <div className="flex items-center">
        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <span className="text-sm">
          بعض الميزات غير متاحة حالياً. يرجى المحاولة لاحقاً.
        </span>
      </div>
    </div>
  );
} 