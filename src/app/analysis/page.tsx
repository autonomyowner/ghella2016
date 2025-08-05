'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Satellite, Droplets, AlertTriangle, 
  TrendingUp, Cloud, Phone, Clock
} from 'lucide-react'

const AnalysisPage: React.FC = () => {
  const [isClient, setIsClient] = useState(false)
  const [windowDimensions, setWindowDimensions] = useState({ width: 1000, height: 1000 })

  useEffect(() => {
    setIsClient(true)
    setWindowDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    })
  }, [])

  const analysisServices = [
    {
      id: 1,
      title: 'مراقبة صحة المحاصيل',
      subtitle: '📡 راقب محاصيلك بالأقمار الصناعية!',
      description: 'تابع نمو محاصيلك في كل مرحلة (نمو، تزهير، إثمار) وكشف المناطق الضعيفة أو المريضة مبكرًا عبر صور الأقمار الصناعية. تنبيهات أسبوعية تُطلعك على أي تدهور وتساعدك على التدخل السريع.',
      image: '/assets/مراقبة.jpg',
      icon: <Satellite className="w-8 h-8" />,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
      features: ['مراقبة مستمرة', 'تنبيهات أسبوعية', 'كشف مبكر للأمراض', 'تقارير مفصلة'],
      contact: '0558981686'
    },
    {
      id: 2,
      title: 'تحليل رطوبة التربة الذكي',
      subtitle: '💧 اعرف متى تسقي… ولا تضيّع قطرة ماء!',
      description: 'تقدير دقيق لرطوبة التربة من الأقمار الصناعية لتفادي الجفاف أو السقي الزائد. تقارير أسبوعية وتنبيهات تلقائية تساعدك على ضبط السقي بدقة وتوفير المياه.',
      image: '/assets/ري.jpg',
      icon: <Droplets className="w-8 h-8" />,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      features: ['تحليل دقيق', 'تنبيهات تلقائية', 'توفير المياه', 'تقارير أسبوعية'],
      contact: '0798700447'
    },
    {
      id: 3,
      title: 'تشخيص أضرار المحاصيل',
      subtitle: '⚠️ هل تضررت محاصيلك؟ نحن نُقيّم ونُحلّل!',
      description: 'صور فضائية قبل وبعد الحوادث (برد، حرائق، جفاف) لتحديد حجم الضرر بدقة. تقارير احترافية تُستخدم في ملفات التأمين أو طلبات الدعم.',
      image: '/assets/تشخيص.jpg',
      icon: <AlertTriangle className="w-8 h-8" />,
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20',
      features: ['تحليل قبل وبعد', 'تقارير احترافية', 'ملفات التأمين', 'تقييم دقيق'],
      contact: '0660378697'
    },
    {
      id: 4,
      title: 'تقدير مردودية المحاصيل',
      subtitle: '🌾 كم ستحصد؟ نُعطيك الأرقام من الآن!',
      description: 'حساب كمية الإنتاج المحتمل بالهكتار والعائد المالي المتوقع استنادًا إلى مؤشرات نباتية واقعية. تقرير شامل لمساعدتك في التخطيط والتسويق والتصدير.',
      image: '/assets/تقدير.jpg',
      icon: <TrendingUp className="w-8 h-8" />,
      color: 'from-purple-500 to-indigo-600',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      features: ['تقدير الإنتاج', 'تحليل مالي', 'تخطيط تسويقي', 'مؤشرات واقعية'],
      contact: '0558981686'
    },
    {
      id: 5,
      title: 'التوقعات الجوية الزراعية الذكية',
      subtitle: '🌤️ الطقس لم يعد مفاجئًا بعد اليوم!',
      description: 'نقدم لك توقعات مفصّلة للأمطار والحرارة والعواصف في منطقتك الزراعية، مع نصائح زراعية تتماشى مع حالة الطقس لحماية محصولك وتخطيط عملياتك.',
      image: '/assets/توقعجوي.jpg',
      icon: <Cloud className="w-8 h-8" />,
      color: 'from-teal-500 to-cyan-600',
      bgColor: 'bg-teal-500/10',
      borderColor: 'border-teal-500/20',
      features: ['توقعات مفصلة', 'نصائح زراعية', 'حماية المحاصيل', 'تخطيط العمليات'],
      contact: '0798700447'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900" dir="rtl">
      {/* Header Section */}
      <section className="relative py-20 bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 text-white overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-800/20 via-green-900/20 to-slate-900/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(22,163,74,0.2),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(21,128,61,0.2),transparent_50%)]"></div>
        
        {/* Floating Particles - Only render on client */}
        {isClient && (
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-green-400/30 rounded-full"
                initial={{ 
                  x: Math.random() * windowDimensions.width,
                  y: Math.random() * windowDimensions.height,
                  opacity: 0
                }}
                animate={{
                  y: [null, -100, -200],
                  opacity: [0, 0.5, 0],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        )}

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            {/* Main Title */}
            <motion.div 
              className="text-5xl lg:text-7xl font-black mb-8 bg-gradient-to-r from-green-300 via-green-200 to-green-400 bg-clip-text text-transparent drop-shadow-lg"
              initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <h1>خدمات التحليل والدراسات</h1>
            </motion.div>
            
            {/* Subtitle */}
            <motion.div 
              className="text-xl lg:text-2xl mb-12 text-white/95 max-w-4xl mx-auto leading-relaxed font-medium"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              <p>خدمات تحليل متقدمة للتربة والمحاصيل باستخدام أحدث التقنيات والأقمار الصناعية</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Cards Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto"
          >
            {analysisServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`group relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-sm ${service.borderColor} border-2 hover:border-opacity-50 transition-all duration-500 hover:scale-105 shadow-xl`}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                                  {/* Card Content */}
                  <div className="relative p-8 bg-white/95 backdrop-blur-sm rounded-xl">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${service.color} text-white shadow-lg`}>
                          {service.icon}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">{service.title}</h3>
                          <p className="text-sm text-gray-700 mb-1 font-medium">{service.subtitle}</p>
                          <div className="flex items-center gap-2 text-green-700">
                            <span className="text-sm font-semibold">خدمة متقدمة</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Image */}
                    <div className="relative h-48 mb-6 rounded-xl overflow-hidden">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          // Fallback to gradient if image fails
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement!.className = `relative h-48 mb-6 rounded-xl overflow-hidden bg-gradient-to-br ${service.color}`;
                        }}
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500"></div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-800 mb-6 leading-relaxed font-medium">
                      {service.description}
                    </p>

                    {/* Features */}
                    <div className="mb-6">
                      <h4 className="text-gray-900 font-bold mb-3 text-lg">المميزات:</h4>
                      <div className="flex flex-wrap gap-2">
                        {service.features.map((feature, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-2 bg-white shadow-md rounded-full text-sm text-gray-800 border border-gray-300 font-medium"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex items-center gap-2 text-green-700">
                        <Phone className="w-4 h-4" />
                        <span className="text-sm font-semibold">{service.contact}</span>
                      </div>
                      <div className="flex items-center gap-2 text-green-700">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-semibold">متوفر 24/7</span>
                      </div>
                    </div>

                  {/* Contact Button */}
                  <Link
                    href={`tel:${service.contact}`}
                    className={`w-full text-center px-6 py-3 bg-gradient-to-r ${service.color} hover:scale-105 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl`}
                  >
                    احجز الآن
                  </Link>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default AnalysisPage 
