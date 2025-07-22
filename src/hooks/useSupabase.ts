'use client'

import { useState, useEffect } from 'react'
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext'
import { Equipment, LandListing, Category, Profile } from '@/types/database.types'
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc, orderBy } from 'firebase/firestore';
import { firestore } from '@/lib/firebaseConfig';

// Hook for user profile management
export function useProfile() {
  const { user, profile, updateProfile } = useSupabaseAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateUserProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: { message: 'No user logged in' } }
    
    setLoading(true)
    setError(null)
    
    try {
      const result = await updateProfile(updates)
      if (result.error) {
        setError(result.error.message)
      }
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      return { error: { message: errorMessage } }
    } finally {
      setLoading(false)
    }
  }

  return { 
    profile, 
    loading: loading || !user, 
    error, 
    updateUserProfile 
  }
}

// Hook for user equipment management
export function useUserEquipment() {
  const { user } = useSupabaseAuth();
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserEquipment = async () => {
    if (!user) {
      setEquipment([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const equipmentRef = collection(firestore, 'equipment');
      const q = query(equipmentRef, where('user_id', '==', user.id), orderBy('created_at', 'desc'));
      const querySnapshot = await getDocs(q);

      const data = querySnapshot.docs.map(doc => {
        const docData = doc.data();
        return {
          id: doc.id,
          created_at: docData.created_at || new Date().toISOString(),
          updated_at: docData.updated_at || new Date().toISOString(),
          user_id: docData.user_id || user.id,
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
      setEquipment(data);
    } catch (err) {
      setError('Error loading equipment');
    } finally {
      setLoading(false);
    }
  };

  const deleteEquipment = async (id: string) => {
    try {
      const equipmentDoc = doc(firestore, 'equipment', id);
      await deleteDoc(equipmentDoc);

      setEquipment(prev => prev.filter(item => item.id !== id));
      return true;
    } catch (err) {
      setError('Error deleting equipment');
      return false;
    }
  };

  const updateEquipment = async (id: string, updates: Partial<Equipment>) => {
    try {
      const equipmentDoc = doc(firestore, 'equipment', id);
      await updateDoc(equipmentDoc, updates);

      setEquipment(prev => prev.map(item => (item.id === id ? { ...item, ...updates } : item)));
      return true;
    } catch (err) {
      setError('Error updating equipment');
      return false;
    }
  };

  useEffect(() => {
    fetchUserEquipment();
  }, [user]);

  return {
    equipment,
    loading,
    error,
    deleteEquipment,
    updateEquipment,
    refetch: fetchUserEquipment,
  };
}

// Hook for categories
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

        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          created_at: doc.data().created_at || new Date().toISOString(),
        })) as Category[];

        setCategories(data);
      } catch (err) {
        setError('حدث خطأ في تحميل الفئات')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return { categories, loading, error }
}

// Hook for user statistics
export function useUserStats() {
  const { user } = useSupabaseAuth()
  const [stats, setStats] = useState({
    totalEquipment: 0,
    totalViews: 0,
    totalFavorites: 0,
    monthlyViews: 0,
    monthlyRevenue: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStats() {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        // Get equipment count and views
        const equipmentRef = collection(firestore, 'equipment');
        const q = query(equipmentRef, where('user_id', '==', user.id));
        const querySnapshot = await getDocs(q);

        const equipmentData = querySnapshot.docs.map(doc => doc.data());
        const totalViews = equipmentData.reduce((sum, item) => sum + (item.view_count || 0), 0);

        setStats({
          totalEquipment: equipmentData.length,
          totalViews,
          totalFavorites: 0, // TODO: Implement favorites system
          monthlyViews: 0, // TODO: Implement monthly tracking
          monthlyRevenue: 0 // TODO: Implement revenue tracking
        })
      } catch (err) {
        setError('حدث خطأ في تحميل الإحصائيات')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [user])

  return { stats, loading, error }
}

// Hook for user land listings
export function useUserLandListings() {
  const { user } = useSupabaseAuth()
  const [landListings, setLandListings] = useState<LandListing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUserLandListings = async () => {
    if (!user) {
      setLandListings([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const landRef = collection(firestore, 'land_listings');
      const q = query(landRef, where('user_id', '==', user.id), orderBy('created_at', 'desc'));
      const querySnapshot = await getDocs(q);

      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        created_at: doc.data().created_at || new Date().toISOString(),
        updated_at: doc.data().updated_at || new Date().toISOString(),
      })) as LandListing[];

      setLandListings(data);
    } catch (err) {
      setError('حدث خطأ في تحميل الأراضي')
    } finally {
      setLoading(false)
    }
  }

  const deleteLandListing = async (id: string) => {
    try {
      const landDoc = doc(firestore, 'land_listings', id);
      await deleteDoc(landDoc);

      setLandListings(prev => prev.filter(item => item.id !== id))
      return true
    } catch (err) {
      setError('حدث خطأ في حذف الأرض')
      return false
    }
  }

  useEffect(() => {
    fetchUserLandListings()
  }, [user])

  return { 
    landListings, 
    loading, 
    error, 
    deleteLandListing, 
    refetch: fetchUserLandListings 
  }
}