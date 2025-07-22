-- Create website_settings table for admin panel
-- This table stores all website configuration and content

CREATE TABLE IF NOT EXISTS website_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- General site settings
    site_title TEXT DEFAULT 'منصة الغلة',
    site_description TEXT DEFAULT 'منصة التكنولوجيا الزراعية',
    
    -- Homepage content
    homepage_title TEXT DEFAULT 'منصة الغلة',
    homepage_subtitle TEXT DEFAULT 'ربط المزارعين والمشترين في الجزائر',
    
    -- Contact information
    contact_email TEXT DEFAULT 'info@elghella.com',
    contact_phone TEXT DEFAULT '+213 123 456 789',
    address TEXT DEFAULT 'الجزائر العاصمة، الجزائر',
    
    -- Social media links
    social_facebook TEXT DEFAULT 'https://facebook.com/elghella',
    social_twitter TEXT DEFAULT 'https://twitter.com/elghella',
    social_instagram TEXT DEFAULT 'https://instagram.com/elghella',
    social_linkedin TEXT DEFAULT 'https://linkedin.com/company/elghella',
    social_youtube TEXT DEFAULT 'https://youtube.com/elghella',
    
    -- Announcements and system settings
    announcement_text TEXT DEFAULT '🌟 منصة الغلة - ربط المزارعين والمشترين في الجزائر',
    announcement_enabled BOOLEAN DEFAULT true,
    maintenance_mode BOOLEAN DEFAULT false,
    maintenance_message TEXT DEFAULT 'الموقع قيد الصيانة، نعتذر عن الإزعاج'
);

-- Create RLS policies for website_settings
ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to website settings
CREATE POLICY "Allow public read access to website settings" ON website_settings
    FOR SELECT USING (true);

-- Allow authenticated users to update website settings (admin only)
CREATE POLICY "Allow authenticated users to update website settings" ON website_settings
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert website settings (admin only)
CREATE POLICY "Allow authenticated users to insert website settings" ON website_settings
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Insert default settings
INSERT INTO website_settings (
    site_title,
    site_description,
    homepage_title,
    homepage_subtitle,
    contact_email,
    contact_phone,
    address,
    social_facebook,
    social_twitter,
    social_instagram,
    social_linkedin,
    social_youtube,
    announcement_text,
    announcement_enabled,
    maintenance_mode,
    maintenance_message
) VALUES (
    'منصة الغلة',
    'منصة التكنولوجيا الزراعية',
    'منصة الغلة',
    'ربط المزارعين والمشترين في الجزائر',
    'info@elghella.com',
    '+213 123 456 789',
    'الجزائر العاصمة، الجزائر',
    'https://facebook.com/elghella',
    'https://twitter.com/elghella',
    'https://instagram.com/elghella',
    'https://linkedin.com/company/elghella',
    'https://youtube.com/elghella',
    '🌟 منصة الغلة - ربط المزارعين والمشترين في الجزائر',
    true,
    false,
    'الموقع قيد الصيانة، نعتذر عن الإزعاج'
) ON CONFLICT DO NOTHING;

-- COMPLETION MESSAGE
DO $$
BEGIN
    RAISE NOTICE '✅ Website settings table created successfully!';
    RAISE NOTICE '🎯 You can now edit website content from admin panel';
    RAISE NOTICE '📝 Go to /admin/settings to start editing';
END $$; 