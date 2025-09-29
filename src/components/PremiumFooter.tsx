'use client';

import React from 'react';
import Link from 'next/link';

interface WebsiteSettings {
  site_title: string;
  site_description: string;
  facebook_url?: string;
  twitter_url?: string;
  instagram_url?: string;
  linkedin_url?: string;
  youtube_url?: string;
}

interface PremiumFooterProps {
  settings: WebsiteSettings;
}

const PremiumFooter: React.FC<PremiumFooterProps> = ({ settings }) => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    services: [
      { name: 'سوق الغلة', href: '/marketplace' },
      { name: 'إدارة المزرعة', href: '/services' },
      { name: 'الاستشارات', href: '/VAR' },
      { name: 'التقنيات الذكية', href: '/tech' }
    ],
    support: [
      { name: 'مركز المساعدة', href: '/help' },
      { name: 'الدعم الفني', href: '/support' },
      { name: 'الأسئلة الشائعة', href: '/faq' },
      { name: 'اتصل بنا', href: '/contact' }
    ],
    company: [
      { name: 'عن المنصة', href: '/about' },
      { name: 'فريق العمل', href: '/team' },
      { name: 'الوظائف', href: '/careers' },
      { name: 'الأخبار', href: '/news' }
    ],
    legal: [
      { name: 'شروط الاستخدام', href: '/terms' },
      { name: 'سياسة الخصوصية', href: '/privacy' },
      { name: 'سياسة ملفات تعريف الارتباط', href: '/cookies' },
      { name: 'إشعار قانوني', href: '/legal' }
    ]
  };

  const socialLinks = [
    { name: 'Facebook', icon: 'fab fa-facebook', url: settings.facebook_url || '#' },
    { name: 'Twitter', icon: 'fab fa-twitter', url: settings.twitter_url || '#' },
    { name: 'Instagram', icon: 'fab fa-instagram', url: settings.instagram_url || '#' },
    { name: 'LinkedIn', icon: 'fab fa-linkedin', url: settings.linkedin_url || '#' },
    { name: 'YouTube', icon: 'fab fa-youtube', url: settings.youtube_url || '#' }
  ];

  return (
    <footer className="relative z-10 bg-gradient-to-br from-black/80 to-emerald-900/40 border-t border-emerald-500/20">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 space-x-reverse mb-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg overflow-hidden border-2 border-emerald-400/30">
                <img src="/assets/logo o.jpg" alt="الغلة" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white">{settings.site_title}</h3>
                <p className="text-emerald-300 text-sm">منصة الزراعة الذكية</p>
              </div>
            </div>
            
            <p className="text-emerald-200 mb-6 leading-relaxed">
              {settings.site_description}
            </p>
            
            {/* Social Media */}
            <div className="flex space-x-4 space-x-reverse">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-xl flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                  title={social.name}
                >
                  <i className={`${social.icon} text-lg`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-4">الخدمات</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-emerald-300 hover:text-emerald-400 transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-4">الدعم</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-emerald-300 hover:text-emerald-400 transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-4">الشركة</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-emerald-300 hover:text-emerald-400 transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="mt-12 pt-8 border-t border-emerald-500/20">
          <div className="text-center">
            <h4 className="text-white font-bold text-xl mb-4">اشترك في النشرة الإخبارية</h4>
            <p className="text-emerald-200 mb-6">احصل على آخر الأخبار والتحديثات من منصة الغلة</p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                className="flex-1 px-4 py-3 bg-white/10 border border-emerald-500/30 rounded-xl text-white placeholder-emerald-300 focus:outline-none focus:border-emerald-400 transition-colors"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105">
                اشتراك
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-emerald-500/20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
            {/* Copyright */}
            <div className="text-center md:text-right">
              <p className="text-emerald-300 text-sm">
                حقوق النشر © {currentYear} {settings.site_title}. جميع الحقوق محفوظة
              </p>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center items-center space-x-6 space-x-reverse text-sm">
              {footerLinks.legal.map((link, index) => (
                <Link 
                  key={index}
                  href={link.href}
                  className="text-emerald-300 hover:text-emerald-400 transition-colors duration-300"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Made with Love */}
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="bg-black/40 py-4">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 text-white/60 text-sm">
            <div className="flex items-center">
              <i className="fas fa-shield-alt text-emerald-400 mr-2"></i>
              <span>حماية SSL</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-certificate text-emerald-400 mr-2"></i>
              <span>معتمدة من وزارة الزراعة</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-award text-emerald-400 mr-2"></i>
              <span>جودة عالية</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-clock text-emerald-400 mr-2"></i>
              <span>دعم 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PremiumFooter; 