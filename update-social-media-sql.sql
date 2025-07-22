-- إضافة حقل TikTok إلى جدول إعدادات الموقع
ALTER TABLE website_settings 
ADD COLUMN IF NOT EXISTS social_tiktok TEXT DEFAULT 'https://www.tiktok.com/@elghella10';

-- تحديث الروابط الحقيقية لوسائل التواصل الاجتماعي
UPDATE website_settings 
SET 
  social_facebook = 'https://www.facebook.com/profile.php?id=61578467404013',
  social_instagram = 'https://www.instagram.com/el_ghella_/',
  social_tiktok = 'https://www.tiktok.com/@elghella10'
WHERE id IS NOT NULL;

-- إذا لم تكن هناك سجلات، قم بإنشاء سجل افتراضي
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
  social_tiktok,
  announcement_text,
  announcement_enabled,
  maintenance_mode,
  maintenance_message,
  about_content,
  services_content,
  contact_content,
  marketplace_title,
  marketplace_description,
  marketplace_welcome,
  seo_keywords,
  seo_description,
  author_name,
  primary_color,
  secondary_color,
  logo_url,
  background_image,
  created_at,
  updated_at
) 
SELECT 
  'منصة الغلة',
  'منصة التكنولوجيا الزراعية',
  'منصة الغلة',
  'ربط المزارعين والمشترين في الجزائر',
  'info@elghella.com',
  '+213 123 456 789',
  'الجزائر العاصمة، الجزائر',
  'https://www.facebook.com/profile.php?id=61578467404013',
  'https://twitter.com/elghella',
  'https://www.instagram.com/el_ghella_/',
  'https://linkedin.com/company/elghella',
  'https://youtube.com/elghella',
  'https://www.tiktok.com/@elghella10',
  '🌟 منصة الغلة - ربط المزارعين والمشترين في الجزائر',
  true,
  false,
  'الموقع قيد الصيانة، نعتذر عن الإزعاج',
  'منصة الغلة هي منصة رائدة في مجال التكنولوجيا الزراعية، تهدف إلى ربط المزارعين والمشترين في الجزائر. نقدم خدمات متكاملة تشمل التسويق، التشغيل، والدعم الفني.',
  'نقدم مجموعة شاملة من الخدمات الزراعية تشمل: تسويق المنتجات، إدارة المزارع، استشارات فنية، خدمات النقل والتخزين، وخدمات الدعم والتدريب.',
  'نحن هنا لمساعدتك! يمكنك التواصل معنا عبر البريد الإلكتروني أو الهاتف للحصول على الدعم والمعلومات التي تحتاجها.',
  'سوق الغلة',
  'سوق إلكتروني متخصص في المنتجات الزراعية والخدمات المرتبطة بها',
  'مرحباً بك في سوق الغلة! اكتشف أفضل المنتجات الزراعية وخدمات المزرعة.',
  'زراعة، مزرعة، منتجات زراعية، خدمات زراعية، الجزائر، منصة الغلة',
  'منصة الغلة - ربط المزارعين والمشترين في الجزائر. خدمات زراعية متكاملة وتسويق المنتجات الزراعية.',
  'منصة الغلة',
  '#059669',
  '#0d9488',
  '',
  '',
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM website_settings LIMIT 1);

-- التحقق من التحديث
SELECT 
  site_title,
  social_facebook,
  social_instagram,
  social_tiktok,
  updated_at
FROM website_settings 
ORDER BY created_at DESC 
LIMIT 1; 