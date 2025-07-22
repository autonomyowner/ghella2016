-- Complete Firebase Setup for Elghella Land Marketplace
-- This script creates all necessary tables and populates them with sample data
-- Copy and paste this entire script into your Firebase SQL Editor

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create land_listings table
CREATE TABLE IF NOT EXISTS public.land_listings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(15,2) NOT NULL,
    currency TEXT DEFAULT 'DZD',
    listing_type TEXT CHECK (listing_type IN ('sale', 'rent')) NOT NULL,
    area_size DECIMAL(10,2) NOT NULL,
    area_unit TEXT CHECK (area_unit IN ('hectare', 'acre', 'dunum')) DEFAULT 'hectare',
    location TEXT NOT NULL,
    coordinates JSONB,
    soil_type TEXT,
    water_source TEXT,
    images TEXT[] DEFAULT '{}',
    is_available BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false
);

-- Create land_reviews table
CREATE TABLE IF NOT EXISTS public.land_reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    land_id UUID NOT NULL REFERENCES public.land_listings(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT,
    UNIQUE(land_id, user_id)
);

-- Create land_favorites table
CREATE TABLE IF NOT EXISTS public.land_favorites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    land_id UUID NOT NULL REFERENCES public.land_listings(id) ON DELETE CASCADE,
    UNIQUE(user_id, land_id)
);

-- Create equipment table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.equipment (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(15,2) NOT NULL,
    currency TEXT DEFAULT 'DZD',
    category_id UUID,
    condition TEXT CHECK (condition IN ('new', 'excellent', 'good', 'fair', 'poor')) DEFAULT 'good',
    year INTEGER,
    brand TEXT,
    model TEXT,
    hours_used INTEGER,
    location TEXT NOT NULL,
    images TEXT[] DEFAULT '{}',
    is_available BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false
);

-- Create categories table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    parent_id UUID REFERENCES public.categories(id),
    sort_order INTEGER DEFAULT 0
);

-- Insert sample categories
INSERT INTO public.categories (name, name_ar, description, icon, sort_order) VALUES
('Tractors', 'جرارات', 'Agricultural tractors and machinery', '🚜', 1),
('Harvesters', 'حصادات', 'Harvesting equipment and combines', '🌾', 2),
('Plows', 'محاريث', 'Plowing and tillage equipment', '⚒️', 3),
('Irrigation', 'أنظمة الري', 'Irrigation systems and equipment', '💧', 4),
('Livestock', 'حيوانات المزرعة', 'Livestock and animal equipment', '🐄', 5),
('Tools', 'أدوات يدوية', 'Hand tools and small equipment', '🔧', 6)
ON CONFLICT DO NOTHING;

-- First, create users (required for profiles foreign key)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, confirmation_token, email_change, email_change_token_new, recovery_token) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'ahmed.benali@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"أحمد بن علي","phone":"+213 555 123 456"}', false, '', '', '', ''),
('550e8400-e29b-41d4-a716-446655440002', 'fatima.meziane@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"فاطمة مزين","phone":"+213 555 234 567"}', false, '', '', '', ''),
('550e8400-e29b-41d4-a716-446655440003', 'mohammed.ouled@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"محمد ولد","phone":"+213 555 345 678"}', false, '', '', '', ''),
('550e8400-e29b-41d4-a716-446655440004', 'aicha.toumi@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"عائشة تومي","phone":"+213 555 456 789"}', false, '', '', '', ''),
('550e8400-e29b-41d4-a716-446655440005', 'brahim.khelifi@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"براهيم خليفي","phone":"+213 555 567 890"}', false, '', '', '', ''),
('550e8400-e29b-41d4-a716-446655440006', 'nadia.bouazza@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"نادية بوعزة","phone":"+213 555 678 901"}', false, '', '', '', ''),
('550e8400-e29b-41d4-a716-446655440007', 'youssef.hamidi@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"يوسف حميدي","phone":"+213 555 789 012"}', false, '', '', '', ''),
('550e8400-e29b-41d4-a716-446655440008', 'samira.benchaabane@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"سميرة بن شعبان","phone":"+213 555 890 123"}', false, '', '', '', ''),
('550e8400-e29b-41d4-a716-446655440009', 'karim.mansouri@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"كريم منصوري","phone":"+213 555 901 234"}', false, '', '', '', ''),
('550e8400-e29b-41d4-a716-446655440010', 'leila.benmoussa@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"ليلى بن موسى","phone":"+213 555 012 345"}', false, '', '', '', '')
ON CONFLICT (id) DO NOTHING;

-- Now create profiles (after users exist) - using correct table structure
INSERT INTO public.profiles (id, full_name, avatar_url, phone, location, user_type, is_verified, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'أحمد بن علي', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', '+213 555 123 456', 'الجزائر العاصمة', 'farmer', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'فاطمة مزين', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', '+213 555 234 567', 'بسكرة', 'farmer', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'محمد ولد', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', '+213 555 345 678', 'الجزائر العاصمة', 'buyer', false, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'عائشة تومي', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', '+213 555 456 789', 'الجزائر العاصمة', 'farmer', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440005', 'براهيم خليفي', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', '+213 555 567 890', 'الجزائر العاصمة', 'farmer', false, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440006', 'نادية بوعزة', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face', '+213 555 678 901', 'مستغانم', 'farmer', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440007', 'يوسف حميدي', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', '+213 555 789 012', 'الجزائر العاصمة', 'buyer', false, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440008', 'سميرة بن شعبان', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', '+213 555 890 123', 'الجزائر العاصمة', 'farmer', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440009', 'كريم منصوري', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', '+213 555 901 234', 'تيبازة', 'farmer', false, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440010', 'ليلى بن موسى', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', '+213 555 012 345', 'الجزائر العاصمة', 'farmer', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Sample Land Listings with explicit UUIDs
INSERT INTO public.land_listings (
  id, user_id, title, description, price, currency, listing_type, 
  area_size, area_unit, location, soil_type, water_source, 
  images, is_available, is_featured
) VALUES
-- Large Farm for Sale in Tiaret
(
  '11111111-1111-1111-1111-111111111111',
  '550e8400-e29b-41d4-a716-446655440001',
  'مزرعة كبيرة للبيع في تيارت',
  'مزرعة ممتازة مساحتها 50 هكتار، تربة خصبة مناسبة لزراعة القمح والشعير. تتوفر على مصدر مياه جيد وطرق معبدة. مثالية للمستثمرين الجادين.',
  45000000,
  'DZD',
  'sale',
  50,
  'hectare',
  'تيارت',
  'تربة طينية خصبة',
  'بئر ارتوازي + قناة ري',
  ARRAY['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800', 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800'],
  true,
  true
),

-- Medium Farm for Rent in Setif
(
  '22222222-2222-2222-2222-222222222222',
  '550e8400-e29b-41d4-a716-446655440002',
  'مزرعة متوسطة للإيجار في سطيف',
  'مزرعة 25 هكتار متاحة للإيجار السنوي. مناسبة لزراعة الخضروات والفواكه. تتوفر على نظام ري حديث وبيوت بلاستيكية.',
  2500000,
  'DZD',
  'rent',
  25,
  'hectare',
  'سطيف',
  'تربة رملية طينية',
  'نظام ري بالتنقيط',
  ARRAY['https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=800', 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800'],
  true,
  true
),

-- Small Organic Farm for Sale in Constantine
(
  '33333333-3333-3333-3333-333333333333',
  '550e8400-e29b-41d4-a716-446655440003',
  'مزرعة عضوية صغيرة للبيع في قسنطينة',
  'مزرعة عضوية معتمدة مساحتها 10 هكتار. مثالية لزراعة الخضروات العضوية والفواكه. تتوفر على شهادة عضوية معتمدة.',
  18000000,
  'DZD',
  'sale',
  10,
  'hectare',
  'قسنطينة',
  'تربة عضوية غنية',
  'مياه طبيعية + نظام ري ذكي',
  ARRAY['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800'],
  true,
  false
),

-- Large Farm for Rent in Oran
(
  '44444444-4444-4444-4444-444444444444',
  '550e8400-e29b-41d4-a716-446655440004',
  'مزرعة كبيرة للإيجار في وهران',
  'مزرعة 80 هكتار متاحة للإيجار طويل المدى. مناسبة لزراعة الحبوب والبقوليات. تتوفر على معدات زراعية حديثة.',
  5000000,
  'DZD',
  'rent',
  80,
  'hectare',
  'وهران',
  'تربة طينية ثقيلة',
  'بئر ارتوازي + خزان مياه',
  ARRAY['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'],
  true,
  true
),

-- Vineyard for Sale in Mostaganem
(
  '55555555-5555-5555-5555-555555555555',
  '550e8400-e29b-41d4-a716-446655440005',
  'كرم عنب للبيع في مستغانم',
  'كرم عنب قديم مساحته 15 هكتار مع منزل ريفي. ينتج عنب عالي الجودة. يتوفر على معصرة تقليدية.',
  25000000,
  'DZD',
  'sale',
  15,
  'hectare',
  'مستغانم',
  'تربة كلسية مناسبة للعنب',
  'ري بالتنقيط + مياه جوفية',
  ARRAY['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'],
  true,
  false
),

-- Date Palm Farm for Sale in Algiers
(
  '66666666-6666-6666-6666-666666666666',
  '550e8400-e29b-41d4-a716-446655440006',
  'مزرعة نخيل للبيع في الجزائر العاصمة',
  'مزرعة نخيل مساحتها 30 هكتار مع 500 نخلة مثمرة. تنتج تمور عالية الجودة. تتوفر على مخزن ومرافق تجهيز.',
  35000000,
  'DZD',
  'sale',
  30,
  'hectare',
  'الجزائر العاصمة',
  'تربة رملية مناسبة للنخيل',
  'نظام ري بالتنقيط + بئر ارتوازي',
  ARRAY['https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=800'],
  true,
  true
),

-- Small Farm for Rent in Annaba
(
  '77777777-7777-7777-7777-777777777777',
  '550e8400-e29b-41d4-a716-446655440007',
  'مزرعة صغيرة للإيجار في عنابة',
  'مزرعة 8 هكتار متاحة للإيجار السنوي. مناسبة لزراعة الخضروات الصيفية. تتوفر على بيت بلاستيكي ومرافق أساسية.',
  1200000,
  'DZD',
  'rent',
  8,
  'hectare',
  'عنابة',
  'تربة خصبة مناسبة للخضروات',
  'ري بالرش + مياه عذبة',
  ARRAY['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800'],
  true,
  false
),

-- Olive Farm for Sale in Bejaia
(
  '88888888-8888-8888-8888-888888888888',
  '550e8400-e29b-41d4-a716-446655440008',
  'مزرعة زيتون للبيع في بجاية',
  'مزرعة زيتون مساحتها 20 هكتار مع 300 شجرة زيتون مثمرة. تنتج زيت زيتون بكر ممتاز. تتوفر على معصرة حديثة.',
  28000000,
  'DZD',
  'sale',
  20,
  'hectare',
  'بجاية',
  'تربة كلسية مناسبة للزيتون',
  'ري بالتنقيط + مياه جوفية',
  ARRAY['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'],
  true,
  true
),

-- Citrus Farm for Rent in Tipaza
(
  '99999999-9999-9999-9999-999999999999',
  '550e8400-e29b-41d4-a716-446655440009',
  'مزرعة حمضيات للإيجار في تيبازة',
  'مزرعة حمضيات مساحتها 12 هكتار متاحة للإيجار السنوي. تنتج برتقال وليمون طازج. تتوفر على مرافق التعبئة.',
  1800000,
  'DZD',
  'rent',
  12,
  'hectare',
  'تيبازة',
  'تربة رملية مناسبة للحمضيات',
  'ري بالتنقيط + مياه عذبة',
  ARRAY['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800'],
  true,
  false
),

-- Mixed Farm for Sale in Blida
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '550e8400-e29b-41d4-a716-446655440010',
  'مزرعة مختلطة للبيع في البليدة',
  'مزرعة مختلطة مساحتها 35 هكتار. تجمع بين زراعة الحبوب والخضروات والفواكه. تتوفر على منزل ريفي ومخازن.',
  40000000,
  'DZD',
  'sale',
  35,
  'hectare',
  'البليدة',
  'تربة متنوعة خصبة',
  'نظام ري متكامل + بئر ارتوازي',
  ARRAY['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800', 'https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=800'],
  true,
  true
);

-- Sample Reviews using the correct UUIDs
INSERT INTO public.land_reviews (land_id, user_id, rating, comment, created_at) VALUES
('11111111-1111-1111-1111-111111111111', '550e8400-e29b-41d4-a716-446655440003', 5, 'مزرعة ممتازة وموقع استراتيجي. التربة خصبة والمياه متوفرة.', NOW()),
('11111111-1111-1111-1111-111111111111', '550e8400-e29b-41d4-a716-446655440007', 4, 'مزرعة جيدة للاستثمار الزراعي. الطرق ممهدة والمرافق متوفرة.', NOW()),
('22222222-2222-2222-2222-222222222222', '550e8400-e29b-41d4-a716-446655440003', 5, 'مزرعة مثالية للإيجار. نظام الري حديث والبيوت البلاستيكية في حالة ممتازة.', NOW()),
('33333333-3333-3333-3333-333333333333', '550e8400-e29b-41d4-a716-446655440007', 5, 'مزرعة عضوية معتمدة. مثالية للمشاريع العضوية.', NOW()),
('44444444-4444-4444-4444-444444444444', '550e8400-e29b-41d4-a716-446655440003', 4, 'مزرعة كبيرة ومناسبة للمشاريع الكبيرة. المعدات متوفرة.', NOW()),
('55555555-5555-5555-5555-555555555555', '550e8400-e29b-41d4-a716-446655440007', 5, 'كرم عنب قديم وجميل. العنب عالي الجودة.', NOW()),
('66666666-6666-6666-6666-666666666666', '550e8400-e29b-41d4-a716-446655440003', 5, 'مزرعة نخيل ممتازة. التمور عالية الجودة.', NOW()),
('77777777-7777-7777-7777-777777777777', '550e8400-e29b-41d4-a716-446655440007', 4, 'مزرعة صغيرة ومناسبة للمبتدئين. المرافق الأساسية متوفرة.', NOW()),
('88888888-8888-8888-8888-888888888888', '550e8400-e29b-41d4-a716-446655440003', 5, 'مزرعة زيتون ممتازة. زيت الزيتون عالي الجودة.', NOW()),
('99999999-9999-9999-9999-999999999999', '550e8400-e29b-41d4-a716-446655440007', 4, 'مزرعة حمضيات جيدة. الفواكه طازجة وحلوة.', NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '550e8400-e29b-41d4-a716-446655440003', 5, 'مزرعة مختلطة ممتازة. مناسبة لمختلف أنواع الزراعة.', NOW());

-- Sample Favorites using the correct UUIDs
INSERT INTO public.land_favorites (user_id, land_id, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440003', '11111111-1111-1111-1111-111111111111', NOW()),
('550e8400-e29b-41d4-a716-446655440003', '33333333-3333-3333-3333-333333333333', NOW()),
('550e8400-e29b-41d4-a716-446655440003', '66666666-6666-6666-6666-666666666666', NOW()),
('550e8400-e29b-41d4-a716-446655440007', '22222222-2222-2222-2222-222222222222', NOW()),
('550e8400-e29b-41d4-a716-446655440007', '44444444-4444-4444-4444-444444444444', NOW()),
('550e8400-e29b-41d4-a716-446655440007', '88888888-8888-8888-8888-888888888888', NOW());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_land_listings_user_id ON public.land_listings(user_id);
CREATE INDEX IF NOT EXISTS idx_land_listings_location ON public.land_listings(location);
CREATE INDEX IF NOT EXISTS idx_land_listings_listing_type ON public.land_listings(listing_type);
CREATE INDEX IF NOT EXISTS idx_land_listings_is_available ON public.land_listings(is_available);
CREATE INDEX IF NOT EXISTS idx_land_listings_is_featured ON public.land_listings(is_featured);

CREATE INDEX IF NOT EXISTS idx_land_reviews_land_id ON public.land_reviews(land_id);
CREATE INDEX IF NOT EXISTS idx_land_reviews_user_id ON public.land_reviews(user_id);

CREATE INDEX IF NOT EXISTS idx_land_favorites_user_id ON public.land_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_land_favorites_land_id ON public.land_favorites(land_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.land_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.land_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.land_favorites ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Land listings are viewable by everyone" ON public.land_listings
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own land listings" ON public.land_listings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own land listings" ON public.land_listings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own land listings" ON public.land_listings
    FOR DELETE USING (auth.uid() = user_id);

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone" ON public.land_reviews
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own reviews" ON public.land_reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON public.land_reviews
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" ON public.land_reviews
    FOR DELETE USING (auth.uid() = user_id);

-- Favorites policies
CREATE POLICY "Favorites are viewable by owner" ON public.land_favorites
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites" ON public.land_favorites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" ON public.land_favorites
    FOR DELETE USING (auth.uid() = user_id);

-- Verification queries
SELECT 'Database setup completed successfully!' as status;

-- Show summary
SELECT 
  'Users' as table_name,
  COUNT(*) as count
FROM auth.users
UNION ALL
SELECT 
  'Profiles' as table_name,
  COUNT(*) as count
FROM public.profiles
UNION ALL
SELECT 
  'Categories' as table_name,
  COUNT(*) as count
FROM public.categories
UNION ALL
SELECT 
  'Land Listings' as table_name,
  COUNT(*) as count
FROM public.land_listings
UNION ALL
SELECT 
  'Reviews' as table_name,
  COUNT(*) as count
FROM public.land_reviews
UNION ALL
SELECT 
  'Favorites' as table_name,
  COUNT(*) as count
FROM public.land_favorites;

-- Show sample land listings
SELECT 
  title,
  price,
  currency,
  listing_type,
  area_size,
  area_unit,
  location,
  is_available
FROM public.land_listings
LIMIT 5; 
