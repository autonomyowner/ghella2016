'use client';

import React, { useState, useEffect } from 'react';

const TestimonialsSection: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: 'أحمد محمد',
      role: 'مزارع محترف',
      location: 'الرياض، المملكة العربية السعودية',
      avatar: '/assets/issam.jpg',
      rating: 5,
      content: 'منصة الغلة غيرت حياتي المهنية بالكامل. زادت إنتاجيتي بنسبة 40% وتوفير في التكاليف بنسبة 30%. التوصيات الذكية للري والأسمدة كانت دقيقة جداً.',
      achievement: 'زيادة الإنتاجية 40%'
    },
    {
      id: 2,
      name: 'فاطمة علي',
      role: 'مديرة مزرعة',
      location: 'جدة، المملكة العربية السعودية',
      avatar: '/assets/hadit.png',
      rating: 5,
      content: 'المراقبة الذكية للمزرعة ساعدتني في اتخاذ قرارات أفضل. الآن أستطيع مراقبة جميع العمليات من هاتفي. خدمة العملاء ممتازة والدعم الفني متوفر 24/7.',
      achievement: 'توفير 50% في وقت الإدارة'
    },
    {
      id: 3,
      name: 'محمد عبدالله',
      role: 'تاجر زراعي',
      location: 'الدمام، المملكة العربية السعودية',
      avatar: '/assets/nono.jpg',
      rating: 5,
      content: 'سوق الغلة فتح لي أسواق جديدة. الآن أبيع منتجاتي في جميع أنحاء المملكة. نظام الدفع آمن والمنصة سهلة الاستخدام. أنصح جميع المزارعين بالتسجيل.',
      achievement: 'زيادة المبيعات 200%'
    },
    {
      id: 4,
      name: 'سارة أحمد',
      role: 'خبيرة زراعية',
      location: 'الطائف، المملكة العربية السعودية',
      avatar: '/assets/hadith-sample.png',
      rating: 5,
      content: 'كخبيرة زراعية، أرى أن منصة الغلة تمثل مستقبل الزراعة في المملكة. التقنيات المستخدمة متطورة جداً والنتائج مذهلة. المنصة تستحق كل قرش.',
      achievement: 'تحسين الجودة 60%'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section className="relative z-10 py-20 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
            آراء <span className="text-emerald-400">عملائنا</span>
          </h2>
          <p className="text-xl text-emerald-200 max-w-3xl mx-auto">
            اكتشف كيف غيرت منصة الغلة حياة آلاف المزارعين والتجار في المملكة العربية السعودية
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`group cursor-pointer transition-all duration-500 ${
                currentTestimonial === index ? 'scale-105' : 'scale-100'
              }`}
              onClick={() => setCurrentTestimonial(index)}
            >
              <div className={`relative overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border transition-all duration-500 ${
                currentTestimonial === index 
                  ? 'border-emerald-400/50 shadow-2xl shadow-emerald-500/20' 
                  : 'border-white/20 hover:border-emerald-400/30'
              }`}>
                {/* Active background */}
                {currentTestimonial === index && (
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent"></div>
                )}
                
                <div className="relative z-10">
                  {/* Avatar */}
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{testimonial.name}</h4>
                      <p className="text-emerald-300 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  
                  {/* Rating */}
                  <div className="flex items-center mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <i key={i} className="fas fa-star text-yellow-400 text-sm"></i>
                    ))}
                  </div>
                  
                  {/* Achievement Badge */}
                  <div className="inline-block bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs px-3 py-1 rounded-full mb-4">
                    {testimonial.achievement}
                  </div>
                  
                  {/* Content Preview */}
                  <p className="text-emerald-200 text-sm leading-relaxed line-clamp-3">
                    {testimonial.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Featured Testimonial */}
        <div className="relative">
          <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/20">
            {/* Quote Icon */}
            <div className="absolute top-6 right-6 text-emerald-400 opacity-20">
              <i className="fas fa-quote-right text-6xl"></i>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              {/* Avatar and Info */}
              <div className="text-center lg:text-right">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto lg:mx-0 mb-4 shadow-2xl">
                  {testimonials[currentTestimonial].name.charAt(0)}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {testimonials[currentTestimonial].name}
                </h3>
                <p className="text-emerald-300 mb-2">{testimonials[currentTestimonial].role}</p>
                <p className="text-emerald-400 text-sm">{testimonials[currentTestimonial].location}</p>
                
                {/* Rating */}
                <div className="flex items-center justify-center lg:justify-start mt-4">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <i key={i} className="fas fa-star text-yellow-400 text-lg"></i>
                  ))}
                </div>
              </div>
              
              {/* Content */}
              <div className="lg:col-span-2">
                <blockquote className="text-xl md:text-2xl text-white leading-relaxed mb-6 italic">
                  "{testimonials[currentTestimonial].content}"
                </blockquote>
                
                {/* Achievement */}
                <div className="inline-flex items-center bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-full font-semibold">
                  <i className="fas fa-trophy mr-2"></i>
                  {testimonials[currentTestimonial].achievement}
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation Dots */}
          <div className="flex justify-center mt-8 space-x-2 space-x-reverse">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentTestimonial === index 
                    ? 'bg-emerald-400 scale-125' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black text-emerald-400 mb-2">98%</div>
              <div className="text-emerald-200 text-sm">معدل الرضا</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black text-emerald-400 mb-2">24/7</div>
              <div className="text-emerald-200 text-sm">دعم فني</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black text-emerald-400 mb-2">50K+</div>
              <div className="text-emerald-200 text-sm">مستخدم نشط</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black text-emerald-400 mb-2">99.9%</div>
              <div className="text-emerald-200 text-sm">وقت التشغيل</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection; 