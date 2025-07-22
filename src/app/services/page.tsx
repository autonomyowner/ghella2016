'use client'

import React from 'react';
import dynamic from 'next/dynamic';

const MotionDiv = dynamic(() => import('framer-motion').then(mod => mod.motion.div), { ssr: false, loading: () => <div /> });
const MotionButton = dynamic(() => import('framer-motion').then(mod => mod.motion.button), { ssr: false, loading: () => <button /> });

// An array of service objects. Each object represents a service offered by the platform.
const services = [
  {
    icon: '🥦',
    title: 'سوق المنتجات الطازجة',
    description: 'منصة متكاملة لبيع وشراء المنتجات الزراعية الطازجة. نوفر لك الوصول المباشر للمزارعين والمنتجات عالية الجودة.',
  },
  {
    icon: '🚜',
    title: 'سوق المعدات والآلات',
    description: 'منصة متكاملة لبيع وشراء المعدات الزراعية الجديدة والمستعملة. من الجرارات إلى الحصادات، كل ما تحتاجه في مكان واحد.',
  },
  {
    icon: '🌾',
    title: 'سوق الأراضي الزراعية',
    description: 'استكشف فرص بيع، شراء، أو استئجار الأراضي الزراعية. نوفر لك الأدوات اللازمة لاتخاذ القرار الصحيح.',
  },
  {
    icon: '🧑‍🌾',
    title: 'اليد العاملة الفلاحية الماهرة',
    description: 'ربط المزارعين بالعمال المهرة في المجال الزراعي. نوفر عمالة مدربة ومؤهلة لجميع أنواع الأعمال الزراعية.',
  },
  {
    icon: '🌱',
    title: 'المشاتل والشتلات',
    description: 'منصة متخصصة في بيع وشراء الشتلات والأشجار المثمرة. نوفر لك أفضل أنواع النباتات من مشاتل معتمدة.',
  },
  {
    icon: '🛰️',
    title: 'خدمات التحليل والدراسات',
    description: 'خدمات تحليل التربة والمحاصيل عبر الأقمار الصناعية والطائرات بدون طيار. احصل على بيانات دقيقة لتحسين الري والتسميد.',
  },
  {
    icon: '🌍',
    title: 'خدمات التصدير',
    description: 'خدمات شاملة لتصدير المنتجات الزراعية. نسهل عليك الوصول للأسواق العالمية مع ضمان الجودة والامتثال للمعايير الدولية.',
  },
  {
    icon: '🚚',
    title: 'خدمات التوصيل',
    description: 'خدمات توصيل سريعة وآمنة للمنتجات الزراعية. نوفر شبكة توصيل تغطي جميع أنحاء الجزائر مع ضمان وصول المنتجات طازجة.',
  },
  {
    icon: '💰',
    title: 'حلول التمويل الزراعي',
    description: 'نربطك مع مؤسسات مالية تقدم حلول تمويلية مبتكرة مصممة خصيصًا لدعم مشاريعك الزراعية وتوسعاتك.',
  },
  {
    icon: '🛡️',
    title: 'خدمات التأمين المتكاملة',
    description: 'أمّن على محاصيلك، معداتك، ومواشيك ضد المخاطر. نقدم لك باقات تأمين مرنة وشاملة بالتعاون مع كبرى الشركات.',
  },
  {
    icon: '👨‍🌾',
    title: 'الاستشارات الزراعية الذكية',
    description: 'خبراء زراعيون في خدمتك لتقديم استشارات فنية، إدارية، وتسويقية. خطط لمستقبل مزرعتك بثقة.',
  },
  {
    icon: '🧠',
    title: 'خبراء الغلة للاستشارات المتقدمة',
    description: 'تواصل مباشرة مع نخبة من الخبراء في مختلف المجالات الزراعية للحصول على حلول مخصصة ومعمقة لتحدياتك.',
  },
  {
    icon: '📰',
    title: 'بوابة الأخبار والمعرفة',
    description: 'ابق على اطلاع بآخر الأخبار، التقنيات، وأفضل الممارسات في عالم الزراعة. محتوى متجدد وموثوق.',
  },
];

// A reusable component for displaying a single service card.
const ServiceCard = ({ icon, title, description }: { icon: string; title: string; description: string; }) => (
  <div className="bg-white/80 backdrop-blur-lg p-6 md:p-8 rounded-2xl flex flex-col items-center text-center transition-all duration-300 hover:scale-105 hover:shadow-xl border border-emerald-500/20 shadow-lg">
    <div className="text-5xl md:text-6xl mb-4">{icon}</div>
    <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-800">{title}</h3>
    <p className="text-sm md:text-base text-gray-600 leading-relaxed">{description}</p>
  </div>
);

// The main component for the services page.
export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white overflow-hidden py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-emerald-300 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              خدماتنا المتكاملة لقطاع زراعي مستدام
            </h1>
            <p className="text-lg md:text-xl text-emerald-100 max-w-3xl mx-auto leading-relaxed">
              منصة "الغلة" هي شريكك الاستراتيجي للنجاح. نقدم لك حزمة من الحلول المبتكرة التي تغطي كافة احتياجاتك الزراعية.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
