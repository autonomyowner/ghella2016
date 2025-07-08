
import React from 'react';

// An array of service objects. Each object represents a service offered by the platform.
const services = [
  {
    icon: '🚜',
    title: 'سوق المعدات والآلات',
    description: 'منصة متكاملة لبيع وشراء المعدات الزراعية الجديدة والمستعملة. من الجرارات إلى الحصادات، كل ما تحتاجه في مكان واحد.',
  },
  {
    icon: '🗺️',
    title: 'سوق الأراضي الزراعية',
    description: 'استكشف فرص بيع، شراء، أو استئجار الأراضي الزراعية. نوفر لك الأدوات اللازمة لاتخاذ القرار الصحيح.',
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
    icon: '🛰️',
    title: 'التحليل عن بعد والزراعة الدقيقة',
    description: 'خدمات تحليل التربة والمحاصيل عبر الأقمار الصناعية والطائرات بدون طيار. احصل على بيانات دقيقة لتحسين الري والتسميد.',
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
  <div className="card-glassmorphic p-6 md:p-8 rounded-2xl flex flex-col items-center text-center transition-all duration-300 hover:scale-105 hover:shadow-xl border border-green-500/20 bg-green-500/10">
    <div className="text-5xl md:text-6xl mb-4">{icon}</div>
    <h3 className="heading-responsive-h3 mb-3 text-gray-800">{title}</h3>
    <p className="text-responsive-base text-gray-600">{description}</p>
  </div>
);

// The main component for the services page.
export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Hero Section */}
      <section className="relative gradient-bg-primary text-white overflow-hidden">
        <div className="absolute inset-0 animate-color-wave opacity-30"></div>
        <div className="container-responsive spacing-responsive-xl relative z-10">
          <div className="text-center">
            <h1 className="heading-responsive-h1 gradient-text mb-4">
              خدماتنا المتكاملة لقطاع زراعي مستدام
            </h1>
            <p className="text-responsive-lg text-green-100 max-w-3xl mx-auto">
              منصة "الغلة" هي شريكك الاستراتيجي للنجاح. نقدم لك حزمة من الحلول المبتكرة التي تغطي كافة احتياجاتك الزراعية.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="container-responsive spacing-responsive-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
      </section>
    </div>
  );
}
