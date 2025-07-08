import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="gradient-bg-primary text-white spacing-responsive-xl relative overflow-hidden">
      <div className="absolute inset-0 animate-green-wave opacity-20"></div>
      <div className="container-responsive relative z-10">
        <div className="grid-responsive">
          <div className="card-responsive glass-green hover-green-glow col-span-full md:col-span-1">
            <h3 className="heading-responsive-h2 gradient-text-accent mb-4">الغلة</h3>
            <p className="text-responsive-base gradient-text-light leading-relaxed">
              بوابتك الموثوقة لشراء وبيع المعدات والأراضي الزراعية بأفضل الأسعار في المنطقة.
            </p>
          </div>
          
          <div className="card-responsive glass-green hover-green-glow">
            <h3 className="heading-responsive-h3 mb-4 gradient-text-light">اتصل بنا</h3>
            <div className="space-y-3">
              <p className="text-responsive-sm text-green-100 flex items-center gap-2">
                <span className="text-green-300">📧</span>
                support@elghella.com
              </p>
              <p className="text-responsive-sm text-green-100 flex items-center gap-2">
                <span className="text-green-300">📞</span>
                123-456-7890
              </p>
              <p className="text-responsive-sm text-green-100 flex items-center gap-2">
                <span className="text-green-300">📍</span>
                الرياض، المملكة العربية السعودية
              </p>
            </div>
          </div>
          
          <div className="card-responsive glass-green hover-green-glow">
            <h3 className="heading-responsive-h3 mb-4 gradient-text-light">روابط سريعة</h3>
            <div className="space-y-3">
              <a href="/about" className="block text-responsive-sm text-green-100 hover:text-green-300 transition-colors touch-friendly hover-green-glow">
                من نحن
              </a>
              <a href="/listings" className="block text-responsive-sm text-green-100 hover:text-green-300 transition-colors touch-friendly hover-green-glow">
                القوائم
              </a>
              <a href="/contact" className="block text-responsive-sm text-green-100 hover:text-green-300 transition-colors touch-friendly hover-green-glow">
                اتصل بنا
              </a>
              <a href="/privacy" className="block text-responsive-sm text-green-100 hover:text-green-300 transition-colors touch-friendly hover-green-glow">
                سياسة الخصوصية
              </a>
            </div>
          </div>
        </div>
        
        <div className="text-center spacing-responsive-lg border-t border-green-300/40 mt-8">
          <p className="text-responsive-sm gradient-text-accent">
            &copy; 2025 الغلة. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
