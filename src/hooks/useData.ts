'use client'

import { useState, useEffect } from 'react'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { firestore } from '@/lib/firebaseConfig';
import { Equipment, LandListing, Category, Profile } from '@/types/database.types'

// Hook for fetching equipment listings
export function useEquipment(filters?: {
  category?: string
  location?: string
  priceRange?: [number, number]
  condition?: 'new' | 'excellent' | 'good' | 'fair' | 'poor'
}) {
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEquipment = async () => {
    try {
      setLoading(true)
      const equipmentRef = collection(firestore, 'equipment');
      let q = query(equipmentRef, where('is_available', '==', true), orderBy('created_at', 'desc'));

      if (filters?.category) {
        q = query(q, where('category_id', '==', filters.category));
      }

      if (filters?.condition) {
        q = query(q, where('condition', '==', filters.condition));
      }

      const querySnapshot = await getDocs(q);
      let data = querySnapshot.docs.map(doc => {
        const docData = doc.data();
        return {
          id: doc.id,
          created_at: docData.created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
          updated_at: docData.updated_at?.toDate?.()?.toISOString() || new Date().toISOString(),
          user_id: docData.user_id || '',
          title: docData.title || '',
          description: docData.description || null,
          price: docData.price || 0,
          currency: docData.currency || 'USD',
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

      // Client-side filtering for location and price range
      if (filters?.location) {
        data = data.filter(item => 
          item.location?.toLowerCase().includes(filters.location!.toLowerCase())
        );
      }

      if (filters?.priceRange) {
        data = data.filter(item => 
          item.price >= filters.priceRange![0] && item.price <= filters.priceRange![1]
        );
      }

      setEquipment(data);
    } catch (err) {
      setError('حدث خطأ في تحميل البيانات')
      console.error('Error fetching equipment:', err);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEquipment()
  }, [filters])

  return { equipment, loading, error, refetch: fetchEquipment }
}

// Hook for fetching land listings
export function useLandListings(filters?: {
  type?: 'sale' | 'rent'
  location?: string
  priceRange?: [number, number]
  areaRange?: [number, number]
}) {
  const [landListings, setLandListings] = useState<LandListing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLandListings = async () => {
    try {
      setLoading(true)
      const landRef = collection(firestore, 'land_listings');
      let q = query(landRef, where('is_available', '==', true), orderBy('created_at', 'desc'));

      if (filters?.type) {
        q = query(q, where('listing_type', '==', filters.type));
      }

      const querySnapshot = await getDocs(q);
      let data = querySnapshot.docs.map(doc => {
        const docData = doc.data();
        return {
          id: doc.id,
          created_at: docData.created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
          updated_at: docData.updated_at?.toDate?.()?.toISOString() || new Date().toISOString(),
          user_id: docData.user_id || '',
          title: docData.title || '',
          description: docData.description || null,
          price: docData.price || 0,
          currency: docData.currency || 'USD',
          listing_type: docData.listing_type || 'sale',
          area_size: docData.area_size || 0,
          images: docData.images || [],
          location: docData.location || null,
          is_available: docData.is_available || true,
          coordinates: docData.coordinates || null,
          area_unit: docData.area_unit || 'sqft',
          soil_type: docData.soil_type || null,
          water_source: docData.water_source || null,
          is_featured: docData.is_featured || false,
          view_count: docData.view_count || 0,
        };
      });

      // Client-side filtering
      if (filters?.location) {
        data = data.filter(item => 
          item.location?.toLowerCase().includes(filters.location!.toLowerCase())
        );
      }

      if (filters?.priceRange) {
        data = data.filter(item => 
          item.price >= filters.priceRange![0] && item.price <= filters.priceRange![1]
        );
      }

      if (filters?.areaRange) {
        data = data.filter(item => 
          item.area_size >= filters.areaRange![0] && item.area_size <= filters.areaRange![1]
        );
      }

      setLandListings(data);
    } catch (err) {
      setError('حدث خطأ في تحميل البيانات')
      console.error('Error fetching land listings:', err);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLandListings()
  }, [filters])

  return { landListings, loading, error, refetch: fetchLandListings }
}

// Hook for fetching categories
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true)
        const categoriesRef = collection(firestore, 'categories');
        const q = query(categoriesRef, orderBy('sort_order', 'asc'));

        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => {
          const docData = doc.data();
          return {
            id: doc.id,
            created_at: docData.created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
            name: docData.name || '',
            name_ar: docData.name_ar || '',
            description: docData.description || null,
            icon: docData.icon || '',
            parent_id: docData.parent_id || null,
            sort_order: docData.sort_order || 0,
          };
        });

        setCategories(data);
      } catch (err) {
        setError('حدث خطأ في تحميل الفئات')
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return { categories, loading, error }
}

// Hook for user profile
export function useProfile(userId?: string) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProfile() {
      if (!userId) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const profileRef = collection(firestore, 'profiles');
        const q = query(profileRef, where('id', '==', userId));

        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => {
          const docData = doc.data();
          return {
            id: doc.id,
            created_at: docData.created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
            updated_at: docData.updated_at?.toDate?.()?.toISOString() || new Date().toISOString(),
            full_name: docData.full_name || '',
            phone: docData.phone || null,
            location: docData.location || null,
            avatar_url: docData.avatar_url || null,
            user_type: docData.user_type || 'farmer',
            is_verified: docData.is_verified || false,
            bio: docData.bio || null,
            website: docData.website || null,
            social_links: docData.social_links || {},
          };
        });

        setProfile(data[0] || null);
      } catch (err) {
        setError('حدث خطأ في تحميل الملف الشخصي')
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [userId])

  return { profile, loading, error }
}
