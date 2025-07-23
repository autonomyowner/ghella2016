'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/supabaseClient'
import { User, Session } from '@supabase/supabase-js'

export interface Profile {
  id: string
  created_at: string
  updated_at: string
  full_name: string | null
  phone: string | null
  location: string | null
  avatar_url: string | null
  user_type: 'farmer' | 'buyer' | 'both' | 'admin'
  is_verified: boolean
  bio: string | null
  website: string | null
  social_links: Record<string, any>
}

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, userData?: { full_name?: string; phone?: string; user_type?: string }) => Promise<{ error: any }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>
  uploadAvatar: (file: File) => Promise<{ error: any; url?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch user profile
  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('Profile not found, creating new profile...')
          // Create profile if it doesn't exist
          const newProfile = {
            id: userId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            full_name: null,
            phone: null,
            location: null,
            avatar_url: null,
            user_type: 'farmer' as const,
            is_verified: false,
            bio: null,
            website: null,
            social_links: {},
          }
          
          const { data: createdProfile, error: createError } = await supabase
            .from('profiles')
            .insert([newProfile])
            .select()
            .single()

          if (createError) {
            console.error('Error creating profile:', createError)
          } else {
            console.log('Profile created successfully:', createdProfile)
            setProfile(createdProfile)
          }
        } else {
          console.error('Error fetching profile:', error)
        }
        return
      }

      if (data) {
        console.log('Profile fetched successfully:', data)
        setProfile(data)
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error)
    }
  }

  // Initialize auth state
  useEffect(() => {
    // Get initial session with timeout
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          // Set a timeout for profile fetching to prevent long loading
          const profileTimeout = setTimeout(() => {
            setLoading(false)
          }, 3000) // 3 second timeout
          
          try {
            await fetchProfile(session.user.id)
          } catch (error) {
            console.error('Profile fetch error:', error)
          } finally {
            clearTimeout(profileTimeout)
            setLoading(false)
          }
        } else {
          setLoading(false)
        }
      } catch (error) {
        console.error('Session fetch error:', error)
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          try {
            await fetchProfile(session.user.id)
          } catch (error) {
            console.error('Profile fetch error:', error)
          }
        } else {
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Sign in
  const signIn = async (email: string, password: string) => {
    try {
      console.log('SupabaseAuthContext: Attempting sign in for email:', email)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      console.log('SupabaseAuthContext: Sign in response:', { data, error })
      
      if (error) {
        console.error('SupabaseAuthContext: Sign in error:', error)
        return { error }
      }
      
      if (data.user) {
        console.log('SupabaseAuthContext: User signed in successfully:', data.user.id)
        // Fetch profile after successful sign in
        await fetchProfile(data.user.id)
      }
      
      return { error: null }
    } catch (error) {
      console.error('SupabaseAuthContext: Unexpected error during sign in:', error)
      return { error }
    }
  }

  // Sign up
  const signUp = async (
    email: string,
    password: string,
    userData?: { full_name?: string; phone?: string; user_type?: string }
  ) => {
    try {
      console.log('Starting signup process...', { email, userData })
      
      // First, just create the user without additional data
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      console.log('Signup response:', { data, error })

      if (error) {
        console.error('Supabase auth error:', error)
        return { error }
      }

      // Wait a moment for the user to be fully created
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Manually create profile
      if (data.user) {
        console.log('Creating profile for user:', data.user.id)
        
        const newProfile = {
          id: data.user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          full_name: userData?.full_name || null,
          phone: userData?.phone || null,
          location: null,
          avatar_url: null,
          user_type: (userData?.user_type || 'farmer') as 'farmer' | 'buyer' | 'both',
          is_verified: false,
          bio: null,
          website: null,
          social_links: {},
        }
        
        console.log('Profile data to insert:', newProfile)
        
        // Try to create profile with upsert to handle conflicts
        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .upsert([newProfile], { 
            onConflict: 'id',
            ignoreDuplicates: false 
          })
          .select()
          .single()

        if (createError) {
          console.error('Error creating profile:', createError)
          // Check if it's a duplicate key error (profile already exists)
          if (createError.code === '23505') {
            console.log('Profile already exists, fetching existing profile...')
            const { data: existingProfile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single()
            
            if (existingProfile) {
              setProfile(existingProfile)
            }
          }
        } else {
          console.log('Profile created successfully:', createdProfile)
          setProfile(createdProfile)
        }
      }

      return { error: null }
    } catch (error) {
      console.error('Error in signUp:', error)
      return { error }
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setProfile(null)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Update profile
  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) {
      return { error: { message: 'No user logged in' } }
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single()

      if (error) {
        return { error }
      }

      setProfile(data)
      return { error: null }
    } catch (error) {
      console.error('Error updating profile:', error)
      return { error }
    }
  }

  // Upload avatar
  const uploadAvatar = async (file: File) => {
    if (!user) {
      return { error: { message: 'No user logged in' } }
    }

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`

      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file)

      if (error) {
        return { error }
      }

      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      // Update profile with new avatar URL
      await updateProfile({ avatar_url: urlData.publicUrl })

      return { error: null, url: urlData.publicUrl }
    } catch (error) {
      console.error('Error uploading avatar:', error)
      return { error }
    }
  }

  const value = {
    user,
    session,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    uploadAvatar
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useSupabaseAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider')
  }
  return context
}

export default AuthContext 