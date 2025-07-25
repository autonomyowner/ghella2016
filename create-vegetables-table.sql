-- Create Vegetables Table for Elghella Marketplace
-- This script creates the missing vegetables table

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create vegetables table
CREATE TABLE IF NOT EXISTS public.vegetables (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    vegetable_type VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'DZD',
    unit VARCHAR(20) DEFAULT 'kg',
    quantity DECIMAL(10,2) NOT NULL,
    harvest_date DATE,
    expiry_date DATE,
    location VARCHAR(255) NOT NULL,
    coordinates JSONB,
    images TEXT[] DEFAULT '{}',
    is_available BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    contact_phone VARCHAR(50),
    contact_email VARCHAR(255)
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
CREATE POLICY "Users can view all vegetables" ON public.vegetables FOR SELECT USING (true);
CREATE POLICY "Users can insert their own vegetables" ON public.vegetables FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own vegetables" ON public.vegetables FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own vegetables" ON public.vegetables FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vegetables_user_id ON public.vegetables(user_id);
CREATE INDEX IF NOT EXISTS idx_vegetables_is_available ON public.vegetables(is_available);
CREATE INDEX IF NOT EXISTS idx_vegetables_vegetable_type ON public.vegetables(vegetable_type);
CREATE INDEX IF NOT EXISTS idx_vegetables_location ON public.vegetables(location);
CREATE INDEX IF NOT EXISTS idx_vegetables_price ON public.vegetables(price);

-- Insert sample vegetables data
INSERT INTO public.vegetables (
    user_id,
    title,
    description,
    vegetable_type,
    price,
    quantity,
    location,
    harvest_date
) VALUES 
(
    (SELECT id FROM profiles LIMIT 1),
    'طماطم طازجة عضوية',
    'طماطم طازجة عضوية من مزرعتنا - Fresh organic tomatoes from our farm',
    'tomatoes',
    150.00,
    50.0,
    'الجزائر العاصمة',
    CURRENT_DATE
),
(
    (SELECT id FROM profiles LIMIT 1),
    'بطاطس طازجة',
    'بطاطس طازجة جاهزة للطبخ - Fresh potatoes ready for cooking',
    'potatoes',
    80.00,
    100.0,
    'تيارت',
    CURRENT_DATE
),
(
    (SELECT id FROM profiles LIMIT 1),
    'جزر عضوي',
    'جزر عضوي حلو - Sweet organic carrots',
    'carrots',
    120.00,
    30.0,
    'سطيف',
    CURRENT_DATE
);

-- Verify the table was created
SELECT 'Vegetables table created successfully!' as status;
SELECT COUNT(*) as vegetable_count FROM vegetables; 