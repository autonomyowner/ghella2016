'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext'
import { Equipment, LandListing, Category, Profile } from '@/types/database.types'
import { supabase } from '@/lib/supabase/supabaseClient'

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
      const result = await updateProfile(updates as any)
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

// Hook for equipment management with Supabase
export function useEquipment() {
  const { user } = useSupabaseAuth();
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchParams, setLastFetchParams] = useState<string>('');

  const fetchEquipment = async (filters?: {
    category?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    condition?: string;
    search?: string;
  }) => {
    try {
      // Create a cache key for the current filters
      const cacheKey = JSON.stringify(filters || {});
      
      // Skip if we're already loading or if the filters haven't changed
      if (loading || cacheKey === lastFetchParams) {
        return equipment;
      }
      
      setLoading(true);
      setError(null);
      setLastFetchParams(cacheKey);

      let query = supabase
        .from('equipment')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50); // Limit to 50 items for better performance

      // Apply filters
      if (filters?.category && filters.category !== 'all') {
        query = query.eq('category_id', filters.category);
      }
      if (filters?.location && filters.location !== 'جميع الولايات') {
        query = query.eq('location', filters.location);
      }
      if (filters?.minPrice) {
        query = query.gte('price', filters.minPrice);
      }
      if (filters?.maxPrice) {
        query = query.lte('price', filters.maxPrice);
      }
      if (filters?.condition) {
        query = query.eq('condition', filters.condition);
      }

      const { data, error: supabaseError } = await query;

      if (supabaseError) {
        throw supabaseError;
      }

      let filteredData = data || [];

      // Apply search filter client-side for better performance
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filteredData = filteredData.filter(item => 
          (item.title && item.title.toLowerCase().includes(searchLower)) ||
          (item.brand && item.brand.toLowerCase().includes(searchLower)) ||
          (item.model && item.model.toLowerCase().includes(searchLower)) ||
          (item.description && item.description.toLowerCase().includes(searchLower))
        );
      }

      setEquipment(filteredData);
      return filteredData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error loading equipment';
      setError(errorMessage);
      console.error('Error fetching equipment:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const addEquipment = async (equipmentData: Partial<Equipment>) => {
    if (!user) {
      throw new Error('User must be logged in to add equipment');
    }

    try {
      const newEquipment = {
        ...equipmentData,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error: supabaseError } = await supabase
        .from('equipment')
        .insert([newEquipment])
        .select()
        .single();

      if (supabaseError) {
        throw supabaseError;
      }

      // Refresh the equipment list
      await fetchEquipment();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error adding equipment';
      setError(errorMessage);
      throw err;
    }
  };

  const updateEquipment = async (id: string, updates: Partial<Equipment>) => {
    try {
      const { data, error: supabaseError } = await supabase
        .from('equipment')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (supabaseError) {
        throw supabaseError;
      }

      // Refresh the equipment list
      await fetchEquipment();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error updating equipment';
      setError(errorMessage);
      throw err;
    }
  };

  const deleteEquipment = async (id: string) => {
    try {
      const { error: supabaseError } = await supabase
        .from('equipment')
        .delete()
        .eq('id', id);

      if (supabaseError) {
        throw supabaseError;
      }

      // Refresh the equipment list
      await fetchEquipment();
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error deleting equipment';
      setError(errorMessage);
      throw err;
    }
  };

  const fetchUserEquipment = async () => {
    if (!user) {
      setEquipment([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('equipment')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (supabaseError) {
        throw supabaseError;
      }

      setEquipment(data || []);
    } catch (err) {
      setError('Error loading user equipment');
      console.error('Error fetching user equipment:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchEquipment();
  }, []);

  return {
    equipment,
    loading,
    error,
    fetchEquipment: useCallback(fetchEquipment, []),
    addEquipment,
    updateEquipment,
    deleteEquipment,
    fetchUserEquipment,
  };
}

// Hook for user equipment management (for user's own equipment)
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

      const { data, error: supabaseError } = await supabase
        .from('equipment')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (supabaseError) {
        throw supabaseError;
      }

      setEquipment(data || []);
    } catch (err) {
      setError('Error loading equipment');
      console.error('Error fetching user equipment:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteEquipment = async (id: string) => {
    try {
      const { error: supabaseError } = await supabase
        .from('equipment')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (supabaseError) {
        throw supabaseError;
      }

      await fetchUserEquipment();
      return { success: true };
    } catch (err) {
      setError('Error deleting equipment');
      throw err;
    }
  };

  const updateEquipment = async (id: string, updates: Partial<Equipment>) => {
    try {
      const { data, error: supabaseError } = await supabase
        .from('equipment')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user?.id)
        .select()
        .single();

      if (supabaseError) {
        throw supabaseError;
      }

      await fetchUserEquipment();
      return data;
    } catch (err) {
      setError('Error updating equipment');
      throw err;
    }
  };

  useEffect(() => {
    fetchUserEquipment();
  }, [user]);

  return {
    equipment,
    loading,
    error,
    fetchUserEquipment,
    deleteEquipment,
    updateEquipment,
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
        const categoriesRef = supabase.from('categories');
        const q = supabase.from('categories').select('*').order('sort_order', { ascending: true });
        const querySnapshot = await q.select();

        const data = querySnapshot.data as Category[];

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
        const equipmentRef = supabase.from('equipment');
        const q = supabase.from('equipment').select('*').eq('user_id', user.id);
        const querySnapshot = await q.select();

                 const equipmentData = querySnapshot.data || [];
         const totalViews = equipmentData.reduce((sum: any, item: any) => sum + (item.view_count || 0), 0);

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

      const landRef = supabase.from('land_listings');
      const q = supabase.from('land_listings').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      const querySnapshot = await q.select();

      const data = querySnapshot.data as LandListing[];

      setLandListings(data);
    } catch (err) {
      setError('حدث خطأ في تحميل الأراضي')
    } finally {
      setLoading(false)
    }
  }

  const deleteLandListing = async (id: string) => {
    try {
      const landDoc = supabase.from('land_listings').delete().eq('id', id);
      const { error: supabaseError } = await landDoc;

      if (supabaseError) {
        throw supabaseError;
      }

      setLandListings(prev => prev.filter(item => item.id !== id))
      return { success: true }
    } catch (err) {
      setError('حدث خطأ في حذف الأرض')
      return { success: false }
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