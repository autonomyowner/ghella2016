-- Marketplace Database Schema for Supabase

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create marketplace_items table
CREATE TABLE IF NOT EXISTS marketplace_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('products', 'lands', 'machines', 'nurseries', 'animals', 'services')),
    subcategory TEXT,
    price DECIMAL(15,2) NOT NULL,
    unit TEXT NOT NULL,
    location TEXT NOT NULL,
    location_name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('sale', 'rent', 'exchange', 'partnership')),
    description TEXT NOT NULL,
    is_organic BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    has_delivery BOOLEAN DEFAULT false,
    rating DECIMAL(3,2) DEFAULT 0,
    reviews INTEGER DEFAULT 0,
    stock INTEGER NOT NULL,
    image TEXT DEFAULT '📦',
    tags TEXT[] DEFAULT '{}',
    seller_id UUID,
    seller_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    images TEXT[] DEFAULT '{}',
    specifications JSONB DEFAULT '{}',
    contact_info JSONB DEFAULT '{}'
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_marketplace_items_category ON marketplace_items(category);
CREATE INDEX IF NOT EXISTS idx_marketplace_items_location ON marketplace_items(location);
CREATE INDEX IF NOT EXISTS idx_marketplace_items_type ON marketplace_items(type);
CREATE INDEX IF NOT EXISTS idx_marketplace_items_seller_id ON marketplace_items(seller_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_items_is_active ON marketplace_items(is_active);
CREATE INDEX IF NOT EXISTS idx_marketplace_items_created_at ON marketplace_items(created_at DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_marketplace_items_updated_at 
    BEFORE UPDATE ON marketplace_items 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE marketplace_items ENABLE ROW LEVEL SECURITY;

-- Create policies for marketplace_items
-- Allow anyone to read active items
CREATE POLICY "Allow public read access to active items" ON marketplace_items
    FOR SELECT USING (is_active = true);

-- Allow authenticated users to insert their own items
CREATE POLICY "Allow authenticated users to insert items" ON marketplace_items
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Allow users to update their own items
CREATE POLICY "Allow users to update their own items" ON marketplace_items
    FOR UPDATE USING (auth.uid() = seller_id);

-- Allow users to delete their own items
CREATE POLICY "Allow users to delete their own items" ON marketplace_items
    FOR DELETE USING (auth.uid() = seller_id);

-- Insert sample data
INSERT INTO marketplace_items (
    name, category, subcategory, price, unit, location, location_name, type, description,
    is_organic, is_verified, has_delivery, rating, reviews, stock, image, tags, seller_name,
    specifications, contact_info
) VALUES 
-- Products
(
    'طماطم طازجة', 'products', 'vegetables', 150.00, 'كغ', 'algiers', 'الجزائر', 'sale',
    'طماطم طازجة من مزارع الجزائر العاصمة، جودة عالية',
    true, true, true, 4.8, 127, 500, '🍅', 
    ARRAY['طازج', 'عضوي', 'محلي', 'خضروات'],
    'مزرعة الجزائر الخضراء',
    '{}',
    '{"phone": "+213 555 123 456", "whatsapp": "+213 555 123 456"}'
),
(
    'قمح قاسي للتصدير', 'products', 'grains', 4500.00, 'قنطار', 'annaba', 'عنابة', 'sale',
    'قمح قاسي عالي الجودة للتصدير، شهادة جودة معتمدة',
    true, true, true, 4.9, 234, 100, '🌾',
    ARRAY['قمح', 'قاسي', 'تصدير', 'حبوب'],
    'مزرعة عنابة للتصدير',
    '{}',
    '{}'
),

-- Lands
(
    'أرض زراعية خصبة للبيع', 'lands', 'agricultural', 5000000.00, 'هكتار', 'setif', 'سطيف', 'sale',
    'أرض زراعية خصبة في سطيف، مساحة 5 هكتار، مياه جوفية متوفرة',
    false, true, false, 4.9, 45, 1, '🌾',
    ARRAY['أرض', 'زراعية', 'خصبة', 'سطيف'],
    'عائلة بن محمد',
    '{"area": "5 هكتار", "soilType": "طيني خصيب", "waterSource": "مياه جوفية", "roadAccess": true}',
    '{}'
),

-- Machines
(
    'جرار زراعي حديث', 'machines', 'tractors', 2500000.00, 'قطعة', 'oran', 'وهران', 'sale',
    'جرار زراعي حديث، موديل 2023، حالة ممتازة',
    false, true, true, 4.7, 89, 3, '🚜',
    ARRAY['جرار', 'حديث', 'جودة عالية', 'معدات'],
    'شركة المعدات الزراعية',
    '{"brand": "John Deere", "model": "2023", "horsepower": "75 HP", "condition": "ممتازة"}',
    '{}'
),
(
    'مضخة ري للبيع', 'machines', 'irrigation', 150000.00, 'قطعة', 'constantine', 'قسنطينة', 'sale',
    'مضخة ري حديثة، قدرة عالية، مناسبة للمزارع الكبيرة',
    false, true, true, 4.5, 67, 8, '💧',
    ARRAY['مضخة', 'ري', 'حديثة', 'معدات'],
    'مؤسسة الري الحديث',
    '{}',
    '{}'
),

-- Nurseries
(
    'شتلات زيتون عالية الجودة', 'nurseries', 'olive', 500.00, 'شتلة', 'constantine', 'قسنطينة', 'sale',
    'شتلات زيتون عالية الجودة، عمر 2 سنة، جاهزة للزراعة',
    true, true, true, 4.6, 156, 200, '🫒',
    ARRAY['زيتون', 'شتلات', 'عضوي', 'مشاتل'],
    'مشتل قسنطينة',
    '{"age": "2 سنة", "variety": "دقلة نور", "height": "1.5 متر"}',
    '{}'
),
(
    'شتلات تفاح', 'nurseries', 'fruit', 300.00, 'شتلة', 'batna', 'باتنة', 'sale',
    'شتلات تفاح محسنة، مقاومة للأمراض، إنتاجية عالية',
    true, true, true, 4.4, 89, 150, '🍎',
    ARRAY['تفاح', 'شتلات', 'محسنة', 'مشاتل'],
    'مشتل باتنة للفواكه',
    '{}',
    '{}'
),

-- Animals
(
    'أبقار حلوب منتجة', 'animals', 'cattle', 80000.00, 'رأس', 'tiaret', 'تيارت', 'sale',
    'أبقار حلوب منتجة، سلالة محسنة، إنتاجية عالية من الحليب',
    false, true, true, 4.5, 67, 15, '🐄',
    ARRAY['أبقار', 'حلوب', 'منتجة', 'حيوانات'],
    'مزرعة تيارت للألبان',
    '{"breed": "هولشتاين", "age": "3-5 سنوات", "milkProduction": "25 لتر/يوم", "healthStatus": "مطعم ومفحوص"}',
    '{}'
),
(
    'أغنام للبيع', 'animals', 'sheep', 25000.00, 'رأس', 'setif', 'سطيف', 'sale',
    'أغنام سلالة محسنة، مناسبة للتربية والتكاثر',
    false, true, true, 4.3, 45, 25, '🐑',
    ARRAY['أغنام', 'تربية', 'تكاثر', 'حيوانات'],
    'مزرعة سطيف للأغنام',
    '{}',
    '{}'
),

-- Services
(
    'خدمة حراثة الأراضي', 'services', 'plowing', 5000.00, 'هكتار', 'algiers', 'الجزائر', 'rent',
    'خدمة حراثة الأراضي باستخدام أحدث المعدات، خدمة سريعة ومضمونة',
    false, true, true, 4.7, 123, 999, '🚜',
    ARRAY['حراثة', 'خدمة', 'أراضي', 'معدات'],
    'شركة الخدمات الزراعية',
    '{}',
    '{"phone": "+213 555 789 012", "whatsapp": "+213 555 789 012"}'
),
(
    'استشارة زراعية متخصصة', 'services', 'consultation', 2000.00, 'جلسة', 'oran', 'وهران', 'sale',
    'استشارة زراعية متخصصة من خبراء في المجال، نصائح عملية ومفيدة',
    false, true, false, 4.8, 89, 999, '👨‍🌾',
    ARRAY['استشارة', 'زراعية', 'خبراء', 'نصائح'],
    'د. أحمد الزراعي',
    '{}',
    '{}'
);

-- Create a view for easier querying
CREATE OR REPLACE VIEW marketplace_items_view AS
SELECT 
    id,
    name,
    category,
    subcategory,
    price,
    unit,
    location,
    location_name,
    type,
    description,
    is_organic,
    is_verified,
    has_delivery,
    rating,
    reviews,
    stock,
    image,
    tags,
    seller_id,
    seller_name,
    created_at,
    updated_at,
    is_active,
    images,
    specifications,
    contact_info
FROM marketplace_items
WHERE is_active = true
ORDER BY created_at DESC; 