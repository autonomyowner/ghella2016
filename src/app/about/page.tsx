'use client';

import React from 'react';

export default function AboutPage() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section with Video Background */}
      <section className="relative h-screen w-full overflow-hidden">
        <video
          autoPlay
          muted
          loop
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/assets/Videoplayback1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Main Content Centered */}
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div className="max-w-4xl px-4">
            <div className="relative">
              <h1 className="text-7xl md:text-8xl font-black text-white mb-6 animate-fade-in-up">
                من نحن
              </h1>
              
              {/* Animated underline */}
              <div className="flex justify-center mb-8">
                <svg width="200" height="20" className="animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                  <path d="M10 10 Q100 0 190 10" stroke="#10b981" strokeWidth="3" fill="none" className="animate-pulse"/>
                </svg>
              </div>
            </div>
            
            <h2 className="text-3xl md:text-4xl text-green-300 mb-8 font-medium animate-fade-in-up" style={{animationDelay: '0.6s'}}>
              رؤيتنا ورسالتنا في عالم الزراعة
            </h2>
            
            <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{animationDelay: '0.9s'}}>
              نؤمن بأن الزراعة هي أساس الحياة ومفتاح المستقبل المستدام
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-32 relative overflow-hidden">
        {/* Background Image Overlay */}
        <div className="bg-image-overlay" style={{backgroundImage: "url('/assets/n7l1.webp')"}}></div>
        <div className="absolute inset-0 bg-overlay-primary"></div>
        
        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="floating-element" style={{left: '10%', top: '10%'}}>
            <img src="/assets/islam.jpg" alt="" className="w-16 h-16 rounded-full opacity-20" />
          </div>
          <div className="floating-element" style={{right: '15%', top: '20%'}}>
            <img src="/assets/n7l2.webp" alt="" className="w-12 h-12 rounded-full opacity-20" />
          </div>
          <div className="floating-element" style={{left: '20%', bottom: '30%'}}>
            <img src="/assets/pexels-pixabay-158827.jpg" alt="" className="w-20 h-20 rounded-full opacity-20" />
          </div>
          <div className="floating-element" style={{right: '10%', bottom: '20%'}}>
            <img src="/assets/pexels-timmossholder-974314.jpg" alt="" className="w-14 h-14 rounded-full opacity-20" />
          </div>
          <div className="floating-element" style={{left: '5%', top: '50%'}}>
            <img src="/assets/pexels-tomfisk-1595104.jpg" alt="" className="w-18 h-18 rounded-full opacity-20" />
          </div>
          <div className="floating-element" style={{right: '5%', top: '60%'}}>
            <img src="/assets/pexels-cottonbro-4921204.jpg" alt="" className="w-16 h-16 rounded-full opacity-20" />
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-5xl font-bold text-center mb-20 gradient-text-light">قصة بدايتنا</h2>
          <div className="max-w-4xl mx-auto">
            <div className="glass rounded-3xl p-12 shadow-2xl hover-scale animate-slide-in-right">
              <div className="text-center mb-12">
                <div className="w-24 h-24 glass-bubble rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
                  <span className="text-4xl">🌱</span>
                </div>
                <h3 className="text-3xl font-bold text-white mb-6">وُلدت فكرتنا من شغفنا العميق</h3>
              </div>
              
              <div className="space-y-6 text-lg leading-relaxed text-white/90">
                <p className="animate-slide-in-right" style={{animationDelay: '0.2s'}}>
                  وُلدت فكرتنا من شغفنا العميق بالزراعة والإيمان بأهميتها في بناء مستقبل مستدام. لاحظنا الحاجة إلى حلول مبتكرة ومتكاملة تخدم المزارعين وتدعم محبي الزراعة لتحقيق أفضل النتائج.
                </p>
                
                <p className="animate-slide-in-right" style={{animationDelay: '0.4s'}}>
                  بدأنا كشركة ناشئة، الأولى من نوعها، لتقديم خدمات زراعية واستشارات متخصصة تجمع بين الخبرة التقنية والابتكار. نحن هنا لنكون شريكك الموثوق، نقدم الدعم اللازم لتحويل رؤيتك الزراعية إلى واقع، سواء كنت مزارعًا خبيرًا أو مبتدئًا في هذا المجال.
                </p>
                
                <p className="animate-slide-in-right" style={{animationDelay: '0.6s'}}>
                  في رحلتنا، نطمح لبناء مجتمع زراعي مستدام ومتقدم، ونؤمن بأن المستقبل الأفضل يبدأ بزراعة أفضل.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founders Section with Flipping Cards */}
      <section className="py-32 gradient-bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 animate-gradient-shift opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-5xl font-bold text-center mb-20 gradient-text">مؤسسو الشركة</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            
            {/* Founder 1 - Islam */}
            <div className="flip-card animate-slide-in-right" style={{animationDelay: '0.1s'}}>
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <img src="/assets/islam.jpg" alt="إسلام" className="owner-image" />
                  <h3 className="text-2xl font-bold mb-2">إسلام</h3>
                  <p className="text-lg opacity-90">المؤسس والرئيس التنفيذي</p>
                  <p className="text-sm opacity-75 mt-2">اضغط لمعرفة المزيد</p>
                </div>
                <div className="flip-card-back">
                  <h3 className="text-xl font-bold mb-4">إسلام</h3>
                  <p className="text-sm leading-relaxed mb-4">
                    مؤسس ورئيس تنفيذي للشركة، يتمتع بخبرة 15 عاماً في مجال الزراعة والتكنولوجيا الزراعية.
                  </p>
                  <div className="space-y-2 text-sm">
                    <p>🌱 خبير في الزراعة المستدامة</p>
                    <p>💡 مبتكر في التقنيات الزراعية</p>
                    <p>🤝 قائد في بناء العلاقات</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Founder 2 - Placeholder */}
            <div className="flip-card animate-slide-in-right" style={{animationDelay: '0.3s'}}>
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <div className="placeholder-image">
                    <span className="text-4xl">👤</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">المؤسس الثاني</h3>
                  <p className="text-lg opacity-90">في انتظار الصورة</p>
                  <p className="text-sm opacity-75 mt-2">اضغط لمعرفة المزيد</p>
                </div>
                <div className="flip-card-back">
                  <h3 className="text-xl font-bold mb-4">المؤسس الثاني</h3>
                  <p className="text-sm leading-relaxed mb-4">
                    شريك مؤسس في الشركة، متخصص في تطوير الأعمال والتسويق الزراعي.
                  </p>
                  <div className="space-y-2 text-sm">
                    <p>📈 خبير في تطوير الأعمال</p>
                    <p>🎯 متخصص في التسويق الزراعي</p>
                    <p>🌍 خبرة في الأسواق الدولية</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Founder 3 - Placeholder */}
            <div className="flip-card animate-slide-in-right" style={{animationDelay: '0.5s'}}>
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <div className="placeholder-image">
                    <span className="text-4xl">👤</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">المؤسس الثالث</h3>
                  <p className="text-lg opacity-90">في انتظار الصورة</p>
                  <p className="text-sm opacity-75 mt-2">اضغط لمعرفة المزيد</p>
                </div>
                <div className="flip-card-back">
                  <h3 className="text-xl font-bold mb-4">المؤسس الثالث</h3>
                  <p className="text-sm leading-relaxed mb-4">
                    شريك مؤسس في الشركة، متخصص في التكنولوجيا والحلول الرقمية للزراعة.
                  </p>
                  <div className="space-y-2 text-sm">
                    <p>💻 خبير في التكنولوجيا الزراعية</p>
                    <p>🔧 متخصص في الحلول الرقمية</p>
                    <p>🚀 مبتكر في الابتكارات التقنية</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Our Company Section */}
      <section className="py-32 relative overflow-hidden">
        {/* Background Image Overlay */}
        <div className="bg-image-overlay" style={{backgroundImage: "url('/assets/pexels-pixabay-158827.jpg')"}}></div>
        <div className="absolute inset-0 bg-overlay-secondary"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-5xl font-bold text-center mb-20 gradient-text">عن شركتنا</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            
            {/* Company Description */}
            <div className="glass-dark rounded-3xl p-8 shadow-2xl hover-scale animate-slide-in-right">
              <div className="text-center mb-8">
                <div className="w-20 h-20 glass-bubble rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
                  <span className="text-3xl">🏢</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">شركة ناشئة متخصصة</h3>
              </div>
              
              <div className="space-y-4 text-white/90 leading-relaxed">
                <p>
                  نحن شركة ناشئة متخصصة في الزراعة والخدمات الزراعية والاستشارات، نسعى لتمكين المزارعين والأفراد المهتمين بالزراعة من تحقيق إنتاجية أعلى ونتائج مستدامة.
                </p>
                
                <p>
                  تأسست شركتنا على أساس رؤية واضحة: تقديم حلول مبتكرة وشاملة تعزز من جودة الإنتاج الزراعي وتدعم مجتمع المزارعين.
                </p>
                
                <p>
                  نحن نؤمن بأن الزراعة ليست مجرد مهنة، بل هي رسالة لبناء مستقبل أكثر خضرة واستدامة.
                </p>
              </div>
            </div>

            {/* Our Team */}
            <div className="glass-dark rounded-3xl p-8 shadow-2xl hover-scale animate-slide-in-right" style={{animationDelay: '0.2s'}}>
              <div className="text-center mb-8">
                <div className="w-20 h-20 glass-bubble rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
                  <span className="text-3xl">👥</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">فريقنا المتميز</h3>
              </div>
              
              <div className="space-y-4 text-white/90 leading-relaxed">
                <p>
                  فريقنا يضم مجموعة من الخبراء في المجال الزراعي، الذين يجمعون بين المعرفة العملية والرؤية المستقبلية لتقديم خدمات واستشارات مصممة خصيصًا لتلبية احتياجاتك.
                </p>
                
                <p>
                  معنا، الزراعة ليست فقط عملًا، بل أسلوب حياة نطمح إلى تحسينه باستمرار.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-32 relative overflow-hidden">
        {/* Background Image Overlay */}
        <div className="bg-image-overlay" style={{backgroundImage: "url('/assets/pexels-timmossholder-974314.jpg')"}}></div>
        <div className="absolute inset-0 bg-overlay-primary"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-5xl font-bold text-center mb-20 gradient-text-light">قيمنا الأساسية</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { 
                icon: '🌱', 
                title: 'الاستدامة', 
                desc: 'نؤمن بالزراعة المستدامة التي تحافظ على البيئة للأجيال القادمة' 
              },
              { 
                icon: '🤝', 
                title: 'الثقة', 
                desc: 'نبني علاقات طويلة الأمد مبنية على الثقة والشفافية مع عملائنا' 
              },
              { 
                icon: '💡', 
                title: 'الابتكار', 
                desc: 'نطور حلول مبتكرة تجمع بين التقنية الحديثة والخبرة الزراعية' 
              }
            ].map((value, idx) => (
              <div key={idx} className="text-center glass rounded-3xl p-8 hover-scale animate-slide-in-right" style={{animationDelay: `${idx * 0.2}s`}}>
                <div className="mx-auto w-20 h-20 bg-white/20 flex items-center justify-center rounded-full mb-6 animate-float">
                  <span className="text-4xl">{value.icon}</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">{value.title}</h3>
                <p className="text-white/90 text-lg leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Mission & Vision */}
      <section className="py-32 relative overflow-hidden">
        {/* Background Image Overlay */}
        <div className="bg-image-overlay" style={{backgroundImage: "url('/assets/pexels-tomfisk-1595104.jpg')"}}></div>
        <div className="absolute inset-0 bg-overlay-secondary"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-5xl font-bold text-center mb-20 gradient-text">رؤيتنا ورسالتنا</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            
            {/* Mission */}
            <div className="glass-dark rounded-3xl p-8 shadow-2xl hover-scale animate-slide-in-right">
              <div className="text-center mb-8">
                <div className="w-20 h-20 glass-bubble rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
                  <span className="text-3xl">🎯</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">رسالتنا</h3>
              </div>
              
              <p className="text-white/90 leading-relaxed text-lg">
                تمكين المزارعين من خلال توفير أحدث التقنيات والحلول المبتكرة لتحقيق إنتاجية أعلى وجودة أفضل في المحاصيل الزراعية، مع الحفاظ على البيئة وضمان الاستدامة للأجيال القادمة.
              </p>
            </div>

            {/* Vision */}
            <div className="glass-dark rounded-3xl p-8 shadow-2xl hover-scale animate-slide-in-right" style={{animationDelay: '0.2s'}}>
              <div className="text-center mb-8">
                <div className="w-20 h-20 glass-bubble rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
                  <span className="text-3xl">🔮</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">رؤيتنا</h3>
              </div>
              
              <p className="text-white/90 leading-relaxed text-lg">
                أن نكون الشريك الموثوق الأول للمزارعين في المنطقة، ونقود التحول نحو الزراعة الذكية والمستدامة، ونبني مجتمع زراعي متقدم ومترابط يساهم في تحقيق الأمن الغذائي والتنمية المستدامة.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="py-32 relative bg-cover bg-center bg-fixed text-white" style={{ backgroundImage: "url('/assets/pexels-alejandro-barron-21404-96715.jpg')" }}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/60"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-6xl font-bold mb-6">انضم إلى رحلتنا</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            دعنا نعمل معًا لبناء مستقبل زراعي أفضل وأكثر استدامة
          </p>
          <div className="flex gap-6 justify-center">
            <a href="/auth/signup" className="px-10 py-5 bg-white text-green-600 rounded-2xl font-bold text-xl hover-scale shadow-2xl">
              ابدأ رحلتك معنا
            </a>
            <a href="/contact" className="px-10 py-5 glass rounded-2xl font-bold text-xl hover-scale border-2 border-white/30">
              تواصل معنا
            </a>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent"></div>
      </section>
    </div>
  );
} 