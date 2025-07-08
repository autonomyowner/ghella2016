import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="relative overflow-hidden bg-transparent pt-8 pb-4">
      <div className="absolute inset-0 pointer-events-none" style={{background: 'linear-gradient(135deg, #181d23 60%, #1de78222 100%)'}} />
      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="frosted-panel">
            <h3 className="text-2xl font-bold gradient-text mb-4 glow-green">الغلة</h3>
            <p className="text-base text-white/80 leading-relaxed">
              بوابتك الموثوقة لشراء وبيع المعدات والأراضي الزراعية بأفضل الأسعار في المنطقة.
            </p>
          </div>
          <div className="frosted-panel">
            <h3 className="text-xl font-semibold mb-4 gradient-text glow-green">اتصل بنا</h3>
            <div className="space-y-3">
              <p className="text-sm text-green-100 flex items-center gap-2">
                <span className="glow-green">📧</span>
                support@elghella.com
              </p>
              <p className="text-sm text-green-100 flex items-center gap-2">
                <span className="glow-green">📞</span>
                123-456-7890
              </p>
              <p className="text-sm text-green-100 flex items-center gap-2">
                <span className="glow-green">📍</span>
                الرياض، المملكة العربية السعودية
              </p>
            </div>
          </div>
          <div className="frosted-panel">
            <h3 className="text-xl font-semibold mb-4 gradient-text glow-green">روابط سريعة</h3>
            <div className="space-y-3">
              <a href="/about" className="block text-sm text-green-100 hover:text-brand-primary transition-colors glow-green">
                من نحن
              </a>
              <a href="/listings" className="block text-sm text-green-100 hover:text-brand-primary transition-colors glow-green">
                القوائم
              </a>
              <a href="/contact" className="block text-sm text-green-100 hover:text-brand-primary transition-colors glow-green">
                اتصل بنا
              </a>
              <a href="/privacy" className="block text-sm text-green-100 hover:text-brand-primary transition-colors glow-green">
                سياسة الخصوصية
              </a>
            </div>
          </div>
        </div>
        <div className="text-center mt-8 border-t border-green-300/40 pt-4">
          <p className="text-sm gradient-text-accent">
            &copy; 2025 الغلة. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
