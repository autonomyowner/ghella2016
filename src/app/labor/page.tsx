'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Users, Phone, MapPin, Star, Clock, 
  Leaf, Droplets, Wrench, Palette
} from 'lucide-react'

const LaborPage: React.FC = () => {
  const [isClient, setIsClient] = useState(false)
  const [windowDimensions, setWindowDimensions] = useState({ width: 1000, height: 1000 })

  useEffect(() => {
    setIsClient(true)
    setWindowDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    })
  }, [])

  const laborServices = [
    {
      id: 1,
      title: 'يد عاملة فلاحية متخصصة',
      description: 'يد عاملة فلاحية متخصصة في مختلف المهام الموسمية، من الجني والغرس إلى التقليم، الري، التسميد، والتنظيف',
      image: '/assets/khdam1.jpg',
      icon: <Users className="w-8 h-8" />,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
      features: ['حصاد', 'غرس', 'تقليم', 'ري', 'تسميد', 'تنظيف'],
      contact: '0558981686'
    },
    {
      id: 2,
      title: 'صيانة البيوت البلاستيكية',
      description: 'صيانة البيوت البلاستيكية وإصلاحها، تشمل إصلاح الأغطية، الأنظمة الهيدروليكية، والتحكم في المناخ',
      image: '/assets/plastic.jpg',
      icon: <Wrench className="w-8 h-8" />,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      features: ['إصلاح الأغطية', 'أنظمة هيدروليكية', 'تحكم مناخي', 'صيانة دورية'],
      contact: '0798700447'
    },
    {
      id: 3,
      title: 'إنشاء بساتين السقي',
      description: 'إنشاء بساتين السقي وتصميم أنظمة الري الحديثة، تشمل التخطيط، التركيب، والصيانة',
      image: '/assets/sd.jpg',
      icon: <Droplets className="w-8 h-8" />,
      color: 'from-purple-500 to-indigo-600',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      features: ['تصميم أنظمة ري', 'تركيب شبكات', 'صيانة دورية', 'تحسين كفاءة'],
      contact: '0660378697'
    },
    {
      id: 4,
      title: 'تجميل الحدائق وتنسيق المساحات الخضراء',
      description: 'تجميل الحدائق وتنسيق المساحات الخضراء، تشمل تصميم الحدائق، زراعة النباتات، والعناية بها',
      image: '/assets/gardini.jpg',
      icon: <Palette className="w-8 h-8" />,
      color: 'from-pink-500 to-rose-600',
      bgColor: 'bg-pink-500/10',
      borderColor: 'border-pink-500/20',
      features: ['تصميم حدائق', 'زراعة نباتات', 'عناية دورية', 'تنسيق مساحات'],
      contact: '0558981686'
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
              <h1>خدمات اليد العاملة الفلاحية</h1>
            </motion.div>

            {/* Subtitle */}
            <motion.div
              className="text-xl lg:text-2xl mb-12 opacity-90 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              <p>خدمات متخصصة في المجال الزراعي تشمل العمالة الماهرة، الصيانة، أنظمة الري، وتجميل الحدائق</p>
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
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto"
          >
            {laborServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`group relative overflow-hidden rounded-2xl ${service.bgColor} ${service.borderColor} border-2 hover:border-opacity-50 transition-all duration-500 hover:scale-105`}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                {/* Card Content */}
                <div className="relative p-8">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${service.color} text-white shadow-lg`}>
                        {service.icon}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">{service.title}</h3>
                        <div className="flex items-center gap-2 text-green-300">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm">خدمة متميزة</span>
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
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="text-white font-semibold mb-3">الخدمات المقدمة:</h4>
                    <div className="flex flex-wrap gap-2">
                      {service.features.map((feature, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-green-300">
                        <Phone className="w-4 h-4" />
                        <span className="text-sm">{service.contact}</span>
                      </div>
                      <div className="flex items-center gap-2 text-green-300">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">متوفر 24/7</span>
                      </div>
                    </div>
                    
                    {/* Contact Button */}
                    <Link
                      href={`tel:${service.contact}`}
                      className={`px-6 py-3 bg-gradient-to-r ${service.color} hover:scale-105 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl`}
                    >
                      اتصل الآن
                    </Link>
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </motion.div>
            ))}
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mt-16"
          >
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">
                احتاج خدمة مخصصة؟
              </h3>
              <p className="text-gray-300 mb-6">
                تواصل معنا للحصول على استشارة مجانية وتقدير سعر مخصص لاحتياجاتك
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  احصل على استشارة مجانية
                </Link>
                <a
                  href="tel:0551234567"
                  className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                >
                  اتصل بنا مباشرة
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default LaborPage 
