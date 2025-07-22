-- Update website_settings table with new content fields
-- Run this in Supabase SQL Editor

-- Add new columns for page content
ALTER TABLE website_settings 
ADD COLUMN IF NOT EXISTS about_content TEXT DEFAULT 'منصة الغلة هي منصة رائدة في مجال التكنولوجيا الزراعية، تهدف إلى ربط المزارعين والمشترين في الجزائر. نقدم خدمات متكاملة تشمل التسويق، التشغيل، والدعم الفني.';

ALTER TABLE website_settings 
ADD COLUMN IF NOT EXISTS services_content TEXT DEFAULT 'نقدم مجموعة شاملة من الخدمات الزراعية تشمل: تسويق المنتجات، إدارة المزارع، استشارات فنية، خدمات النقل والتخزين، وخدمات الدعم والتدريب.';

ALTER TABLE website_settings 
ADD COLUMN IF NOT EXISTS contact_content TEXT DEFAULT 'نحن هنا لمساعدتك! يمكنك التواصل معنا عبر البريد الإلكتروني أو الهاتف للحصول على الدعم والمعلومات التي تحتاجها.';

-- Add marketplace settings
ALTER TABLE website_settings 
ADD COLUMN IF NOT EXISTS marketplace_title TEXT DEFAULT 'سوق الغلة';

ALTER TABLE website_settings 
ADD COLUMN IF NOT EXISTS marketplace_description TEXT DEFAULT 'سوق إلكتروني متخصص في المنتجات الزراعية والخدمات المرتبطة بها';

ALTER TABLE website_settings 
ADD COLUMN IF NOT EXISTS marketplace_welcome TEXT DEFAULT 'مرحباً بك في سوق الغلة! اكتشف أفضل المنتجات الزراعية وخدمات المزرعة.';

-- Add SEO settings
ALTER TABLE website_settings 
ADD COLUMN IF NOT EXISTS seo_keywords TEXT DEFAULT 'زراعة، مزرعة، منتجات زراعية، خدمات زراعية، الجزائر، منصة الغلة';

ALTER TABLE website_settings 
ADD COLUMN IF NOT EXISTS seo_description TEXT DEFAULT 'منصة الغلة - ربط المزارعين والمشترين في الجزائر. خدمات زراعية متكاملة وتسويق المنتجات الزراعية.';

ALTER TABLE website_settings 
ADD COLUMN IF NOT EXISTS author_name TEXT DEFAULT 'منصة الغلة';

-- Add design settings
ALTER TABLE website_settings 
ADD COLUMN IF NOT EXISTS primary_color TEXT DEFAULT '#059669';

ALTER TABLE website_settings 
ADD COLUMN IF NOT EXISTS secondary_color TEXT DEFAULT '#0d9488';

ALTER TABLE website_settings 
ADD COLUMN IF NOT EXISTS logo_url TEXT DEFAULT '';

ALTER TABLE website_settings 
ADD COLUMN IF NOT EXISTS background_image TEXT DEFAULT '';

-- Update existing records with default values if they exist
UPDATE website_settings 
SET 
  about_content = COALESCE(about_content, 'منصة الغلة هي منصة رائدة في مجال التكنولوجيا الزراعية، تهدف إلى ربط المزارعين والمشترين في الجزائر. نقدم خدمات متكاملة تشمل التسويق، التشغيل، والدعم الفني.'),
  services_content = COALESCE(services_content, 'نقدم مجموعة شاملة من الخدمات الزراعية تشمل: تسويق المنتجات، إدارة المزارع، استشارات فنية، خدمات النقل والتخزين، وخدمات الدعم والتدريب.'),
  contact_content = COALESCE(contact_content, 'نحن هنا لمساعدتك! يمكنك التواصل معنا عبر البريد الإلكتروني أو الهاتف للحصول على الدعم والمعلومات التي تحتاجها.'),
  marketplace_title = COALESCE(marketplace_title, 'سوق الغلة'),
  marketplace_description = COALESCE(marketplace_description, 'سوق إلكتروني متخصص في المنتجات الزراعية والخدمات المرتبطة بها'),
  marketplace_welcome = COALESCE(marketplace_welcome, 'مرحباً بك في سوق الغلة! اكتشف أفضل المنتجات الزراعية وخدمات المزرعة.'),
  seo_keywords = COALESCE(seo_keywords, 'زراعة، مزرعة، منتجات زراعية، خدمات زراعية، الجزائر، منصة الغلة'),
  seo_description = COALESCE(seo_description, 'منصة الغلة - ربط المزارعين والمشترين في الجزائر. خدمات زراعية متكاملة وتسويق المنتجات الزراعية.'),
  author_name = COALESCE(author_name, 'منصة الغلة'),
  primary_color = COALESCE(primary_color, '#059669'),
  secondary_color = COALESCE(secondary_color, '#0d9488'),
  logo_url = COALESCE(logo_url, ''),
  background_image = COALESCE(background_image, '')
WHERE id IS NOT NULL;

-- Show success message
SELECT 'Website settings table updated successfully with new content fields!' as message; 