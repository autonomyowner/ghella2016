'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Equipment, LandListing, Category, Profile } from '@/types/database.types'

// Hook for fetching equipment listings
export function useEquipment(filters?: {
  category?: string
  location?: string
  priceRange?: [number, number]
  condition?: string
}) {
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEquipment = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('equipment')
        .select(`
          *,
          profiles:user_id (full_name, location, phone),
          categories:category_id (name, name_ar, icon)
        `)
        .eq('is_available', true)
        .order('created_at', { ascending: false })

      if (filters?.category) {
        query = query.eq('category_id', filters.category)
      }

      if (filters?.location) {
        query = query.ilike('location', `%${filters.location}%`)
      }

      if (filters?.condition) {
        query = query.eq('condition', filters.condition)
      }

      if (filters?.priceRange) {
        query = query
          .gte('price', filters.priceRange[0])
          .lte('price', filters.priceRange[1])
      }

      const { data, error } = await query

      if (error) {
        setError(error.message)
      } else {
        setEquipment(data || [])
      }
    } catch (err) {
      setError('حدث خطأ في تحميل البيانات')
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
      let query = supabase
        .from('land_listings')
        .select(`
          *,
          profiles:user_id (full_name, location, phone)
        `)
        .eq('is_available', true)
        .order('created_at', { ascending: false })

      if (filters?.type) {
        query = query.eq('listing_type', filters.type)
      }

      if (filters?.location) {
        query = query.ilike('location', `%${filters.location}%`)
      }

      if (filters?.priceRange) {
        query = query
          .gte('price', filters.priceRange[0])
          .lte('price', filters.priceRange[1])
      }

      if (filters?.areaRange) {
        query = query
          .gte('area_size', filters.areaRange[0])
          .lte('area_size', filters.areaRange[1])
      }

      const { data, error } = await query

      if (error) {
        setError(error.message)
      } else {
        setLandListings(data || [])
      }
    } catch (err) {
      setError('حدث خطأ في تحميل البيانات')
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
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('sort_order', { ascending: true })

        if (error) {
          setError(error.message)
        } else {
          setCategories(data || [])
        }
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
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()

        if (error) {
          setError(error.message)
        } else {
          setProfile(data)
        }
      } catch (err) {
        setError('حدث خطأ في تحميل الملف الشخصي')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [userId])

  return { profile, loading, error }
}

// Simple auth hook (deprecated - use AuthContext instead)
export function useSimpleAuth() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return { user, loading }
}
