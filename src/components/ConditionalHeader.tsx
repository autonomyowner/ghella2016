'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';

export default function ConditionalHeader() {
  const pathname = usePathname();
  
  // Don't show header on the home page, /marketplace (and subpages), or /var (and subpages)
  // Normalize pathname (remove trailing slash)
  const normalizedPath = pathname.replace(/\/$/, '');
  if (
    normalizedPath === '' ||
    normalizedPath === '/marketplace' ||
    normalizedPath.startsWith('/marketplace') ||
    normalizedPath === '/var' ||
    normalizedPath.startsWith('/var/')
  ) {
    if (typeof window !== 'undefined') {
      // Debug log for troubleshooting
      console.log('ConditionalHeader hidden for path:', pathname);
    }
    return null;
  }
  
  return <Header />;
}