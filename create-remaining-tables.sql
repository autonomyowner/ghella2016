-- Create remaining missing marketplace tables
-- Run this in your Supabase SQL editor

-- 1. Labor table
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

-- 2. Analysis table
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

-- 3. Delivery table
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
ALTER TABLE public.labor ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery ENABLE ROW LEVEL SECURITY;

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
CREATE INDEX IF NOT EXISTS idx_labor_user_id ON public.labor(user_id);
CREATE INDEX IF NOT EXISTS idx_labor_is_available ON public.labor(is_available);
CREATE INDEX IF NOT EXISTS idx_labor_labor_type ON public.labor(labor_type);

CREATE INDEX IF NOT EXISTS idx_analysis_user_id ON public.analysis(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_is_available ON public.analysis(is_available);
CREATE INDEX IF NOT EXISTS idx_analysis_analysis_type ON public.analysis(analysis_type);

CREATE INDEX IF NOT EXISTS idx_delivery_user_id ON public.delivery(user_id);
CREATE INDEX IF NOT EXISTS idx_delivery_is_available ON public.delivery(is_available);
CREATE INDEX IF NOT EXISTS idx_delivery_delivery_type ON public.delivery(delivery_type); 