'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Truck, Package, Sprout, Wrench, 
  Phone, MapPin, Star, Clock, 
  Leaf, Droplets, Palette
} from 'lucide-react'

const DeliveryPage: React.FC = () => {
  const [isClient, setIsClient] = useState(false)
  const [windowDimensions, setWindowDimensions] = useState({ width: 1000, height: 1000 })

  useEffect(() => {
    setIsClient(true)
    setWindowDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    })
  }, [])

  const deliveryServices = [
    {
      id: 1,
      title: 'نقل المنتجات',
      description: 'نقل آمن وسريع للمنتجات الزراعية الطازجة من المزرعة إلى الأسواق والمستهلكين مع ضمان الجودة والسلامة',
      image: '/assets/exporting1.jpg',
      icon: <Package className="w-8 h-8" />,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
      features: ['منتجات طازجة', 'توصيل سريع', 'ضمان الجودة', 'تتبع الشحنات'],
      contact: '0558981686'
    },
    {
      id: 2,
      title: 'نقل المعدات',
      description: 'نقل المعدات الزراعية والآليات الثقيلة مثل الجرارات والحصادات والمعدات المتخصصة بأمان تام',
      image: '/assets/machin01.jpg',
      icon: <Wrench className="w-8 h-8" />,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      features: ['معدات ثقيلة', 'آليات زراعية', 'تأمين شامل', 'خدمة 24/7'],
      contact: '0798700447'
    },
    {
      id: 3,
      title: 'نقل مستلزمات الزراعة',
      description: 'نقل البذور، الأسمدة، المشاتل، والمواد الزراعية الأساسية لضمان وصولها في الوقت المناسب',
      image: '/assets/seedings01.jpg',
      icon: <Sprout className="w-8 h-8" />,
      color: 'from-purple-500 to-indigo-600',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      features: ['بذور وأسمدة', 'مشاتل نباتات', 'مواد زراعية', 'توصيل دقيق'],
      contact: '0660378697'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50" dir="rtl">
      {/* Header Section */}
      <section className="relative py-20 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(22,163,74,0.2),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(21,128,61,0.2),transparent_50%)]"></div>
        
        {/* Floating Particles - Only render on client */}
        {isClient && (
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(15)].map((_, i) => (
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
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-2xl"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              تنقل مع الغلة
            </motion.h1>
            
            {/* Subtitle */}
            <motion.p 
              className="text-lg md:text-xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              نحن نسهّل على الفلاحين نقل منتجاتهم، معداتهم، واحتياجاتهم الزراعية أينما كانوا.
            </motion.p>
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
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
          >
            {deliveryServices.map((service, index) => (
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
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">{service.title}</h3>
                        <div className="flex items-center gap-2 text-green-600">
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
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="text-gray-800 font-semibold mb-3">المميزات:</h4>
                    <div className="flex flex-wrap gap-2">
                      {service.features.map((feature, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full text-sm text-gray-700 border border-gray-200"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center gap-2 text-green-600">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{service.contact}</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">متوفر 24/7</span>
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

export default DeliveryPage 
