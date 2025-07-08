'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Tractor, 
  Wheat, 
  Droplets, 
  Scissors, 
  Hammer, 
  Mountain,
  TreePine,
  Truck,
  Wrench,
  Sprout
} from 'lucide-react';

const CategoriesPage: React.FC = () => {
  const categories = [
    {
      id: 'tractors',
      name: 'جرارات زراعية',
      icon: Tractor,
      color: 'from-green-500 to-emerald-600',
      count: 245,
      description: 'جرارات متنوعة لجميع أنواع الأعمال الزراعية'
    },
    {
      id: 'harvesters',
      name: 'آلات الحصاد',
      icon: Wheat,
      color: 'from-yellow-500 to-orange-600',
      count: 123,
      description: 'حصادات للقمح والذرة والمحاصيل المختلفة'
    },
    {
      id: 'irrigation',
      name: 'أنظمة الري',
      icon: Droplets,
      color: 'from-blue-500 to-cyan-600',
      count: 189,
      description: 'أنظمة ري حديثة ومعدات المياه'
    },
    {
      id: 'tools',
      name: 'أدوات يدوية',
      icon: Hammer,
      color: 'from-gray-500 to-slate-600',
      count: 456,
      description: 'أدوات زراعية يدوية ومعدات صغيرة'
    },
    {
      id: 'cultivators',
      name: 'أدوات الحراثة',
      icon: Scissors,
      color: 'from-purple-500 to-violet-600',
      count: 67,
      description: 'محاريث ومعدات تحضير التربة'
    },
    {
      id: 'land',
      name: 'أراضي زراعية',
      icon: Mountain,
      color: 'from-emerald-500 to-teal-600',
      count: 89,
      description: 'أراضي للبيع والإيجار في مختلف المناطق'
    },
    {
      id: 'greenhouse',
      name: 'البيوت المحمية',
      icon: TreePine,
      color: 'from-green-600 to-lime-600',
      count: 34,
      description: 'بيوت محمية وأنظمة الزراعة المحمية'
    },
    {
      id: 'transport',
      name: 'معدات النقل',
      icon: Truck,
      color: 'from-red-500 to-rose-600',
      count: 78,
      description: 'شاحنات ومقطورات النقل الزراعي'
    },
    {
      id: 'maintenance',
      name: 'قطع الغيار',
      icon: Wrench,
      color: 'from-indigo-500 to-blue-600',
      count: 567,
      description: 'قطع غيار للمعدات الزراعية'
    },
    {
      id: 'seeds',
      name: 'البذور والأسمدة',
      icon: Sprout,
      color: 'from-lime-500 to-green-500',
      count: 234,
      description: 'بذور عالية الجودة وأسمدة طبيعية'
    }
  ];

  return (
    <div className="min-h-screen pt-20 pb-8">
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-90"></div>
        <div className="absolute inset-0 animate-color-wave"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-6 animate-slide-down">
              فئات المنتجات
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed animate-slide-up">
              اكتشف مجموعة واسعة من المعدات والخدمات الزراعية المتخصصة
            </p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              
              return (
                <Link
                  key={category.id}
                  href={`/listings?category=${category.id}`}
                  className="group animate-on-scroll"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="glass-card hover:scale-105 transition-all duration-500 overflow-hidden h-full">
                    {/* Category Icon & Gradient */}
                    <div className={`relative h-32 bg-gradient-to-br ${category.color} flex items-center justify-center overflow-hidden`}>
                      <div className="absolute inset-0 opacity-20 bg-[url('/assets/n7l1.webp')] bg-cover bg-center"></div>
                      <IconComponent 
                        size={48} 
                        className="text-white relative z-10 group-hover:scale-110 transition-transform duration-300" 
                      />
                      
                      {/* Count Badge */}
                      <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                        <span className="text-white text-sm font-bold">{category.count}</span>
                      </div>
                    </div>

                    {/* Category Info */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-white/80 text-sm leading-relaxed">
                        {category.description}
                      </p>
                      
                      {/* View More Button */}
                      <div className="mt-4 flex items-center text-green-400 font-medium text-sm group-hover:text-green-300 transition-colors">
                        <span>عرض المنتجات</span>
                        <span className="mr-2 group-hover:translate-x-1 transition-transform">←</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="glass-card text-center p-8 md:p-12 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-6">
              لم تجد ما تبحث عنه؟
            </h2>
            <p className="text-white/90 text-lg mb-8 leading-relaxed">
              تواصل معنا مباشرة أو أضف طلبك الخاص وسنساعدك في العثور على المعدات المناسبة
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-awesome px-8 py-3 text-lg hover-glow">
                اتصل بنا
              </Link>
              <Link href="/listings/new" className="btn-outline px-8 py-3 text-lg">
                أضف طلب خاص
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CategoriesPage;
