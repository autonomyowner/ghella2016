'use client';

import React, { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    alert('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        <video
          autoPlay
          muted
          loop
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/assets/Videoplayback3.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Main Content Centered */}
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div className="max-w-4xl px-4">
            <div className="relative">
              <h1 className="text-7xl md:text-8xl font-black text-white mb-6 animate-fade-in-up">
                اتصل بنا
              </h1>
              
              {/* Animated underline */}
              <div className="flex justify-center mb-8">
                <svg width="200" height="20" className="animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                  <path d="M10 10 Q100 0 190 10" stroke="#10b981" strokeWidth="3" fill="none" className="animate-pulse"/>
                </svg>
              </div>
            </div>
            
            <h2 className="text-3xl md:text-4xl text-green-300 mb-8 font-medium animate-fade-in-up" style={{animationDelay: '0.6s'}}>
              نحن هنا لمساعدتك
            </h2>
            
            <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{animationDelay: '0.9s'}}>
              تواصل معنا لأي استفسار أو مساعدة تحتاجها في رحلتك الزراعية
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-32 gradient-bg-primary relative overflow-hidden">
        <div className="absolute inset-0 animate-gradient-shift"></div>
        
        {/* Floating bubbles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 bg-white/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-5xl font-bold text-center mb-20 gradient-text-light">تواصل معنا</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            
            {/* Contact Form */}
            <div className="glass rounded-3xl p-8 shadow-2xl hover-scale animate-slide-in-right">
              <h3 className="text-3xl font-bold text-white mb-8 text-center">أرسل لنا رسالة</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">الاسم الكامل</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl glass-dark text-white placeholder-white/70 border border-white/20 focus:border-green-400 focus:outline-none"
                    placeholder="أدخل اسمك الكامل"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">البريد الإلكتروني</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl glass-dark text-white placeholder-white/70 border border-white/20 focus:border-green-400 focus:outline-none"
                    placeholder="أدخل بريدك الإلكتروني"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">الموضوع</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl glass-dark text-white placeholder-white/70 border border-white/20 focus:border-green-400 focus:outline-none"
                    placeholder="موضوع الرسالة"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">الرسالة</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full p-3 rounded-xl glass-dark text-white placeholder-white/70 border border-white/20 focus:border-green-400 focus:outline-none resize-none"
                    placeholder="اكتب رسالتك هنا..."
                    required
                  ></textarea>
                </div>
                
                <button type="submit" className="w-full btn-awesome py-3 rounded-xl font-bold hover-scale text-lg">
                  إرسال الرسالة
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="glass-dark rounded-3xl p-8 shadow-2xl hover-scale animate-slide-in-right" style={{animationDelay: '0.2s'}}>
                <h3 className="text-2xl font-bold text-white mb-6 text-center">معلومات التواصل</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 glass-bubble rounded-full flex items-center justify-center">
                      <span className="text-2xl">📧</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">البريد الإلكتروني</p>
                      <p className="text-green-300">info@alghalla.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 glass-bubble rounded-full flex items-center justify-center">
                      <span className="text-2xl">📞</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">الهاتف</p>
                      <p className="text-green-300">+966 50 123 4567</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 glass-bubble rounded-full flex items-center justify-center">
                      <span className="text-2xl">📍</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">العنوان</p>
                      <p className="text-green-300">الرياض، المملكة العربية السعودية</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="glass-dark rounded-3xl p-8 shadow-2xl hover-scale animate-slide-in-right" style={{animationDelay: '0.4s'}}>
                <h3 className="text-2xl font-bold text-white mb-6 text-center">ساعات العمل</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white">الأحد - الخميس</span>
                    <span className="text-green-300 font-semibold">8:00 ص - 6:00 م</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white">الجمعة</span>
                    <span className="text-green-300 font-semibold">9:00 ص - 2:00 م</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white">السبت</span>
                    <span className="text-green-300 font-semibold">مغلق</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 gradient-bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 animate-gradient-shift opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-5xl font-bold text-center mb-20 gradient-text">الأسئلة الشائعة</h2>
          <div className="max-w-4xl mx-auto space-y-6">
            {[
              {
                question: "كيف يمكنني التسجيل في المنصة؟",
                answer: "يمكنك التسجيل بسهولة من خلال النقر على زر 'إنشاء حساب' وملء النموذج بالمعلومات المطلوبة."
              },
              {
                question: "ما هي الخدمات التي تقدمونها؟",
                answer: "نقدم خدمات متكاملة تشمل بيع وشراء المعدات الزراعية، استشارات زراعية، وخدمات الصيانة."
              },
              {
                question: "هل الخدمات متاحة في جميع المناطق؟",
                answer: "نعم، خدماتنا متاحة في جميع أنحاء المملكة العربية السعودية مع إمكانية التوسع مستقبلاً."
              },
              {
                question: "كيف يمكنني التواصل مع خدمة العملاء؟",
                answer: "يمكنك التواصل معنا عبر البريد الإلكتروني أو الهاتف أو من خلال نموذج التواصل في هذه الصفحة."
              }
            ].map((faq, idx) => (
              <div key={idx} className="glass-dark rounded-3xl p-8 shadow-2xl hover-scale animate-slide-in-right" style={{animationDelay: `${idx * 0.1}s`}}>
                <h3 className="text-xl font-bold text-white mb-4">{faq.question}</h3>
                <p className="text-white/90 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="py-32 relative bg-cover bg-center bg-fixed text-white" style={{ backgroundImage: "url('/assets/pexels-cottonbro-4921204.jpg')" }}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/60"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-6xl font-bold mb-6">نحن هنا لمساعدتك</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            لا تتردد في التواصل معنا لأي استفسار أو مساعدة تحتاجها
          </p>
          <div className="flex gap-6 justify-center">
            <a href="tel:+966501234567" className="px-10 py-5 bg-white text-green-600 rounded-2xl font-bold text-xl hover-scale shadow-2xl">
              اتصل بنا الآن
            </a>
            <a href="mailto:info@alghalla.com" className="px-10 py-5 glass rounded-2xl font-bold text-xl hover-scale border-2 border-white/30">
              راسلنا عبر البريد
            </a>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent"></div>
      </section>
    </div>
  );
} 