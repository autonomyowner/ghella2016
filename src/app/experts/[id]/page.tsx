'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const MotionDiv = dynamic(() => import('framer-motion').then(mod => mod.motion.div), { ssr: false, loading: () => <div /> });
const MotionButton = dynamic(() => import('framer-motion').then(mod => mod.motion.button), { ssr: false, loading: () => <button /> });
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowRight, Star, MapPin, Clock, Phone, Mail, 
  Award, GraduationCap, Briefcase, Languages, 
  MessageCircle, Calendar, Share2, Heart,
  CheckCircle, Users, Eye
} from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebaseConfig';
import { useAuth } from '@/contexts/AuthContext';

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

interface Review {
  id: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  created_at: string;
  reviewer_avatar?: string;
}

export default function ExpertDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [expert, setExpert] = useState<Expert | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const expertId = params.id as string;

  useEffect(() => {
    if (expertId) {
      fetchExpert();
      fetchReviews();
    }
  }, [expertId]);

  // ...existing code...
  const fetchExpert = async () => {
    try {
      const docRef = doc(firestore, 'expert_profiles', expertId);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        router.push('/experts');
        return;
      }
      const docData = docSnap.data();
      setExpert({
        id: expertId,
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
      });
    } catch (error) {
      console.error('Error:', error);
      router.push('/experts');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      // Mock reviews data for now
      const mockReviews: Review[] = [
        {
          id: '1',
          reviewer_name: 'أحمد محمد',
          rating: 5,
          comment: 'خبير ممتاز، قدم لي استشارة قيمة حول زراعة الطماطم. نصائحه ساعدتني في زيادة الإنتاج بشكل كبير.',
          created_at: '2024-01-15',
          reviewer_avatar: ''
        },
        {
          id: '2',
          reviewer_name: 'فاطمة الزهراء',
          rating: 4,
          comment: 'متخصص في مجاله ومتعاون جداً. أجاب على جميع استفساراتي بصبر ووضوح.',
          created_at: '2024-01-10',
          reviewer_avatar: ''
        }
      ];
      setReviews(mockReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleContactReveal = () => {
    setShowContactInfo(true);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${expert?.name} - خبير ${expert?.specialization}`,
          text: expert?.bio,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('تم نسخ الرابط');
    }
  };

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
    // TODO: Implement favorite functionality with backend
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!expert) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">خبير غير موجود</h2>
          <Link href="/experts" className="text-green-600 hover:text-green-700">
            العودة إلى قائمة الخبراء
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/experts"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
              العودة إلى الخبراء
            </Link>

            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
              
              <button
                onClick={toggleFavorite}
                className={`p-2 rounded-lg transition-colors ${
                  isFavorited 
                    ? 'text-red-600 bg-red-50 hover:bg-red-100' 
                    : 'text-gray-600 hover:text-red-600 hover:bg-gray-100'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Expert Profile Card */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Profile Image */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg mx-auto md:mx-0">
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
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                  )}

                  <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium ${
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

                {/* Expert Info */}
                <div className="flex-1 text-center md:text-right">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {expert.name}
                  </h1>
                  
                  <p className="text-xl text-green-600 font-medium mb-4">
                    {expert.title}
                  </p>

                  <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      <span className="font-medium">{expert.rating}</span>
                      <span>({expert.reviews_count} تقييم)</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <Briefcase className="w-5 h-5" />
                      <span>{expert.years_of_experience} سنوات خبرة</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-5 h-5" />
                      <span>{expert.location}</span>
                    </div>
                  </div>

                  {expert.hourly_rate && (
                    <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full font-medium">
                      <Clock className="w-4 h-4" />
                      {expert.hourly_rate} دج/ساعة
                    </div>
                  )}
                </div>
              </div>
            </MotionDiv>

            {/* About */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">نبذة تعريفية</h2>
              <p className="text-gray-700 leading-relaxed">{expert.bio}</p>
            </MotionDiv>

            {/* Education & Certifications */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">التعليم والشهادات</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">المؤهل التعليمي</h3>
                    <p className="text-gray-700">{expert.education}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Award className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">التخصص</h3>
                    <p className="text-gray-700">{expert.specialization}</p>
                  </div>
                </div>

                {expert.certifications.length > 0 && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Award className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">الشهادات والدورات</h3>
                      <div className="space-y-2">
                        {expert.certifications.map((cert, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-gray-700">{cert}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {expert.languages.length > 0 && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <Languages className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">اللغات</h3>
                      <div className="flex flex-wrap gap-2">
                        {expert.languages.map((language, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                          >
                            {language}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </MotionDiv>

            {/* Services */}
            {expert.services_offered.length > 0 && (
              <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">الخدمات المقدمة</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {expert.services_offered.map((service, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200"
                    >
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-gray-800">{service}</span>
                    </div>
                  ))}
                </div>
              </MotionDiv>
            )}

            {/* Reviews */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">التقييمات</h2>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="font-bold text-lg">{expert.rating}</span>
                  <span className="text-gray-600">({expert.reviews_count} تقييم)</span>
                </div>
              </div>

              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        {review.reviewer_avatar ? (
                          <img
                            src={review.reviewer_avatar}
                            alt={review.reviewer_name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-600 font-medium">
                            {review.reviewer_name.charAt(0)}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium text-gray-900">{review.reviewer_name}</h4>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating 
                                    ? 'text-yellow-500 fill-current' 
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.created_at).toLocaleDateString('ar-DZ')}
                          </span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </MotionDiv>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Contact Card */}
              <MotionDiv
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">تواصل مع الخبير</h3>
                
                {showContactInfo ? (
                  <div className="space-y-4">
                    {expert.phone && (
                      <a
                        href={`tel:${expert.phone}`}
                        className="flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        <Phone className="w-5 h-5 text-green-600" />
                        <span className="text-gray-800">{expert.phone}</span>
                      </a>
                    )}
                    
                    {expert.email && (
                      <a
                        href={`mailto:${expert.email}`}
                        className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <Mail className="w-5 h-5 text-blue-600" />
                        <span className="text-gray-800">{expert.email}</span>
                      </a>
                    )}
                    
                    <button className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium">
                      <MessageCircle className="w-5 h-5" />
                      إرسال رسالة
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-gray-600 mb-4">
                      اضغط لعرض معلومات التواصل
                    </p>
                    <button
                      onClick={handleContactReveal}
                      className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      عرض معلومات التواصل
                    </button>
                  </div>
                )}
              </MotionDiv>

              {/* Quick Stats */}
              <MotionDiv
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">إحصائيات سريعة</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">سنوات الخبرة</span>
                    <span className="font-medium">{expert.years_of_experience}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">التقييم</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="font-medium">{expert.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">عدد التقييمات</span>
                    <span className="font-medium">{expert.reviews_count}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">انضم في</span>
                    <span className="font-medium">
                      {new Date(expert.created_at).toLocaleDateString('ar-DZ')}
                    </span>
                  </div>
                </div>
              </MotionDiv>

              {/* Related Experts */}
              <MotionDiv
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">خبراء مشابهون</h3>
                
                <div className="space-y-3">
                  <Link href="/experts" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-medium">
                        م
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">محمد العلوي</h4>
                        <p className="text-sm text-gray-600">خبير وقاية النبات</p>
                      </div>
                    </div>
                  </Link>
                  
                  <Link href="/experts" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                        ف
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">فاطمة بن علي</h4>
                        <p className="text-sm text-gray-600">خبيرة المحاصيل</p>
                      </div>
                    </div>
                  </Link>
                </div>
                
                <Link 
                  href="/experts"
                  className="block text-center text-green-600 hover:text-green-700 font-medium mt-4"
                >
                  عرض المزيد من الخبراء
                </Link>
              </MotionDiv>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
