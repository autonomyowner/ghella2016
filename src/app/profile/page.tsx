'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Equipment, LandListing } from '@/types/database.types';

const ProfilePage: React.FC = () => {
  const { user, profile, updateProfile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userListings, setUserListings] = useState<{
    equipment: Equipment[];
    land: LandListing[];
  }>({ equipment: [], land: [] });

  // Form state
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    phone: '',
    location: '',
    website: '',
    company: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        phone: profile.phone || '',
        location: profile.location || '',
        website: profile.website || '',
        company: profile.company || ''
      });
    }
  }, [profile]);

  useEffect(() => {
    if (user) {
      fetchUserListings();
    }
  }, [user]);

  const fetchUserListings = async () => {
    if (!user) return;

    try {
      // Fetch equipment listings
      const { data: equipmentData, error: equipmentError } = await supabase
        .from('equipment')
        .select(`
          *,
          categories:category_id (name_ar, icon)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Fetch land listings
      const { data: landData, error: landError } = await supabase
        .from('land_listings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!equipmentError && !landError) {
        setUserListings({
          equipment: equipmentData || [],
          land: landData || []
        });
      }
    } catch (error) {
      console.error('Error fetching user listings:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await updateProfile(formData);
      if (error) {
        alert('حدث خطأ في تحديث الملف الشخصي: ' + error.message);
      } else {
        alert('تم تحديث الملف الشخصي بنجاح');
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('حدث خطأ في تحديث الملف الشخصي');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteListing = async (type: 'equipment' | 'land', id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الإعلان؟')) return;

    try {
      const tableName = type === 'equipment' ? 'equipment' : 'land_listings';
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (error) {
        alert('حدث خطأ في حذف الإعلان: ' + error.message);
      } else {
        alert('تم حذف الإعلان بنجاح');
        fetchUserListings();
      }
    } catch (error) {
      console.error('Error deleting listing:', error);
      alert('حدث خطأ في حذف الإعلان');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('ar-SA').format(price) + ' ' + currency;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen gradient-bg-primary pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-white/20 rounded mb-4 w-1/3"></div>
            <div className="h-64 bg-white/20 rounded mb-6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  return (
    <div className="min-h-screen gradient-bg-primary pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">الملف الشخصي</h1>
            <p className="text-xl text-green-200">
              إدارة معلوماتك الشخصية وإعلاناتك
            </p>
          </div>

          {/* Profile Information */}
          <div className="card-responsive glass mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">المعلومات الشخصية</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-gradient-to-r from-brand-primary to-brand-accent text-white rounded-lg hover:shadow-lg transition-all duration-300"
              >
                {isEditing ? 'إلغاء' : 'تعديل'}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      الاسم الكامل
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      رقم الهاتف
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      الموقع
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      الشركة
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      الموقع الإلكتروني
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    نبذة عني
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 resize-none"
                    placeholder="اكتب نبذة مختصرة عنك وعن نشاطك في المجال الزراعي..."
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-brand-primary to-brand-accent text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                  >
                    {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-white font-bold text-xl">
                    {profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {profile?.full_name || 'اسم المستخدم'}
                    </h3>
                    <p className="text-white/70">{user.email}</p>
                    {profile?.company && (
                      <p className="text-white/70">{profile.company}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {profile?.phone && (
                    <div>
                      <p className="text-white/70 text-sm">رقم الهاتف</p>
                      <p className="text-white">{profile.phone}</p>
                    </div>
                  )}

                  {profile?.location && (
                    <div>
                      <p className="text-white/70 text-sm">الموقع</p>
                      <p className="text-white">{profile.location}</p>
                    </div>
                  )}

                  {profile?.website && (
                    <div>
                      <p className="text-white/70 text-sm">الموقع الإلكتروني</p>
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-primary hover:underline"
                      >
                        {profile.website}
                      </a>
                    </div>
                  )}
                </div>

                {profile?.bio && (
                  <div>
                    <p className="text-white/70 text-sm mb-2">نبذة عني</p>
                    <p className="text-white">{profile.bio}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Listings */}
          <div className="card-responsive glass">
            <h2 className="text-2xl font-bold text-white mb-6">إعلاناتي</h2>

            {/* Equipment Listings */}
            {userListings.equipment.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4">المعدات الزراعية</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userListings.equipment.map((equipment) => (
                    <div key={equipment.id} className="bg-white/10 rounded-lg p-4 border border-white/20">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-bold text-white text-sm">{equipment.title}</h4>
                        <div className="flex gap-2">
                          <button
                            onClick={() => router.push(`/equipment/${equipment.id}`)}
                            className="p-1 text-brand-primary hover:bg-brand-primary/20 rounded"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteListing('equipment', equipment.id)}
                            className="p-1 text-red-400 hover:bg-red-400/20 rounded"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <p className="text-white/70 text-xs mb-2">
                        {equipment.categories?.name_ar} • {equipment.location}
                      </p>
                      <p className="text-brand-primary font-bold text-sm">
                        {formatPrice(equipment.price, equipment.currency)}
                      </p>
                      <p className="text-white/60 text-xs mt-1">
                        {formatDate(equipment.created_at)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Land Listings */}
            {userListings.land.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4">الأراضي الزراعية</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userListings.land.map((land) => (
                    <div key={land.id} className="bg-white/10 rounded-lg p-4 border border-white/20">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-bold text-white text-sm">{land.title}</h4>
                        <div className="flex gap-2">
                          <button
                            onClick={() => router.push(`/land/${land.id}`)}
                            className="p-1 text-brand-primary hover:bg-brand-primary/20 rounded"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteListing('land', land.id)}
                            className="p-1 text-red-400 hover:bg-red-400/20 rounded"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <p className="text-white/70 text-xs mb-2">
                        {land.listing_type === 'sale' ? 'للبيع' : 'للإيجار'} • {land.location}
                      </p>
                      <p className="text-brand-primary font-bold text-sm">
                        {formatPrice(land.price, land.currency)}
                      </p>
                      <p className="text-white/60 text-xs mt-1">
                        {formatDate(land.created_at)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Listings */}
            {userListings.equipment.length === 0 && userListings.land.length === 0 && (
              <div className="text-center py-8">
                <svg className="w-16 h-16 text-white/40 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="text-xl font-bold text-white mb-2">لا توجد إعلانات</h3>
                <p className="text-white/70 mb-4">لم تقم بإنشاء أي إعلانات بعد</p>
                <button
                  onClick={() => router.push('/equipment/new')}
                  className="bg-gradient-to-r from-brand-primary to-brand-accent text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 font-medium"
                >
                  إنشاء إعلان جديد
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
