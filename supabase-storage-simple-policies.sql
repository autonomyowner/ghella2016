-- Simple Storage Setup for Elghella Marketplace
-- This creates buckets and basic policies that work with Supabase restrictions

-- Create storage buckets (this is safe)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('equipment-images', 'equipment-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('land-images', 'land-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('animal-images', 'animal-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- COMPLETION MESSAGE
DO $$
BEGIN
    RAISE NOTICE '🎉 Storage buckets created successfully!';
    RAISE NOTICE '✅ Buckets: avatars, equipment-images, land-images, animal-images';
    RAISE NOTICE '📝 Next: Configure policies manually in Supabase Dashboard';
    RAISE NOTICE '🔗 Go to: Storage → Click each bucket → Policies tab';
END $$; 