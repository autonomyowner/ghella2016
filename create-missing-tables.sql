-- Create missing marketplace tables
-- Run this in your Supabase SQL editor

-- 1. Vegetables table
CREATE TABLE IF NOT EXISTS public.vegetables (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'دج',
    vegetable_type TEXT NOT NULL,
    variety TEXT,
    quantity INTEGER NOT NULL,
    unit TEXT DEFAULT 'kg',
    freshness TEXT DEFAULT 'excellent',
    organic BOOLEAN DEFAULT false,
    location TEXT NOT NULL,
    coordinates JSONB,
    images TEXT[] DEFAULT '{}',
    is_available BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    harvest_date DATE,
    expiry_date DATE,
    certification TEXT,
    packaging TEXT DEFAULT 'loose'
);

-- 2. Nurseries table
CREATE TABLE IF NOT EXISTS public.nurseries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'دج',
    nursery_type TEXT NOT NULL,
    variety TEXT,
    quantity INTEGER NOT NULL,
    unit TEXT DEFAULT 'piece',
    age_months INTEGER,
    height_cm INTEGER,
    location TEXT NOT NULL,
    coordinates JSONB,
    images TEXT[] DEFAULT '{}',
    is_available BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    planting_season TEXT,
    care_instructions TEXT,
    warranty_days INTEGER DEFAULT 30
);

-- 3. Animal listings table
CREATE TABLE IF NOT EXISTS public.animal_listings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'دج',
    animal_type TEXT NOT NULL,
    breed TEXT,
    age_months INTEGER,
    weight_kg DECIMAL(5,2),
    gender TEXT,
    location TEXT NOT NULL,
    coordinates JSONB,
    images TEXT[] DEFAULT '{}',
    is_available BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    health_status TEXT DEFAULT 'healthy',
    vaccination_status TEXT,
    pedigree BOOLEAN DEFAULT false,
    purpose TEXT -- meat, dairy, breeding, pets
);

-- 4. Labor table
CREATE TABLE IF NOT EXISTS public.labor (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    hourly_rate DECIMAL(10,2),
    daily_rate DECIMAL(10,2),
    monthly_rate DECIMAL(10,2),
    currency TEXT DEFAULT 'دج',
    labor_type TEXT NOT NULL,
    experience_years INTEGER,
    skills TEXT[],
    location TEXT NOT NULL,
    coordinates JSONB,
    images TEXT[] DEFAULT '{}',
    is_available BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    availability_schedule JSONB,
    certifications TEXT[],
    languages TEXT[]
);

-- 5. Analysis table
CREATE TABLE IF NOT EXISTS public.analysis (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'دج',
    analysis_type TEXT NOT NULL,
    sample_type TEXT,
    turnaround_days INTEGER,
    location TEXT NOT NULL,
    coordinates JSONB,
    images TEXT[] DEFAULT '{}',
    is_available BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    certifications TEXT[],
    equipment_available TEXT[],
    lab_accreditation TEXT
);

-- 6. Delivery table
CREATE TABLE IF NOT EXISTS public.delivery (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    base_price DECIMAL(10,2) NOT NULL,
    price_per_km DECIMAL(5,2),
    currency TEXT DEFAULT 'دج',
    delivery_type TEXT NOT NULL,
    vehicle_type TEXT,
    max_weight_kg INTEGER,
    max_distance_km INTEGER,
    location TEXT NOT NULL,
    coordinates JSONB,
    images TEXT[] DEFAULT '{}',
    is_available BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    availability_schedule JSONB,
    insurance_coverage BOOLEAN DEFAULT false,
    refrigerated BOOLEAN DEFAULT false
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.vegetables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nurseries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.animal_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.labor ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for vegetables
CREATE POLICY "Users can view all vegetables" ON public.vegetables FOR SELECT USING (true);
CREATE POLICY "Users can insert their own vegetables" ON public.vegetables FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own vegetables" ON public.vegetables FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own vegetables" ON public.vegetables FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for nurseries
CREATE POLICY "Users can view all nurseries" ON public.nurseries FOR SELECT USING (true);
CREATE POLICY "Users can insert their own nurseries" ON public.nurseries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own nurseries" ON public.nurseries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own nurseries" ON public.nurseries FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for animal_listings
CREATE POLICY "Users can view all animal_listings" ON public.animal_listings FOR SELECT USING (true);
CREATE POLICY "Users can insert their own animal_listings" ON public.animal_listings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own animal_listings" ON public.animal_listings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own animal_listings" ON public.animal_listings FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for labor
CREATE POLICY "Users can view all labor" ON public.labor FOR SELECT USING (true);
CREATE POLICY "Users can insert their own labor" ON public.labor FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own labor" ON public.labor FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own labor" ON public.labor FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for analysis
CREATE POLICY "Users can view all analysis" ON public.analysis FOR SELECT USING (true);
CREATE POLICY "Users can insert their own analysis" ON public.analysis FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own analysis" ON public.analysis FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own analysis" ON public.analysis FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for delivery
CREATE POLICY "Users can view all delivery" ON public.delivery FOR SELECT USING (true);
CREATE POLICY "Users can insert their own delivery" ON public.delivery FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own delivery" ON public.delivery FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own delivery" ON public.delivery FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vegetables_user_id ON public.vegetables(user_id);
CREATE INDEX IF NOT EXISTS idx_vegetables_is_available ON public.vegetables(is_available);
CREATE INDEX IF NOT EXISTS idx_vegetables_vegetable_type ON public.vegetables(vegetable_type);

CREATE INDEX IF NOT EXISTS idx_nurseries_user_id ON public.nurseries(user_id);
CREATE INDEX IF NOT EXISTS idx_nurseries_is_available ON public.nurseries(is_available);
CREATE INDEX IF NOT EXISTS idx_nurseries_nursery_type ON public.nurseries(nursery_type);

CREATE INDEX IF NOT EXISTS idx_animal_listings_user_id ON public.animal_listings(user_id);
CREATE INDEX IF NOT EXISTS idx_animal_listings_is_available ON public.animal_listings(is_available);
CREATE INDEX IF NOT EXISTS idx_animal_listings_animal_type ON public.animal_listings(animal_type);

CREATE INDEX IF NOT EXISTS idx_labor_user_id ON public.labor(user_id);
CREATE INDEX IF NOT EXISTS idx_labor_is_available ON public.labor(is_available);
CREATE INDEX IF NOT EXISTS idx_labor_labor_type ON public.labor(labor_type);

CREATE INDEX IF NOT EXISTS idx_analysis_user_id ON public.analysis(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_is_available ON public.analysis(is_available);
CREATE INDEX IF NOT EXISTS idx_analysis_analysis_type ON public.analysis(analysis_type);

CREATE INDEX IF NOT EXISTS idx_delivery_user_id ON public.delivery(user_id);
CREATE INDEX IF NOT EXISTS idx_delivery_is_available ON public.delivery(is_available);
CREATE INDEX IF NOT EXISTS idx_delivery_delivery_type ON public.delivery(delivery_type); 