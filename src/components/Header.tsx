'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 frosted-panel backdrop-blur-2xl ${isScrolled ? 'shadow-lg' : ''}`} style={{padding: '0.5rem 0', transitionTimingFunction: 'cubic-bezier(0.4,0,0.2,1)'}}>
      <div className="container mx-auto flex items-center justify-between px-2 md:px-4" style={{minHeight: '48px', transition: 'all 0.5s cubic-bezier(0.4,0,0.2,1)'}}>
        {/* Logo */}
        <Link href="/" className="text-lg md:text-xl font-bold gradient-text-accent glow-green whitespace-nowrap transition-all duration-500 hover:scale-105">
          الغلة
        </Link>
        {/* Nav Links */}
        <nav className="flex items-center gap-2 md:gap-6 text-white/90 text-sm md:text-base font-medium">
          <Link href="/" className="hover:text-white transition-colors duration-300">الرئيسية</Link>
          <Link href="/listings" className="hover:text-white transition-colors duration-300">القوائم</Link>
          <Link href="/about" className="hover:text-white transition-colors duration-300">من نحن</Link>
          <Link href="/contact" className="hover:text-white transition-colors duration-300">اتصل بنا</Link>
        </nav>
        {/* Search Bar */}
        <div className="relative w-32 md:w-56">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="ابحث..."
            className="w-full rounded-full px-3 py-1.5 bg-white/10 text-white placeholder-white/70 border-none focus:outline-none focus:ring-2 focus:ring-brand-primary/30 text-sm transition-all duration-500"
            style={{minWidth: '80px'}}
          />
          <button className="absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full text-brand-primary hover:bg-brand-primary/10 transition-colors duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 21-4.34-4.34"></path><circle cx="11" cy="11" r="8"></circle></svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
