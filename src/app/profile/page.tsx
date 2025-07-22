'use client';

import React, { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { firestore } from '@/lib/firebaseConfig';
import { Equipment, LandListing } from '@/types/database.types';

const ProfilePage: React.FC = () => {
  const { user, profile, updateProfile, loading: authLoading } = useSupabaseAuth();
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
    website: ''
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        phone: profile.phone || '',
        location: profile.location || '',
        website: profile.website || ''
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
      const equipmentQuery = query(
        collection(firestore, 'equipment'),
        where('user_id', '==', user.id),
        orderBy('created_at', 'desc')
      );
      const equipmentSnapshot = await getDocs(equipmentQuery);
      const equipmentData = equipmentSnapshot.docs.map(doc => {
        const docData = doc.data();
        return {
          id: doc.id,
          created_at: docData.created_at || new Date().toISOString(),
          updated_at: docData.updated_at || new Date().toISOString(),
          user_id: docData.user_id || '',
          title: docData.title || '',
          description: docData.description || null,
          price: docData.price || 0,
          currency: docData.currency || 'DZD',
          category_id: docData.category_id || '',
          condition: docData.condition || 'new',
          images: docData.images || [],
          location: docData.location || null,
          is_available: docData.is_available || true,
          view_count: docData.view_count || 0,
          year: docData.year || null,
          brand: docData.brand || '',
          model: docData.model || '',
          hours_used: docData.hours_used || 0,
          coordinates: docData.coordinates || null,
          is_featured: docData.is_featured || false,
        };
      });

      // Fetch land listings
      const landQuery = query(
        collection(firestore, 'land_listings'),
        where('user_id', '==', user.id),
        orderBy('created_at', 'desc')
      );
      const landSnapshot = await getDocs(landQuery);
      const landData = landSnapshot.docs.map(doc => {
        const docData = doc.data();
        return {
          id: doc.id,
          created_at: docData.created_at || new Date().toISOString(),
          updated_at: docData.updated_at || new Date().toISOString(),
          user_id: docData.user_id || '',
          title: docData.title || '',
          description: docData.description || null,
          price: docData.price || 0,
          currency: docData.currency || 'DZD',
          listing_type: docData.listing_type || 'sale',
          area_size: docData.area_size || 0,
          images: docData.images || [],
          location: docData.location || null,
          is_available: docData.is_available || true,
          coordinates: docData.coordinates || null,
          area_unit: docData.area_unit || 'm²',
          soil_type: docData.soil_type || null,
          water_source: docData.water_source || null,
          is_featured: docData.is_featured || false,
          view_count: docData.view_count || 0,
        };
      });

      setUserListings({
        equipment: equipmentData || [],
        land: landData || []
      });
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
    setFormError('');
    try {
      const { error } = await updateProfile(formData);
      if (error) {
        setFormError('حدث خطأ في تحديث الملف الشخصي: ' + error.message);
      } else {
        alert('تم تحديث الملف الشخصي بنجاح');
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setFormError('حدث خطأ في تحديث الملف الشخصي');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteListing = async (type: 'equipment' | 'land', id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الإعلان؟')) return;

    try {
      const tableName = type === 'equipment' ? 'equipment' : 'land_listings';
      await import('firebase/firestore').then(async ({ doc, deleteDoc }) => {
        await deleteDoc(doc(firestore, tableName, id));
        alert('تم حذف الإعلان بنجاح');
        fetchUserListings();
      });
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
      <div className="min-h-screen gradient-bg-primary pt-20 flex items-center justify-center">
        <div role="status" aria-live="polite" className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-12 w-12 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="4" stroke="currentColor" strokeOpacity="0.2" /><path d="M12 2a10 10 0 0 1 10 10" strokeWidth="4" stroke="currentColor" /></svg>
          <span className="text-white/80 text-lg">جاري تحميل البيانات...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  return (
    <main className="min-h-screen gradient-bg-primary pt-20" aria-label="صفحة الملف الشخصي">
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="text-center mb-8" aria-label="معلومات الملف الشخصي">
            <h1 className="text-4xl font-bold text-white mb-4">الملف الشخصي</h1>
            <p className="text-xl text-green-200">إدارة معلوماتك الشخصية وإعلاناتك</p>
          </header>

          {/* Profile Information */}
          <section className="card-responsive glass mb-8" aria-label="المعلومات الشخصية">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">المعلومات الشخصية</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-gradient-to-r from-brand-primary to-brand-accent text-white rounded-lg hover:shadow-lg transition-all duration-300"
                aria-label={isEditing ? 'إلغاء التعديل' : 'تعديل المعلومات الشخصية'}
              >
                {isEditing ? 'إلغاء' : 'تعديل'}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6" aria-label="نموذج تعديل الملف الشخصي">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* ...existing code... */}
                </div>
                <div>
                  {/* ...existing code... */}
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300"
                    aria-label="إلغاء التعديل"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-brand-primary to-brand-accent text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                    aria-busy={loading}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2"><svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="4" stroke="currentColor" strokeOpacity="0.2" /><path d="M12 2a10 10 0 0 1 10 10" strokeWidth="4" stroke="currentColor" /></svg> جاري الحفظ...</span>
                    ) : 'حفظ التغييرات'}
                  </button>
                </div>
                {/* Error message for profile update */}
                {formError && (
                  <div className="mt-4 p-3 rounded bg-red-500/20 border border-red-500/30 text-red-200 text-sm" role="alert">
                    {formError}
                  </div>
                )}
              </form>
            ) : (
              <div className="space-y-4">
                {/* ...existing code... */}
              </div>
            )}
          </section>

          {/* User Listings */}
          <section className="card-responsive glass" aria-label="إعلانات المستخدم">
            <h2 className="text-2xl font-bold text-white mb-6">إعلاناتي</h2>

            {/* Equipment Listings */}
            {userListings.equipment.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4">المعدات الزراعية</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* ...existing code... */}
                </div>
              </div>
            )}

            {/* Land Listings */}
            {userListings.land.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4">الأراضي الزراعية</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* ...existing code... */}
                </div>
              </div>
            )}

            {/* No Listings */}
            {userListings.equipment.length === 0 && userListings.land.length === 0 && (
              <div className="text-center py-8" aria-label="لا توجد إعلانات">
                <svg className="w-16 h-16 text-white/40 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="text-xl font-bold text-white mb-2">لا توجد إعلانات</h3>
                <p className="text-white/70 mb-4">لم تقم بإنشاء أي إعلانات بعد</p>
                <button
                  onClick={() => router.push('/equipment/new')}
                  className="bg-gradient-to-r from-brand-primary to-brand-accent text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 font-medium"
                  aria-label="إنشاء إعلان جديد"
                >
                  إنشاء إعلان جديد
                </button>
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
};

export default ProfilePage;
