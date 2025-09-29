"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface ExportDeal {
  id: number;
  title: string;
  product: string;
  quantity: string;
  price: string;
  destination: string;
  deadline: string;
  status: "open" | "coming" | "active";
  description: string;
  requirements: string[];
  flag: string;
  category: string;
}

const exportDeals: ExportDeal[] = [
  {
    id: 1,
    title: "تمور دقلة نور",
    product: "تمور عالية الجودة",
    quantity: "500 طن",
    price: "$3,200/طن",
    destination: "الاتحاد الأوروبي",
    deadline: "مارس 2025",
    status: "open",
    description: "طلب لـ 500 طن من تمور دقلة نور للسوق الأوروبي. مطلوب شهادة جودة أوروبية وتعبئة معيارية.",
    requirements: ["شهادة جودة أوروبية", "تعبئة معيارية", "تاريخ إنتاج حديث", "تحليل مخبري"],
    flag: "🇪🇺",
    category: "fruits"
  },
  {
    id: 2,
    title: "زيتون مخلل",
    product: "زيتون مخلل طبيعي",
    quantity: "1000 طن/سنة",
    price: "$1,800/طن",
    destination: "الإمارات",
    deadline: "يونيو 2025",
    status: "coming",
    description: "عقد سنوي لتوريد الزيتون المخلل للأسواق الخليجية. مطلوب منتج عضوي معتمد.",
    requirements: ["شهادة عضوية", "تعبئة فاخرة", "مواصفات خليجية", "تاريخ صلاحية طويل"],
    flag: "🇦🇪",
    category: "processed"
  },
  {
    id: 3,
    title: "زيت الأرغان",
    product: "زيت أرغان طبيعي",
    quantity: "50 لتر/شهر",
    price: "$45/لتر",
    destination: "كندا",
    deadline: "مستمر",
    status: "active",
    description: "توريد شهري لزيت الأرغان الطبيعي للسوق الكندي. مطلوب منتج عضوي معتمد.",
    requirements: ["شهادة عضوية كندية", "تعبئة زجاجية", "تحليل كيميائي", "شهادة صحية"],
    flag: "🇨🇦",
    category: "oils"
  },
  {
    id: 4,
    title: "عسل السدر",
    product: "عسل سدر طبيعي",
    quantity: "200 كغ/شهر",
    price: "$25/كغ",
    destination: "المملكة المتحدة",
    deadline: "أبريل 2025",
    status: "open",
    description: "طلب لـ 200 كغ من عسل السدر الطبيعي للسوق البريطاني. مطلوب عسل عضوي معتمد.",
    requirements: ["شهادة عضوية", "تحليل مخبري", "تعبئة فاخرة", "شهادة صحية"],
    flag: "🇬🇧",
    category: "honey"
  },
  {
    id: 5,
    title: "زعتر بري",
    product: "زعتر بري مجفف",
    quantity: "300 كغ/شهر",
    price: "$15/كغ",
    destination: "ألمانيا",
    deadline: "مايو 2025",
    status: "coming",
    description: "طلب لـ 300 كغ من الزعتر البري المجفف للسوق الألماني. مطلوب منتج عضوي.",
    requirements: ["شهادة عضوية ألمانية", "تعبئة محكمة", "تحليل مبيدات", "شهادة صحية"],
    flag: "🇩🇪",
    category: "herbs"
  },
  {
    id: 6,
    title: "زيت الزيتون",
    product: "زيت زيتون بكر ممتاز",
    quantity: "1000 لتر/شهر",
    price: "$8/لتر",
    destination: "إيطاليا",
    deadline: "مستمر",
    status: "active",
    description: "توريد شهري لزيت الزيتون البكر الممتاز للسوق الإيطالي. مطلوب جودة عالية.",
    requirements: ["شهادة جودة إيطالية", "تعبئة معيارية", "تحليل كيميائي", "شهادة صحية"],
    flag: "🇮🇹",
    category: "oils"
  }
];

const markets = [
  {
    name: "الاتحاد الأوروبي",
    flag: "🇪🇺",
    description: "أكبر سوق للتصدير الزراعي",
    opportunities: "تمور، زيتون، عسل، أعشاب",
    requirements: "شهادات جودة أوروبية، تعبئة معيارية"
  },
  {
    name: "الخليج العربي",
    flag: "🇦🇪",
    description: "سوق متنامي للمنتجات العضوية",
    opportunities: "تمور، زيتون، عسل، أعشاب طبية",
    requirements: "شهادات حلال، تعبئة فاخرة"
  },
  {
    name: "أمريكا الشمالية",
    flag: "🇺🇸",
    description: "سوق متطور للمنتجات الطبيعية",
    opportunities: "زيت الأرغان، عسل، أعشاب عضوية",
    requirements: "شهادات FDA، تعبئة معيارية"
  },
  {
    name: "آسيا",
    flag: "🇯🇵",
    description: "سوق متنامي للمنتجات الصحية",
    opportunities: "أعشاب طبية، عسل، زيتون",
    requirements: "شهادات صحية آسيوية، تعبئة فاخرة"
  }
];

const categories = [
  { id: "all", label: "جميع الصفقات", icon: "🌍" },
  { id: "fruits", label: "فواكه", icon: "🍎" },
  { id: "processed", label: "منتجات معالجة", icon: "🫒" },
  { id: "oils", label: "زيوت", icon: "🫗" },
  { id: "honey", label: "عسل", icon: "🍯" },
  { id: "herbs", label: "أعشاب", icon: "🌿" }
];

export default function ExportsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filteredDeals = exportDeals.filter(deal => {
    const matchesCategory = selectedCategory === "all" || deal.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || deal.status === selectedStatus;
    return matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-green-100 text-green-800";
      case "coming": return "bg-orange-100 text-orange-800";
      case "active": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "open": return "مفتوحة";
      case "coming": return "قريباً";
      case "active": return "مستمرة";
      default: return "غير محدد";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 pt-20">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="text-8xl mb-6"
            >
              <span>🚢</span>
            </motion.div>
            <motion.div
              className="text-4xl lg:text-6xl font-bold mb-6 arabic-title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1>صفقات التصدير</h1>
            </motion.div>
            <motion.div
              className="text-xl lg:text-2xl mb-8 opacity-90 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <p>اربط منتجاتك بالأسواق العالمية ووسع نطاق تجارتك الزراعية</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Markets Overview */}
      <section className="py-16 bg-gradient-to-br from-slate-900 via-green-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">الأسواق العالمية</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              نربط المنتجين الجزائريين بأهم الأسواق العالمية
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {markets.map((market, index) => (
              <motion.div
                key={market.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-6 text-center"
              >
                <div className="text-4xl mb-4">{market.flag}</div>
                <h3 className="text-xl font-bold text-white mb-3">{market.name}</h3>
                <p className="text-gray-300 mb-4">{market.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="font-bold text-green-400">الفرص:</div>
                  <div className="text-gray-300">{market.opportunities}</div>
                  <div className="font-bold text-green-400 mt-3">المتطلبات:</div>
                  <div className="text-gray-300">{market.requirements}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Export Deals */}
      <section className="py-16 bg-gradient-to-r from-green-100 to-yellow-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-green-800 mb-6">صفقات التصدير المتاحة</h2>
            <p className="text-xl text-green-600 max-w-3xl mx-auto">
              اكتشف أحدث فرص التصدير واربط منتجاتك بالأسواق العالمية
            </p>
          </div>

          {/* Filters */}
          <div className="glass-arabic p-6 mb-12">
            <div className="flex flex-wrap gap-4 justify-center">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`filter-chip ${selectedCategory === category.id ? 'active' : ''}`}
                >
                  <span className="ml-2">{category.icon}</span>
                  {category.label}
                </button>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-4 justify-center mt-4">
              <button
                onClick={() => setSelectedStatus("all")}
                className={`filter-chip ${selectedStatus === "all" ? 'active' : ''}`}
              >
                جميع الحالات
              </button>
              <button
                onClick={() => setSelectedStatus("open")}
                className={`filter-chip ${selectedStatus === "open" ? 'active' : ''}`}
              >
                صفقات مفتوحة
              </button>
              <button
                onClick={() => setSelectedStatus("coming")}
                className={`filter-chip ${selectedStatus === "coming" ? 'active' : ''}`}
              >
                قريباً
              </button>
              <button
                onClick={() => setSelectedStatus("active")}
                className={`filter-chip ${selectedStatus === "active" ? 'active' : ''}`}
              >
                صفقات مستمرة
              </button>
            </div>
          </div>

          {/* Deals Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {filteredDeals.map((deal, index) => (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="export-card"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(deal.status)}`}>
                    {getStatusText(deal.status)}
                  </span>
                  <span className="text-yellow-600 font-bold text-lg">{deal.flag} {deal.destination}</span>
                </div>
                
                <h3 className="text-xl font-bold text-green-800 mb-2">{deal.title}</h3>
                <p className="text-green-600 mb-4">{deal.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">الكمية:</span>
                    <span className="font-bold">{deal.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">السعر:</span>
                    <span className="font-bold text-green-600">{deal.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">الموعد النهائي:</span>
                    <span className="font-bold">{deal.deadline}</span>
                  </div>
                </div>

                {/* Requirements */}
                <div className="mb-4">
                  <div className="text-sm font-bold text-green-700 mb-2">المتطلبات:</div>
                  <div className="space-y-1">
                    {deal.requirements.map((req, idx) => (
                      <div key={idx} className="flex items-center text-sm text-green-600">
                        <i className="fas fa-check text-green-500 ml-2"></i>
                        {req}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  {deal.status === "open" && (
                    <button className="btn-primary-arabic flex-1">
                      <i className="fas fa-handshake ml-2"></i>
                      تقدم للصفقة
                    </button>
                  )}
                  {deal.status === "coming" && (
                    <button className="btn-secondary-arabic flex-1">
                      <i className="fas fa-bell ml-2"></i>
                      تنبيه عند الافتتاح
                    </button>
                  )}
                  {deal.status === "active" && (
                    <button className="btn-primary-arabic flex-1">
                      <i className="fas fa-info-circle ml-2"></i>
                      تفاصيل أكثر
                    </button>
                  )}
                  <button className="btn-secondary-arabic px-4 tooltip" data-tooltip="مشاركة الصفقة">
                    <i className="fas fa-share"></i>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredDeals.length === 0 && (
            <motion.div 
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-green-800 mb-2">لا توجد صفقات متاحة</h3>
              <p className="text-green-600 mb-6">جرب تغيير الفلاتر أو تحقق لاحقاً</p>
              <button 
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedStatus("all");
                }}
                className="btn-primary-arabic"
              >
                إعادة تعيين الفلاتر
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Export Services */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-green-800 mb-6">خدمات التصدير</h2>
            <p className="text-xl text-green-600 max-w-3xl mx-auto">
              نقدم خدمات شاملة لدعم تصدير منتجاتك الزراعية
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="product-card p-6 text-center"
            >
              <div className="feature-icon">
                <i className="fas fa-file-contract"></i>
              </div>
              <h3 className="text-xl font-bold text-green-800 mb-4">إعداد الوثائق</h3>
              <p className="text-green-600">
                مساعدة في إعداد جميع الوثائق المطلوبة للتصدير
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="product-card p-6 text-center"
            >
              <div className="feature-icon">
                <i className="fas fa-certificate"></i>
              </div>
              <h3 className="text-xl font-bold text-green-800 mb-4">شهادات الجودة</h3>
              <p className="text-green-600">
                الحصول على شهادات الجودة الدولية المطلوبة
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="product-card p-6 text-center"
            >
              <div className="feature-icon">
                <i className="fas fa-shipping-fast"></i>
              </div>
              <h3 className="text-xl font-bold text-green-800 mb-4">خدمات النقل</h3>
              <p className="text-green-600">
                ترتيب النقل والشحن الدولي بأفضل الأسعار
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="product-card p-6 text-center"
            >
              <div className="feature-icon">
                <i className="fas fa-handshake"></i>
              </div>
              <h3 className="text-xl font-bold text-green-800 mb-4">وساطة تجارية</h3>
              <p className="text-green-600">
                ربط المنتجين بالمشترين الدوليين
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-800 to-yellow-700 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            className="text-3xl lg:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2>ابدأ تصدير منتجاتك اليوم</h2>
          </motion.div>
          <motion.div
            className="text-xl mb-8 opacity-90"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p>انضم إلى شبكة المصدرين الجزائريين ووسع نطاق تجارتك</p>
          </motion.div>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <button className="btn-primary-arabic">
              <i className="fas fa-plus ml-2"></i>
              أضف منتج للتصدير
            </button>
            <button className="btn-secondary-arabic">
              <i className="fas fa-phone ml-2"></i>
              اتصل بنا
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 
