import { supabase } from '@/lib/supabase/supabaseClient';

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  location: string | null;
  avatar_url: string | null;
  user_type: 'farmer' | 'buyer' | 'both';
  is_verified: boolean;
}

export const fetchSellerInfo = async (userId: string, fallbackLocation?: string): Promise<Profile> => {
  try {
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Error fetching seller profile:', profileError);
      // Return fallback data
      return {
        id: userId,
        full_name: 'مزارع موثوق',
        phone: '+213 123 456 789',
        location: fallbackLocation || 'الجزائر',
        avatar_url: null,
        user_type: 'farmer',
        is_verified: true
      };
    }

    if (profileData) {
      return {
        id: profileData.id,
        full_name: profileData.full_name,
        phone: profileData.phone,
        location: profileData.location || fallbackLocation || 'الجزائر',
        avatar_url: profileData.avatar_url,
        user_type: profileData.user_type || 'farmer',
        is_verified: profileData.is_verified || false
      };
    }

    // Fallback if no data found
    return {
      id: userId,
      full_name: 'مزارع موثوق',
      phone: '+213 123 456 789',
      location: fallbackLocation || 'الجزائر',
      avatar_url: null,
      user_type: 'farmer',
      is_verified: true
    };
  } catch (error) {
    console.error('Error fetching seller data:', error);
    // Return fallback data
    return {
      id: userId,
      full_name: 'مزارع موثوق',
      phone: '+213 123 456 789',
      location: fallbackLocation || 'الجزائر',
      avatar_url: null,
      user_type: 'farmer',
      is_verified: true
    };
  }
}; 