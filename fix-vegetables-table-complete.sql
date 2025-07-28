-- Fix Vegetables Table with Complete Schema and Constraints
-- This script ensures the vegetables table has all required fields and correct constraints

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing vegetables table if it exists (to ensure clean setup)
DROP TABLE IF EXISTS public.vegetables CASCADE;

-- Create vegetables table with complete schema
CREATE TABLE IF NOT EXISTS public.vegetables (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'د.ج',
    vegetable_type TEXT CHECK (vegetable_type IN ('tomatoes', 'potatoes', 'onions', 'carrots', 'cucumbers', 'peppers', 'lettuce', 'cabbage', 'broccoli', 'cauliflower', 'spinach', 'kale', 'other')),
    variety TEXT,
    quantity INTEGER NOT NULL,
    unit TEXT CHECK (unit IN ('kg', 'ton', 'piece', 'bundle', 'box')),
    freshness TEXT CHECK (freshness IN ('excellent', 'good', 'fair', 'poor')),
    organic BOOLEAN DEFAULT false,
    location TEXT,
    coordinates JSONB,
    images TEXT[],
    is_available BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    harvest_date DATE,
    expiry_date DATE,
    certification TEXT,
    packaging TEXT CHECK (packaging IN ('loose', 'packaged', 'bulk'))
);

-- Create updated_at trigger for vegetables
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_vegetables_updated_at 
    BEFORE UPDATE ON vegetables 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.vegetables ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for vegetables
CREATE POLICY "Vegetables are viewable by everyone" ON public.vegetables FOR SELECT USING (true);
CREATE POLICY "Users can insert their own vegetables" ON public.vegetables FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own vegetables" ON public.vegetables FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own vegetables" ON public.vegetables FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vegetables_user_id ON public.vegetables(user_id);
CREATE INDEX IF NOT EXISTS idx_vegetables_is_available ON public.vegetables(is_available);
CREATE INDEX IF NOT EXISTS idx_vegetables_vegetable_type ON public.vegetables(vegetable_type);
CREATE INDEX IF NOT EXISTS idx_vegetables_location ON public.vegetables(location);
CREATE INDEX IF NOT EXISTS idx_vegetables_price ON public.vegetables(price);
CREATE INDEX IF NOT EXISTS idx_vegetables_freshness ON public.vegetables(freshness);
CREATE INDEX IF NOT EXISTS idx_vegetables_packaging ON public.vegetables(packaging);

-- Insert sample vegetables data with correct constraint values
INSERT INTO public.vegetables (
    user_id,
    title,
    description,
    vegetable_type,
    price,
    quantity,
    unit,
    freshness,
    organic,
    location,
    packaging,
    harvest_date
) VALUES 
(
    (SELECT id FROM auth.users LIMIT 1),
    'طماطم طازجة عضوية',
    'طماطم طازجة عضوية من مزرعتنا - Fresh organic tomatoes from our farm',
    'tomatoes',
    150.00,
    50,
    'kg',
    'excellent',
    true,
    'الجزائر العاصمة',
    'packaged',
    CURRENT_DATE
),
(
    (SELECT id FROM auth.users LIMIT 1),
    'بطاطس طازجة',
    'بطاطس طازجة جاهزة للطبخ - Fresh potatoes ready for cooking',
    'potatoes',
    80.00,
    100,
    'kg',
    'good',
    false,
    'تيارت',
    'loose',
    CURRENT_DATE
),
(
    (SELECT id FROM auth.users LIMIT 1),
    'جزر عضوي',
    'جزر عضوي حلو - Sweet organic carrots',
    'carrots',
    120.00,
    30,
    'kg',
    'excellent',
    true,
    'سطيف',
    'bulk',
    CURRENT_DATE
);

-- Verify the table was created successfully
SELECT 'Vegetables table created successfully with all constraints!' as status;
SELECT COUNT(*) as vegetable_count FROM vegetables;

-- Show table structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'vegetables' 
ORDER BY ordinal_position; 