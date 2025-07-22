-- Complete Sample Data for Elghella Land Marketplace
-- Copy and paste this entire script into your Firebase SQL Editor

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

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
('550e8400-e29b-41d4-a716-446655440010', 'leila.benmoussa@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"ليلى بن موسى","phone":"+213 555 012 345"}', false, '', '', '', '');

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
('550e8400-e29b-41d4-a716-446655440010', 'ليلى بن موسى', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', '+213 555 012 345', 'الجزائر العاصمة', 'farmer', true, NOW(), NOW());

-- Sample Land Listings
INSERT INTO land_listings (
  user_id, title, description, price, currency, listing_type, 
  area_size, area_unit, location, soil_type, water_source, 
  images, is_available, is_featured
) VALUES
-- Large Farm for Sale in Tiaret
(
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

-- Sample Reviews
INSERT INTO land_reviews (land_id, user_id, rating, comment, created_at) VALUES
(1, '550e8400-e29b-41d4-a716-446655440003', 5, 'مزرعة ممتازة وموقع استراتيجي. التربة خصبة والمياه متوفرة.', NOW()),
(1, '550e8400-e29b-41d4-a716-446655440007', 4, 'مزرعة جيدة للاستثمار الزراعي. الطرق ممهدة والمرافق متوفرة.', NOW()),
(2, '550e8400-e29b-41d4-a716-446655440003', 5, 'مزرعة مثالية للإيجار. نظام الري حديث والبيوت البلاستيكية في حالة ممتازة.', NOW()),
(3, '550e8400-e29b-41d4-a716-446655440007', 5, 'مزرعة عضوية معتمدة. مثالية للمشاريع العضوية.', NOW()),
(4, '550e8400-e29b-41d4-a716-446655440003', 4, 'مزرعة كبيرة ومناسبة للمشاريع الكبيرة. المعدات متوفرة.', NOW()),
(5, '550e8400-e29b-41d4-a716-446655440007', 5, 'كرم عنب قديم وجميل. العنب عالي الجودة.', NOW()),
(6, '550e8400-e29b-41d4-a716-446655440003', 5, 'مزرعة نخيل ممتازة. التمور عالية الجودة.', NOW()),
(7, '550e8400-e29b-41d4-a716-446655440007', 4, 'مزرعة صغيرة ومناسبة للمبتدئين. المرافق الأساسية متوفرة.', NOW()),
(8, '550e8400-e29b-41d4-a716-446655440003', 5, 'مزرعة زيتون ممتازة. زيت الزيتون عالي الجودة.', NOW()),
(9, '550e8400-e29b-41d4-a716-446655440007', 4, 'مزرعة حمضيات جيدة. الفواكه طازجة وحلوة.', NOW()),
(10, '550e8400-e29b-41d4-a716-446655440003', 5, 'مزرعة مختلطة ممتازة. مناسبة لمختلف أنواع الزراعة.', NOW());

-- Sample Favorites
INSERT INTO land_favorites (user_id, land_id, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440003', 1, NOW()),
('550e8400-e29b-41d4-a716-446655440003', 3, NOW()),
('550e8400-e29b-41d4-a716-446655440003', 6, NOW()),
('550e8400-e29b-41d4-a716-446655440007', 2, NOW()),
('550e8400-e29b-41d4-a716-446655440007', 4, NOW()),
('550e8400-e29b-41d4-a716-446655440007', 8, NOW()),
('550e8400-e29b-41d4-a716-446655440011', 1, NOW()),
('550e8400-e29b-41d4-a716-446655440011', 5, NOW()),
('550e8400-e29b-41d4-a716-446655440011', 10, NOW()),
('550e8400-e29b-41d4-a716-446655440015', 2, NOW()),
('550e8400-e29b-41d4-a716-446655440015', 7, NOW()),
('550e8400-e29b-41d4-a716-446655440015', 9, NOW());

-- Verification queries
SELECT 'Data insertion completed successfully!' as status;

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
  'Land Listings' as table_name,
  COUNT(*) as count
FROM land_listings
UNION ALL
SELECT 
  'Reviews' as table_name,
  COUNT(*) as count
FROM land_reviews
UNION ALL
SELECT 
  'Favorites' as table_name,
  COUNT(*) as count
FROM land_favorites; 
