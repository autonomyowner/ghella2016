'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const MotionDiv = dynamic(() => import('framer-motion').then(mod => mod.motion.div), { ssr: false, loading: () => <div /> });
const MotionButton = dynamic(() => import('framer-motion').then(mod => mod.motion.button), { ssr: false, loading: () => <button /> });
const AnimatePresence = dynamic(() => import('framer-motion').then(mod => mod.AnimatePresence), { ssr: false, loading: () => null });
import Link from 'next/link';
import { 
  Users, Search, Filter, MapPin, Star, Award, 
  BookOpen, Calendar, Phone, Mail, Briefcase,
  GraduationCap, User, Plus, Eye
} from 'lucide-react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { firestore } from '@/lib/firebaseConfig';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

interface Expert {
  id: string;
  user_id: string;
  name: string;
  title: string;
  specialization: string;
  bio: string;
  years_of_experience: number;
  education: string;
  certifications: string[];
  location: string;
  phone: string | null;
  email: string | null;
  profile_image: string | null;
  rating: number;
  reviews_count: number;
  hourly_rate: number | null;
  availability_status: 'available' | 'busy' | 'unavailable';
  services_offered: string[];
  languages: string[];
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const ExpertFlipCard = ({ expert }: { expert: Expert }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <MotionDiv
      className="relative w-full h-96 perspective-1000"
      onHoverStart={() => setIsFlipped(true)}
      onHoverEnd={() => setIsFlipped(false)}
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <MotionDiv
        className="relative w-full h-full transform-style-preserve-3d transition-transform duration-700"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
      >
        {/* Front Side */}
        <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl shadow-xl border border-green-200 p-6 flex flex-col items-center justify-center">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {expert.profile_image ? (
                <img 
                  src={expert.profile_image} 
                  alt={expert.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                expert.name.charAt(0).toUpperCase()
              )}
            </div>
            {expert.is_verified && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <Award className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          
          <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
            {expert.name}
          </h3>
          
          <p className="text-green-600 font-medium text-center mb-3">
            {expert.title}
          </p>
          
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-gray-700 text-sm">
              {expert.rating} ({expert.reviews_count} تقييم)
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
            <Briefcase className="w-4 h-4" />
            <span>{expert.years_of_experience} سنوات خبرة</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <MapPin className="w-4 h-4" />
            <span>{expert.location}</span>
          </div>
          
          <div className={`mt-4 px-3 py-1 rounded-full text-xs font-medium ${
            expert.availability_status === 'available' 
              ? 'bg-green-100 text-green-800'
              : expert.availability_status === 'busy'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {expert.availability_status === 'available' ? 'متاح' : 
             expert.availability_status === 'busy' ? 'مشغول' : 'غير متاح'}
          </div>
        </div>

        {/* Back Side */}
        <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-emerald-600 to-green-700 rounded-2xl shadow-xl p-6 text-white transform rotateY-180">
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="w-5 h-5" />
              <h4 className="font-bold text-lg">الخبرة والتعليم</h4>
            </div>
            
            <div className="space-y-3 flex-1">
              <div>
                <p className="text-emerald-100 text-sm mb-1">التخصص:</p>
                <p className="font-medium">{expert.specialization}</p>
              </div>
              
              <div>
                <p className="text-emerald-100 text-sm mb-1">التعليم:</p>
                <p className="text-sm">{expert.education}</p>
              </div>
              
              {expert.certifications.length > 0 && (
                <div>
                  <p className="text-emerald-100 text-sm mb-1">الشهادات:</p>
                  <div className="flex flex-wrap gap-1">
                    {expert.certifications.slice(0, 2).map((cert, index) => (
                      <span key={index} className="text-xs bg-green-500 px-2 py-1 rounded">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {expert.hourly_rate && (
                <div>
                  <p className="text-emerald-100 text-sm mb-1">السعر بالساعة:</p>
                  <p className="font-bold">{expert.hourly_rate} دج</p>
                </div>
              )}
            </div>
            
            <div className="mt-4 space-y-2">
              <Link 
                href={`/experts/${expert.id}`}
                className="block w-full bg-white text-green-700 py-2 px-4 rounded-lg text-center font-medium hover:bg-green-50 transition-colors"
              >
                عرض التفاصيل
              </Link>
              
              <div className="flex gap-2">
                {expert.phone && (
                  <a 
                    href={`tel:${expert.phone}`}
                    className="flex-1 bg-green-500 py-2 px-3 rounded-lg text-center text-sm hover:bg-green-400 transition-colors"
                  >
                    <Phone className="w-4 h-4 mx-auto" />
                  </a>
                )}
                {expert.email && (
                  <a 
                    href={`mailto:${expert.email}`}
                    className="flex-1 bg-green-500 py-2 px-3 rounded-lg text-center text-sm hover:bg-green-400 transition-colors"
                  >
                    <Mail className="w-4 h-4 mx-auto" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </MotionDiv>
    </MotionDiv>
  );
};

export default function ExpertsPage() {
  const { user } = useAuth();
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showFilters, setShowFilters] = useState(false);


  useEffect(() => {
    const fetchExperts = async () => {
      try {
        setLoading(true);
        const q = query(collection(firestore, 'expert_profiles'), orderBy('rating', 'desc'));
        const snapshot = await getDocs(q);
        const expertsData = snapshot.docs.map(doc => {
          const docData = doc.data();
          return {
            id: doc.id,
            user_id: docData.user_id || '',
            name: docData.name || '',
            title: docData.title || '',
            specialization: docData.specialization || '',
            bio: docData.bio || '',
            years_of_experience: docData.years_of_experience || 0,
            education: docData.education || '',
            certifications: docData.certifications || [],
            location: docData.location || '',
            phone: docData.phone || null,
            email: docData.email || null,
            profile_image: docData.profile_image || null,
            rating: docData.rating || 0,
            reviews_count: docData.reviews_count || 0,
            hourly_rate: docData.hourly_rate || null,
            availability_status: docData.availability_status || 'available',
            services_offered: docData.services_offered || [],
            languages: docData.languages || [],
            is_verified: docData.is_verified || false,
            is_active: docData.is_active || true,
            created_at: docData.created_at || '',
            updated_at: docData.updated_at || '',
          };
        });
        setExperts(expertsData);
      } catch (error) {
        console.error('Error fetching experts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchExperts();
  }, []);

  const filteredExperts = experts.filter(expert => {
    const matchesSearch = expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         expert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         expert.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSpecialization = !selectedSpecialization || 
                                 expert.specialization.includes(selectedSpecialization);
    
    const matchesLocation = !selectedLocation || 
                           expert.location.includes(selectedLocation);
    
    return matchesSearch && matchesSpecialization && matchesLocation;
  });

  const specializations = [...new Set(experts.map(expert => expert.specialization))];
  const locations = [...new Set(experts.map(expert => expert.location))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                خبراء الزراعة في الجزائر
              </h1>
              <p className="text-xl text-green-100 max-w-3xl mx-auto mb-8">
                تواصل مع أفضل الخبراء الزراعيين للحصول على استشارات متخصصة وحلول مبتكرة لمزرعتك
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {user ? (
                  <Link href="/experts/new">
                    <MotionButton
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 bg-white text-green-700 rounded-full font-bold text-lg shadow-lg hover:bg-green-50 transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      انضم كخبير
                    </MotionButton>
                  </Link>
                ) : (
                  <Link href="/auth/signin">
                    <MotionButton
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 bg-white text-green-700 rounded-full font-bold text-lg shadow-lg hover:bg-green-50 transition-colors flex items-center gap-2"
                    >
                      <User className="w-5 h-5" />
                      سجل دخول للانضمام
                    </MotionButton>
                  </Link>
                )}
                
                <MotionButton
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-green-500 text-white rounded-full font-bold text-lg border-2 border-white/30 hover:bg-green-400 transition-colors flex items-center gap-2"
                >
                  <Eye className="w-5 h-5" />
                  تصفح الخبراء
                </MotionButton>
              </div>
            </MotionDiv>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="ابحث عن خبير، تخصص، أو مهارة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 rounded-xl transition-colors flex items-center gap-2 ${
                showFilters ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Filter className="w-5 h-5" />
              تصفية
            </button>

            {/* Stats */}
            <div className="text-gray-600 text-sm">
              <span className="font-medium">{filteredExperts.length}</span> خبير متاح
            </div>
          </div>

          {/* Filter Panel */}
          <AnimatePresence>
            {showFilters && (
              <MotionDiv
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-gray-200 mt-4 pt-4 overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      التخصص
                    </label>
                    <select
                      value={selectedSpecialization}
                      onChange={(e) => setSelectedSpecialization(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">جميع التخصصات</option>
                      {specializations.map((spec, index) => (
                        <option key={index} value={spec}>{spec}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الموقع
                    </label>
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">جميع المواقع</option>
                      {locations.map((location, index) => (
                        <option key={index} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </MotionDiv>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : filteredExperts.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              لا يوجد خبراء متطابقون مع البحث
            </h3>
            <p className="text-gray-500">
              جرب تغيير معايير البحث أو التصفية
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredExperts.map((expert, index) => (
              <ExpertFlipCard key={expert.id} expert={expert} />
            ))}
          </div>
        )}
      </div>

      {/* Call to Action */}
      {!user && (
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              هل أنت خبير زراعي؟
            </h2>
            <p className="text-xl text-green-100 mb-8">
              انضم إلى منصتنا وشارك خبرتك مع آلاف المزارعين في الجزائر
            </p>
            <Link href="/auth/signup">
              <MotionButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-green-700 rounded-full font-bold text-lg shadow-lg hover:bg-green-50 transition-colors"
              >
                ابدأ الآن - إنشاء حساب
              </MotionButton>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
