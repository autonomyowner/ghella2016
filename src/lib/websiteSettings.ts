import { supabase } from './supabase/supabaseClient';

export interface WebsiteSettings {
  id: string;
  site_title: string;
  site_description: string;
  homepage_title: string;
  homepage_subtitle: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  social_facebook: string;
  social_twitter: string;
  social_instagram: string;
  social_linkedin: string;
  social_youtube: string;
  social_tiktok: string;
  announcement_text: string;
  announcement_enabled: boolean;
  maintenance_mode: boolean;
  maintenance_message: string;
  
  // Page Content
  about_content: string;
  services_content: string;
  contact_content: string;
  
  // Marketplace Settings
  marketplace_title: string;
  marketplace_description: string;
  marketplace_welcome: string;
  
  // SEO Settings
  seo_keywords: string;
  seo_description: string;
  author_name: string;
  
  // Design Settings
  primary_color: string;
  secondary_color: string;
  logo_url: string;
  background_image: string;
  
  created_at: string;
  updated_at: string;
}

// Default settings fallback
export const defaultSettings: WebsiteSettings = {
  id: '',
  site_title: 'منصة الغلة',
  site_description: 'منصة التكنولوجيا الزراعية',
  homepage_title: 'منصة الغلة',
  homepage_subtitle: 'كل ما تحتاجه الفلاحة في مكان واحد',
  contact_email: 'info@elghella.com',
  contact_phone: '+213 123 456 789',
  address: 'الجزائر العاصمة، الجزائر',
  social_facebook: 'https://www.facebook.com/profile.php?id=61578467404013',
  social_twitter: 'https://twitter.com/elghella',
  social_instagram: 'https://www.instagram.com/el_ghella_/',
  social_linkedin: 'https://linkedin.com/company/elghella',
  social_youtube: 'https://youtube.com/elghella',
  social_tiktok: 'https://www.tiktok.com/@elghella10',
  announcement_text: '🌟 منصة الغلة - كل ما تحتاجه الفلاحة في مكان واحد',
  announcement_enabled: true,
  maintenance_mode: false,
  maintenance_message: 'الموقع قيد الصيانة، نعتذر عن الإزعاج',
  
  // Page Content
  about_content: 'منصة الغلة هي منصة رائدة في مجال التكنولوجيا الزراعية، تهدف إلى توفير كل ما يحتاجه المزارع في مكان واحد. نقدم خدمات متكاملة تشمل التسويق، التشغيل، والدعم الفني.',
  services_content: 'نقدم مجموعة شاملة من الخدمات الزراعية تشمل: تسويق المنتجات، إدارة المزارع، استشارات فنية، خدمات النقل والتخزين، وخدمات الدعم والتدريب.',
  contact_content: 'نحن هنا لمساعدتك! يمكنك التواصل معنا عبر البريد الإلكتروني أو الهاتف للحصول على الدعم والمعلومات التي تحتاجها.',
  
  // Marketplace Settings
  marketplace_title: 'سوق الغلة',
  marketplace_description: 'سوق إلكتروني متخصص في المنتجات الزراعية والخدمات المرتبطة بها',
  marketplace_welcome: 'مرحباً بك في سوق الغلة! اكتشف أفضل المنتجات الزراعية وخدمات المزرعة.',
  
  // SEO Settings
  seo_keywords: 'زراعة، مزرعة، منتجات زراعية، خدمات زراعية، الجزائر، منصة الغلة',
  seo_description: 'منصة الغلة - كل ما تحتاجه الفلاحة في مكان واحد. خدمات زراعية متكاملة وتسويق المنتجات الزراعية.',
  author_name: 'منصة الغلة',
  
  // Design Settings
  primary_color: '#059669',
  secondary_color: '#0d9488',
  logo_url: '',
  background_image: '',
  
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

// Fetch website settings from database
export async function getWebsiteSettings(): Promise<WebsiteSettings> {
  try {
    const { data, error } = await supabase
      .from('website_settings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching website settings:', error);
      return defaultSettings;
    }

    return data || defaultSettings;
  } catch (error) {
    console.error('Error in getWebsiteSettings:', error);
    return defaultSettings;
  }
}

// Update website settings
export async function updateWebsiteSettings(settings: Partial<WebsiteSettings>): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('website_settings')
      .upsert([{
        ...settings,
        updated_at: new Date().toISOString()
      }], { onConflict: 'id' });

    if (error) {
      console.error('Error updating website settings:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in updateWebsiteSettings:', error);
    return { success: false, error: 'Unknown error occurred' };
  }
}

// Create a React hook for website settings
import { useState, useEffect } from 'react';

export function useWebsiteSettings() {
  const [settings, setSettings] = useState<WebsiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const data = await getWebsiteSettings();
        setSettings(data);
        setError(null);
      } catch (err) {
        setError('Failed to load website settings');
        console.error('Error loading website settings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();

    // Set up real-time subscription to website_settings table
    const subscription = supabase
      .channel('website_settings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'website_settings'
        },
        (payload) => {
          console.log('Website settings changed:', payload);
          // Refresh settings when database changes
          fetchSettings();
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const updateSettings = async (newSettings: Partial<WebsiteSettings>) => {
    try {
      const result = await updateWebsiteSettings(newSettings);
      if (result.success) {
        setSettings(prev => ({ ...prev, ...newSettings }));
        return { success: true };
      } else {
        setError(result.error || 'Failed to update settings');
        return { success: false, error: result.error };
      }
    } catch (err) {
      setError('Failed to update settings');
      return { success: false, error: 'Unknown error occurred' };
    }
  };

  return {
    settings,
    loading,
    error,
    updateSettings,
    refreshSettings: () => {
      setLoading(true);
      getWebsiteSettings().then(setSettings).finally(() => setLoading(false));
    }
  };
} 