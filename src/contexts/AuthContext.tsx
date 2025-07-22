'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { firestore } from '@/lib/firebaseConfig'
import { Profile } from '@/types/database.types'

interface AuthContextType {
  user: any
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, userData?: { full_name?: string; phone?: string }) => Promise<{ error: any }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const auth = getAuth()

  // Fetch user profile
  const fetchProfile = async (userId: string) => {
    try {
      const profileRef = doc(firestore, 'profiles', userId)
      const profileSnap = await getDoc(profileRef)

      if (profileSnap.exists()) {
        setProfile(profileSnap.data() as Profile)
      } else {
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
        await setDoc(profileRef, newProfile)
        setProfile(newProfile)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  // Initialize auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        await fetchProfile(firebaseUser.uid)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Sign in
  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  // Sign up
  const signUp = async (
    email: string,
    password: string,
    userData?: { full_name?: string; phone?: string }
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const userId = userCredential.user.uid

      const profileData = {
        id: userId,
        full_name: userData?.full_name || null,
        phone: userData?.phone || null,
        user_type: 'farmer' as const,
        is_verified: false
      }

      const profileRef = doc(firestore, 'profiles', userId)
      await setDoc(profileRef, profileData)

      return { error: null }
    } catch (error) {
      console.error('Error creating profile:', error)
      return { error }
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
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
      const profileRef = doc(firestore, 'profiles', user.uid)
      await updateDoc(profileRef, {
        ...updates,
        updated_at: new Date().toISOString()
      })

      const updatedProfileSnap = await getDoc(profileRef)
      setProfile(updatedProfileSnap.data() as Profile)

      return { error: null }
    } catch (error) {
      console.error('Error updating profile:', error)
      return { error }
    }
  }

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
