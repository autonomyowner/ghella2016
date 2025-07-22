-- Simple Supabase Database Schema for Elghella Agricultural Marketplace
-- Run this in your Supabase SQL Editor

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- PROFILES TABLE (User Profiles)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    full_name VARCHAR(255),
    phone VARCHAR(50),
    location VARCHAR(255),
    avatar_url TEXT,
    user_type VARCHAR(20) CHECK (user_type IN ('farmer', 'buyer', 'both')) DEFAULT 'farmer',
    is_verified BOOLEAN DEFAULT FALSE,
    bio TEXT,
    website VARCHAR(255),
    social_links JSONB DEFAULT '{}'
);

-- CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    name VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(255) DEFAULT 'tractor',
    parent_id UUID REFERENCES categories(id),
    sort_order INTEGER DEFAULT 0
);

-- EQUIPMENT TABLE
CREATE TABLE IF NOT EXISTS equipment (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'DZD',
    category_id UUID REFERENCES categories(id),
    condition VARCHAR(50) CHECK (condition IN ('new', 'excellent', 'good', 'fair', 'poor')) DEFAULT 'new',
    year INTEGER,
    brand VARCHAR(100),
    model VARCHAR(100),
    hours_used INTEGER,
    location VARCHAR(255),
    coordinates JSONB,
    images TEXT[] DEFAULT '{}',
    is_available BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0
);

-- LAND LISTINGS TABLE
CREATE TABLE IF NOT EXISTS land_listings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'DZD',
    listing_type VARCHAR(20) CHECK (listing_type IN ('sale', 'rent')) DEFAULT 'sale',
    area_size DECIMAL(10,2) NOT NULL,
    area_unit VARCHAR(20) CHECK (area_unit IN ('hectare', 'acre', 'dunum')) DEFAULT 'hectare',
    location VARCHAR(255),
    coordinates JSONB,
    soil_type VARCHAR(100),
    water_source VARCHAR(100),
    images TEXT[] DEFAULT '{}',
    is_available BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0
);

-- MESSAGES TABLE
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    item_id UUID,
    item_type VARCHAR(50)
);

-- FAVORITES TABLE
CREATE TABLE IF NOT EXISTS favorites (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    item_id UUID NOT NULL,
    item_type VARCHAR(50) NOT NULL CHECK (item_type IN ('equipment', 'land')),
    UNIQUE(user_id, item_id, item_type)
);

-- REVIEWS TABLE
CREATE TABLE IF NOT EXISTS reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    item_id UUID NOT NULL,
    item_type VARCHAR(50) NOT NULL CHECK (item_type IN ('equipment', 'land')),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles(location);
CREATE INDEX IF NOT EXISTS idx_profiles_is_verified ON profiles(is_verified);

CREATE INDEX IF NOT EXISTS idx_equipment_user_id ON equipment(user_id);
CREATE INDEX IF NOT EXISTS idx_equipment_category ON equipment(category_id);
CREATE INDEX IF NOT EXISTS idx_equipment_location ON equipment(location);
CREATE INDEX IF NOT EXISTS idx_equipment_price ON equipment(price);
CREATE INDEX IF NOT EXISTS idx_equipment_condition ON equipment(condition);
CREATE INDEX IF NOT EXISTS idx_equipment_is_available ON equipment(is_available);
CREATE INDEX IF NOT EXISTS idx_equipment_created_at ON equipment(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_land_user_id ON land_listings(user_id);
CREATE INDEX IF NOT EXISTS idx_land_location ON land_listings(location);
CREATE INDEX IF NOT EXISTS idx_land_price ON land_listings(price);
CREATE INDEX IF NOT EXISTS idx_land_area_size ON land_listings(area_size);
CREATE INDEX IF NOT EXISTS idx_land_is_available ON land_listings(is_available);
CREATE INDEX IF NOT EXISTS idx_land_created_at ON land_listings(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_item ON favorites(item_id, item_type);

CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_item ON reviews(item_id, item_type);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

-- TRIGGERS FOR UPDATED_AT
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_equipment_updated_at 
    BEFORE UPDATE ON equipment 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_land_listings_updated_at 
    BEFORE UPDATE ON land_listings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ROW LEVEL SECURITY (RLS) POLICIES

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE land_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Equipment policies
CREATE POLICY "Anyone can view available equipment" ON equipment
    FOR SELECT USING (is_available = true);

CREATE POLICY "Users can view own equipment" ON equipment
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own equipment" ON equipment
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own equipment" ON equipment
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own equipment" ON equipment
    FOR DELETE USING (auth.uid() = user_id);

-- Land listings policies
CREATE POLICY "Anyone can view available land" ON land_listings
    FOR SELECT USING (is_available = true);

CREATE POLICY "Users can view own land" ON land_listings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own land" ON land_listings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own land" ON land_listings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own land" ON land_listings
    FOR DELETE USING (auth.uid() = user_id);

-- Messages policies
CREATE POLICY "Users can view messages they sent or received" ON messages
    FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages" ON messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update messages they sent" ON messages
    FOR UPDATE USING (auth.uid() = sender_id);

-- Favorites policies
CREATE POLICY "Users can view own favorites" ON favorites
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add own favorites" ON favorites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own favorites" ON favorites
    FOR DELETE USING (auth.uid() = user_id);

-- Reviews policies
CREATE POLICY "Anyone can view reviews" ON reviews
    FOR SELECT USING (true);

CREATE POLICY "Users can add own reviews" ON reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews" ON reviews
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews" ON reviews
    FOR DELETE USING (auth.uid() = user_id);

-- SAMPLE DATA

-- Insert sample categories
INSERT INTO categories (name, name_ar, description, icon, sort_order) VALUES
('Tractors', 'جرارات', 'Agricultural tractors and machinery', 'tractor', 1),
('Irrigation', 'ري', 'Irrigation systems and equipment', 'droplets', 2),
('Harvesting', 'حصاد', 'Harvesting equipment and tools', 'scissors', 3),
('Seeding', 'بذر', 'Seeding and planting equipment', 'seedling', 4),
('Livestock', 'ماشية', 'Livestock equipment and supplies', 'cow', 5),
('Tools', 'أدوات', 'Hand tools and small equipment', 'wrench', 6)
ON CONFLICT DO NOTHING;

-- COMPLETION MESSAGE
DO $$
BEGIN
    RAISE NOTICE 'Elghella Marketplace simple database schema created successfully!';
    RAISE NOTICE 'Tables created: profiles, categories, equipment, land_listings, messages, favorites, reviews';
    RAISE NOTICE 'RLS policies enabled for security';
    RAISE NOTICE 'Sample categories inserted';
    RAISE NOTICE 'No automatic triggers - profiles will be created manually';
END $$; 