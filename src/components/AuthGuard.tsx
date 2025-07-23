'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  fallback = (
    <div className="min-h-screen gradient-bg-primary pt-20 flex items-center justify-center">
      <div role="status" aria-live="polite" className="flex flex-col items-center gap-4">
        <svg className="animate-spin h-12 w-12 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10" strokeWidth="4" stroke="currentColor" strokeOpacity="0.2" />
          <path d="M12 2a10 10 0 0 1 10 10" strokeWidth="4" stroke="currentColor" />
        </svg>
        <span className="text-white/80 text-lg">جاري التحقق من تسجيل الدخول...</span>
      </div>
    </div>
  )
}) => {
  const { user, loading } = useSupabaseAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <>{fallback}</>;
  }

  if (!user) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default AuthGuard; 