-- Complete Supabase Database Schema for Elghella Agricultural Marketplace
-- Run this in your Supabase SQL Editor

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ========================================
-- PROFILES TABLE (User Profiles)
-- ========================================
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

-- ========================================
-- CATEGORIES TABLE
-- ========================================
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

-- ========================================
-- EQUIPMENT TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS equipment (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'DZD',
    condition VARCHAR(50) CHECK (condition IN ('new', 'like_new', 'good', 'fair', 'poor')),
    brand VARCHAR(100),
    model VARCHAR(100),
    year INTEGER,
    category_id UUID REFERENCES categories(id),
    seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    location VARCHAR(255),
    is_available BOOLEAN DEFAULT TRUE,
    images TEXT[] DEFAULT '{}',
    specifications JSONB DEFAULT '{}',
    contact_info JSONB DEFAULT '{}'
);

-- ========================================
-- LAND LISTINGS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS land_listings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    area DECIMAL(10,2) NOT NULL,
    area_unit VARCHAR(20) DEFAULT 'hectare',
    price DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'DZD',
    price_type VARCHAR(20) CHECK (price_type IN ('sale', 'rent', 'lease')) DEFAULT 'sale',
    soil_type VARCHAR(100),
    water_source VARCHAR(100),
    road_access BOOLEAN DEFAULT FALSE,
    electricity BOOLEAN DEFAULT FALSE,
    seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    location VARCHAR(255),
    coordinates POINT,
    is_available BOOLEAN DEFAULT TRUE,
    images TEXT[] DEFAULT '{}',
    documents TEXT[] DEFAULT '{}',
    contact_info JSONB DEFAULT '{}'
);

-- ========================================
-- MESSAGES TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    subject VARCHAR(255),
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    related_listing_id UUID,
    related_listing_type VARCHAR(50)
);

-- ========================================
-- FAVORITES TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS favorites (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    listing_id UUID NOT NULL,
    listing_type VARCHAR(50) NOT NULL, -- 'equipment', 'land', 'marketplace_item'
    UNIQUE(user_id, listing_id, listing_type)
);

-- ========================================
-- REVIEWS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    reviewed_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    listing_id UUID,
    listing_type VARCHAR(50)
);

-- ========================================
-- NOTIFICATIONS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    metadata JSONB DEFAULT '{}'
);

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles(location);
CREATE INDEX IF NOT EXISTS idx_profiles_is_verified ON profiles(is_verified);

CREATE INDEX IF NOT EXISTS idx_equipment_category ON equipment(category_id);
CREATE INDEX IF NOT EXISTS idx_equipment_seller ON equipment(seller_id);
CREATE INDEX IF NOT EXISTS idx_equipment_location ON equipment(location);
CREATE INDEX IF NOT EXISTS idx_equipment_price ON equipment(price);
CREATE INDEX IF NOT EXISTS idx_equipment_condition ON equipment(condition);
CREATE INDEX IF NOT EXISTS idx_equipment_is_available ON equipment(is_available);
CREATE INDEX IF NOT EXISTS idx_equipment_created_at ON equipment(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_land_seller ON land_listings(seller_id);
CREATE INDEX IF NOT EXISTS idx_land_location ON land_listings(location);
CREATE INDEX IF NOT EXISTS idx_land_price ON land_listings(price);
CREATE INDEX IF NOT EXISTS idx_land_area ON land_listings(area);
CREATE INDEX IF NOT EXISTS idx_land_is_available ON land_listings(is_available);
CREATE INDEX IF NOT EXISTS idx_land_created_at ON land_listings(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_listing ON favorites(listing_id, listing_type);

CREATE INDEX IF NOT EXISTS idx_reviews_reviewed ON reviews(reviewed_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer ON reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- ========================================
-- TRIGGERS FOR UPDATED_AT
-- ========================================
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

CREATE TRIGGER update_reviews_updated_at 
    BEFORE UPDATE ON reviews 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- TRIGGER TO CREATE PROFILE ON USER SIGNUP
-- ========================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, phone, location, user_type)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'location',
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'farmer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE land_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Equipment policies
CREATE POLICY "Equipment is viewable by everyone" ON equipment
    FOR SELECT USING (is_available = true);

CREATE POLICY "Users can insert own equipment" ON equipment
    FOR INSERT WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Users can update own equipment" ON equipment
    FOR UPDATE USING (auth.uid() = seller_id);

CREATE POLICY "Users can delete own equipment" ON equipment
    FOR DELETE USING (auth.uid() = seller_id);

-- Land listings policies
CREATE POLICY "Land listings are viewable by everyone" ON land_listings
    FOR SELECT USING (is_available = true);

CREATE POLICY "Users can insert own land listings" ON land_listings
    FOR INSERT WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Users can update own land listings" ON land_listings
    FOR UPDATE USING (auth.uid() = seller_id);

CREATE POLICY "Users can delete own land listings" ON land_listings
    FOR DELETE USING (auth.uid() = seller_id);

-- Messages policies
CREATE POLICY "Users can view messages they sent or received" ON messages
    FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can insert messages" ON messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update messages they sent" ON messages
    FOR UPDATE USING (auth.uid() = sender_id);

-- Favorites policies
CREATE POLICY "Users can view own favorites" ON favorites
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites" ON favorites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON favorites
    FOR DELETE USING (auth.uid() = user_id);

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone" ON reviews
    FOR SELECT USING (true);

CREATE POLICY "Users can insert reviews" ON reviews
    FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Users can update own reviews" ON reviews
    FOR UPDATE USING (auth.uid() = reviewer_id);

CREATE POLICY "Users can delete own reviews" ON reviews
    FOR DELETE USING (auth.uid() = reviewer_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- ========================================
-- SAMPLE DATA
-- ========================================

-- Insert default categories
INSERT INTO categories (name, name_ar, description, icon, sort_order) VALUES
('Tractors', 'جرارات', 'Agricultural tractors and machinery', 'tractor', 1),
('Irrigation', 'ري', 'Irrigation systems and equipment', 'droplets', 2),
('Harvesting', 'حصاد', 'Harvesting equipment and tools', 'scissors', 3),
('Seeding', 'بذر', 'Seeding and planting equipment', 'seedling', 4),
('Fertilizers', 'أسمدة', 'Fertilizers and soil amendments', 'leaf', 5),
('Pesticides', 'مبيدات', 'Pesticides and crop protection', 'shield', 6),
('Tools', 'أدوات', 'Hand tools and small equipment', 'wrench', 7),
('Storage', 'تخزين', 'Storage solutions and containers', 'package', 8)
ON CONFLICT DO NOTHING;

-- ========================================
-- STORAGE BUCKETS
-- ========================================

-- Create storage buckets (these will be created automatically by Supabase)
-- You can also create them manually in the Storage section of your dashboard

-- ========================================
-- FUNCTIONS FOR COMMON OPERATIONS
-- ========================================

-- Function to get user's average rating
CREATE OR REPLACE FUNCTION get_user_rating(user_uuid UUID)
RETURNS DECIMAL AS $$
DECLARE
    avg_rating DECIMAL;
BEGIN
    SELECT COALESCE(AVG(rating), 0) INTO avg_rating
    FROM reviews
    WHERE reviewed_id = user_uuid;
    
    RETURN avg_rating;
END;
$$ LANGUAGE plpgsql;

-- Function to get user's review count
CREATE OR REPLACE FUNCTION get_user_review_count(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    review_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO review_count
    FROM reviews
    WHERE reviewed_id = user_uuid;
    
    RETURN review_count;
END;
$$ LANGUAGE plpgsql;

-- Function to search equipment with filters
CREATE OR REPLACE FUNCTION search_equipment(
    search_term TEXT DEFAULT NULL,
    category_filter UUID DEFAULT NULL,
    price_min DECIMAL DEFAULT NULL,
    price_max DECIMAL DEFAULT NULL,
    condition_filter TEXT DEFAULT NULL,
    location_filter TEXT DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    title TEXT,
    description TEXT,
    price DECIMAL,
    condition TEXT,
    brand TEXT,
    model TEXT,
    year INTEGER,
    location TEXT,
    seller_name TEXT,
    images TEXT[],
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.id,
        e.title,
        e.description,
        e.price,
        e.condition,
        e.brand,
        e.model,
        e.year,
        e.location,
        p.full_name as seller_name,
        e.images,
        e.created_at
    FROM equipment e
    JOIN profiles p ON e.seller_id = p.id
    WHERE e.is_available = true
        AND (search_term IS NULL OR 
             e.title ILIKE '%' || search_term || '%' OR 
             e.description ILIKE '%' || search_term || '%')
        AND (category_filter IS NULL OR e.category_id = category_filter)
        AND (price_min IS NULL OR e.price >= price_min)
        AND (price_max IS NULL OR e.price <= price_max)
        AND (condition_filter IS NULL OR e.condition = condition_filter)
        AND (location_filter IS NULL OR e.location ILIKE '%' || location_filter || '%')
    ORDER BY e.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- COMPLETION MESSAGE
-- ========================================
DO $$
BEGIN
    RAISE NOTICE '🎉 Database setup completed successfully!';
    RAISE NOTICE '✅ All tables created with RLS policies';
    RAISE NOTICE '✅ Indexes created for optimal performance';
    RAISE NOTICE '✅ Triggers and functions configured';
    RAISE NOTICE '✅ Sample data inserted';
    RAISE NOTICE '';
    RAISE NOTICE '📋 Next steps:';
    RAISE NOTICE '1. Configure authentication providers in Supabase dashboard';
    RAISE NOTICE '2. Set up storage buckets for images';
    RAISE NOTICE '3. Test the application with the new schema';
END $$; 