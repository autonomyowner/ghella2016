'use client';

import React from 'react';
import ImageGallery from '@/components/ImageGallery';

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section with Video Background */}
      <section className="relative min-h-screen w-full overflow-hidden flex items-center">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/assets/Videoplayback2.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Enhanced Dark overlay with green gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-green-900/40 to-black/70"></div>

        {/* Responsive Login Card - Hidden on mobile, beautiful on desktop */}
        <div className="hide-mobile absolute top-1/2 right-4 lg:right-16 xl:right-24 -translate-y-1/2 w-80 lg:w-96 xl:w-[28rem] card-responsive shadow-2xl animate-fade-in-up z-20 glass-green">
          <h3 className="heading-responsive-h3 text-white mb-4 lg:mb-6 text-center gradient-text-light">دخول العضوية</h3>
          <form className="space-y-4 lg:space-y-6">
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              className="w-full p-3 lg:p-4 xl:p-5 rounded-xl glass-green-dark text-white placeholder-white/70 border border-green-400/30 focus:border-green-300 focus:outline-none focus-ring transition-all text-responsive-base hover-green-glow"
            />
            <input
              type="password"
              placeholder="كلمة المرور"
              className="w-full p-3 lg:p-4 xl:p-5 rounded-xl glass-green-dark text-white placeholder-white/70 border border-green-400/30 focus:border-green-300 focus:outline-none focus-ring transition-all text-responsive-base hover-green-glow"
            />
            <button className="w-full btn-responsive btn-ultra font-bold hover-scale animate-green-glow">
              دخول
            </button>
          </form>
          <p className="text-center text-white/80 mt-4 lg:mt-6 text-responsive-sm">
            ليس لديك حساب؟ <a href="/signup" className="gradient-text-accent hover:gradient-text-light transition-colors">انشئ حساب جديد</a>
          </p>
        </div>

        {/* Enhanced Main Content - Fully Responsive */}
        <div className="container-responsive relative z-10 text-center">
          <div className="max-w-6xl mx-auto">
            <div className="relative mb-4 sm:mb-6 lg:mb-12">
              <h1 className="heading-responsive-h1 text-white mb-3 sm:mb-4 lg:mb-8 animate-fade-in-up leading-tight">
                الغلة
              </h1>
              
              {/* Animated underline - responsive */}
              <div className="flex justify-center mb-3 sm:mb-4 lg:mb-8">
                <svg 
                  width="80" 
                  height="8" 
                  className="sm:w-120 sm:h-12 md:w-150 md:h-15 lg:w-64 lg:h-6 animate-fade-in-up" 
                  style={{animationDelay: '0.3s'}}
                >
                  <path d="M10 4 Q40 0 70 4" stroke="#10b981" strokeWidth="2" fill="none" className="animate-pulse"/>
                </svg>
              </div>
            </div>
            
            <h2 className="heading-responsive-h2 gradient-text-accent mb-3 sm:mb-4 lg:mb-8 font-medium animate-fade-in-up leading-relaxed" style={{animationDelay: '0.6s'}}>
              منتجات طبيعية • خدمات زراعية • استشارات متخصصة
            </h2>
            
            <p className="text-responsive-lg text-green-100/90 mb-4 sm:mb-6 lg:mb-16 max-w-4xl mx-auto leading-relaxed animate-fade-in-up" style={{animationDelay: '0.9s'}}>
              منصتك الرقمية الشاملة للتجارة الزراعية في المملكة العربية السعودية
            </p>

            {/* Enhanced Service Bubbles - Fully Responsive */}
            <div className="relative mt-6 sm:mt-8 lg:mt-16 mb-6 sm:mb-8">
              <div className="heading-responsive-h3 text-white mb-4 sm:mb-6 lg:mb-12 text-center animate-fade-in-up" style={{animationDelay: '1.0s'}}>
                استكشف عالم الزراعة الرقمي
              </div>
              
              {/* Centered Bubbles Container */}
              <div className="service-bubbles-container">
                <div className="bubbles-grid">
                {[
                  { icon: '🌱', text: 'المشاتل' },
                  { icon: '👨‍🌾', text: 'اليد العاملة الفلاحية' },
                  { icon: '🚜', text: 'كراء المعدات الفلاحية' },
                  { icon: '�️', text: 'كراء الاراضي الفلاحية' },
                  { icon: '🍅', text: 'شراء وبيع المنتجات الطازجة' },
                  { icon: '🚚', text: 'التوصيل' },
                  { icon: '�', text: 'خدمات التحليل و الدراسة' }
                ].map((service, idx) => (
                  <div
                    key={idx}
                    className="floating-bubble service-bubble-glow animate-float card-ultra group cursor-pointer"
                    style={{animationDelay: `${idx * 0.15}s`}}
                  >
                    <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-22 lg:h-22 xl:w-28 xl:h-28 glass-green rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:shadow-2xl group-hover:border-green-300/80 group-hover:bg-gradient-to-br group-hover:from-green-400/20 group-hover:to-green-600/30 animate-green-glow border border-green-400/40">
                      <span className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl transition-all duration-500 group-hover:scale-125 group-hover:drop-shadow-lg">
                        {service.icon}
                      </span>
                    </div>
                    <p className="text-white text-xs sm:text-sm lg:text-base xl:text-lg mt-3 lg:mt-4 text-center leading-tight font-medium transition-all duration-300 group-hover:text-green-200 group-hover:scale-105 group-hover:font-semibold px-1">
                      {service.text}
                    </p>
                  </div>
                ))}
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-green-300 to-transparent opacity-70 animate-green-glow"></div>
              <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-green-300 to-transparent opacity-70 animate-green-glow" style={{animationDelay: '1s'}}></div>
            </div>

            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center items-center mt-8 lg:mt-12 animate-fade-in-up" style={{animationDelay: '1.2s'}}>
              <a
                href="/listings"
                className="btn-ultra px-8 lg:px-12 py-4 lg:py-5 rounded-2xl font-bold text-lg lg:text-xl hover-scale shadow-2xl w-full sm:w-auto text-center"
              >
                <span className="mr-2">🚀</span>
                تصفح المنتجات
              </a>
              <a
                href="/listings/new"
                className="glass-green-light px-8 lg:px-12 py-4 lg:py-5 rounded-2xl font-bold text-lg lg:text-xl hover-scale shadow-2xl w-full sm:w-auto text-center border border-green-300/40 hover-green-glow"
              >
                <span className="mr-2">➕</span>
                أضف منتجك
              </a>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Mobile Quick Actions - Only visible on mobile */}
      <section className="lg:hidden gradient-bg-secondary py-6 relative">
        <div className="container mx-auto px-4">
          <h3 className="text-xl font-bold gradient-text-light text-center mb-4">إجراءات سريعة</h3>
          <div className="grid grid-cols-2 gap-4">
            <a
              href="/auth/login"
              className="glass-green-dark rounded-xl p-4 text-center hover:scale-105 transition-all duration-300 hover-green-glow"
            >
              <div className="w-12 h-12 gradient-bg-accent rounded-full flex items-center justify-center mx-auto mb-2 animate-green-pulse">
                <span className="text-2xl">👤</span>
              </div>
              <span className="text-white font-medium">تسجيل دخول</span>
            </a>
            <a
              href="/listings/new"
              className="glass-green-dark rounded-xl p-4 text-center hover:scale-105 transition-all duration-300 hover-green-glow"
            >
              <div className="w-12 h-12 gradient-bg-primary rounded-full flex items-center justify-center mx-auto mb-2 animate-green-pulse">
                <span className="text-2xl">➕</span>
              </div>
              <span className="text-white font-medium">إضافة منتج</span>
            </a>
          </div>
        </div>
      </section>

      {/* Ultra Modern Services Section */}
      <section className="section-padding gradient-bg-primary relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 animate-gradient-shift opacity-30"></div>
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 sm:w-3 sm:h-3 bg-white/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${4 + Math.random() * 4}s`
              }}
            ></div>
          ))}
        </div>

        <div className="container-ultra relative z-10">
          <div className="text-center mb-12 lg:mb-20">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black gradient-text mb-6 lg:mb-8">
              خدماتنا المتميزة
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl gradient-text-light max-w-3xl mx-auto leading-relaxed">
              مجموعة شاملة من الخدمات الزراعية المتطورة لتلبية جميع احتياجاتك
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
            {[
              { 
                icon: '🚜', 
                title: 'معدات زراعية متطورة', 
                desc: 'جرارات حديثة، حصادات ذكية، وأدوات الحراثة والري المتقدمة',
                features: ['جرارات بتقنية GPS', 'حصادات ذاتية القيادة', 'أنظمة ري ذكية']
              },
              { 
                icon: '🌾', 
                title: 'أراضي زراعية مختارة', 
                desc: 'أفضل الأراضي الزراعية للبيع والإيجار بمواصفات عالية الجودة',
                features: ['تربة خصبة محللة', 'مصادر مياه مضمونة', 'مواقع استراتيجية']
              },
              { 
                icon: '🔧', 
                title: 'خدمات صيانة احترافية', 
                desc: 'فريق متخصص لصيانة وإصلاح جميع أنواع المعدات الزراعية',
                features: ['فنيون معتمدون', 'قطع غيار أصلية', 'خدمة طوارئ 24/7']
              }
            ].map((service, idx) => (
              <div 
                key={idx} 
                className="card-ultra glass-green rounded-3xl p-6 lg:p-8 hover-lift animate-slide-in-right group hover-green-glow"
                style={{animationDelay: `${idx * 0.2}s`}}
              >
                {/* Icon Container */}
                <div className="relative mb-6 lg:mb-8">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 mx-auto gradient-bg-accent rounded-full flex items-center justify-center animate-green-pulse group-hover:scale-110 transition-all duration-300">
                    <span className="text-3xl sm:text-4xl lg:text-5xl">{service.icon}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 lg:mb-6 gradient-text-light leading-tight">
                    {service.title}
                  </h3>
                  <p className="text-green-100/90 text-base lg:text-lg leading-relaxed mb-6 lg:mb-8">
                    {service.desc}
                  </p>

                  {/* Features List */}
                  <ul className="space-y-2 lg:space-y-3 mb-6 lg:mb-8">
                    {service.features.map((feature, featureIdx) => (
                      <li key={featureIdx} className="flex items-center gradient-text-accent text-sm lg:text-base">
                        <span className="w-2 h-2 bg-green-300 rounded-full mr-3 flex-shrink-0 animate-green-glow"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button className="btn-ultra px-6 lg:px-8 py-3 lg:py-4 rounded-xl font-bold hover-scale w-full sm:w-auto text-sm lg:text-base animate-green-glow">
                    اعرف المزيد
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Statistics Section */}
          <div className="mt-16 lg:mt-24 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              { number: '50K+', label: 'عميل راضي' },
              { number: '10K+', label: 'معدة متاحة' },
              { number: '500+', label: 'أرض زراعية' },
              { number: '24/7', label: 'دعم فني' }
            ].map((stat, idx) => (
              <div key={idx} className="text-center glass-green rounded-2xl p-4 lg:p-6 hover-scale animate-bounce-in hover-green-glow" style={{animationDelay: `${idx * 0.1}s`}}>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black gradient-text-accent mb-2">
                  {stat.number}
                </div>
                <div className="text-green-100/80 text-sm lg:text-base font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section with Timeline */}
      <section className="py-32 gradient-bg-accent relative overflow-hidden">
        <div className="absolute inset-0 animate-gradient-flow opacity-40"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-5xl font-bold text-center mb-20 gradient-text-light">كيف تعمل المنصة؟</h2>
          <div className="max-w-4xl mx-auto">
            {[
              { step: 1, title: 'التسجيل المجاني', desc: 'أنشئ حسابك في دقائق معدودة', icon: '👤' },
              { step: 2, title: 'إنشاء القائمة', desc: 'أضف معداتك أو أراضيك بسهولة', icon: '📝' },
              { step: 3, title: 'إتمام الصفقة', desc: 'تواصل مع المشترين وأتمم البيع بأمان', icon: '🤝' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center mb-16 last:mb-0 animate-slide-in-right" style={{animationDelay: `${idx * 0.2}s`}}>
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 glass-green-light gradient-text rounded-full flex items-center justify-center text-3xl font-bold shadow-2xl hover-scale animate-green-pulse">
                    {item.icon}
                  </div>
                </div>
                <div className="mr-8 flex-grow">
                  <div className="glass-green rounded-3xl p-8 shadow-xl hover-scale hover-green-glow border border-green-300/30">
                    <h3 className="text-2xl font-bold mb-2 gradient-text-light">{item.title}</h3>
                    <p className="text-green-100 text-lg leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section with Modern Cards */}
      <section className="py-32 gradient-bg-primary relative overflow-hidden">
        <div className="absolute inset-0 animate-green-wave"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-5xl font-bold text-center mb-16 gradient-text-light">آراء المستخدمين</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {[
              { text: "منصة رائعة وسهلة الاستخدام! تمكنت من بيع جراري القديم بسرعة وبسعر ممتاز.", name: "أحمد السالم", role: "مزارع" },
              { text: "دفع سريع وآمن وتجربة ممتازة. أنصح بها كل من يريد بيع معداته الزراعية.", name: "سارة النجار", role: "تاجرة معدات" },
              { text: "خدمة عملاء ممتازة ودعم فني سريع. حلت مشكلتي في أقل من ساعة.", name: "محمد العتيبي", role: "مربي ماشية" },
              { text: "وجدت الأرض المثالية لمشروعي الزراعي بسهولة تامة عبر المنصة.", name: "فاطمة الزهراني", role: "مستثمرة زراعية" }
            ].map((testimonial, idx) => (
              <div key={idx} className="glass-green-dark rounded-3xl p-8 shadow-2xl hover-scale hover-green-glow card-awesome">
                <p className="text-green-100 text-lg mb-6 leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 gradient-bg-accent rounded-full flex items-center justify-center text-white font-bold text-lg animate-green-pulse">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="mr-4">
                    <p className="font-bold gradient-text-light">{testimonial.name}</p>
                    <p className="gradient-text-accent">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Listings Section with Enhanced Gallery */}
      <section className="py-32 gradient-bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 animate-radial-pulse opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-5xl font-bold text-center mb-8 gradient-text-light">اكتشف أحدث القوائم</h2>
          <p className="text-center gradient-text-accent text-xl mb-16 max-w-2xl mx-auto leading-relaxed">
            تصفح مجموعة مختارة من أفضل المعدات والأراضي الزراعية المتاحة حاليًا
          </p>
          <div className="mb-12 glass-green rounded-3xl p-8 hover-green-glow">
            <ImageGallery
              images={[
                '/assets/pexels-pixabay-158827.jpg',
                '/assets/pexels-timmossholder-974314.jpg',
                '/assets/pexels-tomfisk-1595104.jpg',
              ]}
              alt="معدات زراعية"
            />
          </div>
          <div className="text-center">
            <a
              href="/listings"
              className="px-10 py-5 glass-green-light gradient-text rounded-3xl hover-scale font-bold text-xl shadow-2xl hover-green-glow inline-flex items-center gap-3"
            >
              <span>عرض جميع القوائم</span>
              <span className="text-2xl">🚜</span>
            </a>
          </div>
        </div>
      </section>

      {/* Call To Action Footer with Dramatic Design */}
      <section className="py-32 relative bg-cover bg-center bg-fixed text-white" style={{ backgroundImage: "url('/assets/pexels-tomfisk-1595104.jpg')" }}>
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/80 via-green-800/60 to-green-700/80"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-6xl font-bold mb-6 gradient-text-light">انضم إلى مجتمع الغلة اليوم</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90 text-green-100">
            ابدأ رحلتك في عالم التجارة الزراعية الرقمية مع آلاف المزارعين والتجار من جميع أنحاء المنطقة
          </p>
          <div className="flex gap-6 justify-center">
            <a href="/auth/signup" className="px-10 py-5 glass-green-light gradient-text rounded-2xl font-bold text-xl hover-scale shadow-2xl hover-green-glow">
              ابدأ الآن مجانًا
            </a>
            <a href="/about" className="px-10 py-5 glass-green rounded-2xl font-bold text-xl hover-scale border-2 border-green-300/40 text-green-100 hover-green-glow">
              اعرف المزيد
            </a>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-green-50 via-green-100/50 to-transparent"></div>
      </section>
    </div>
  );
}
