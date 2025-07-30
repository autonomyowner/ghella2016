-- =====================================================
-- Setup Missing Tables - Complete Database Setup
-- =====================================================

-- Step 1: Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Step 2: Create Categories Table (if not exists)
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

-- Insert default Algerian agricultural categories
INSERT INTO categories (name, name_ar, description, icon, sort_order) VALUES
('Tractors', 'جرارات', 'Agricultural tractors and machinery', 'tractor', 1),
('Irrigation', 'ري', 'Irrigation systems and equipment', 'droplets', 2),
('Harvesting', 'حصاد', 'Harvesting equipment and tools', 'scissors', 3),
('Seeding', 'بذر', 'Seeding and planting equipment', 'seedling', 4),
('Fertilizers', 'أسمدة', 'Fertilizers and soil amendments', 'leaf', 5),
('Pesticides', 'مبيدات', 'Pesticides and crop protection', 'shield', 6),
('Tools', 'أدوات', 'Hand tools and small equipment', 'wrench', 7),
('Storage', 'تخزين', 'Storage solutions and containers', 'package', 8),
('Livestock', 'ماشية', 'Livestock and animal equipment', 'cow', 9),
('Organic Products', 'منتجات عضوية', 'Organic farming products', 'leaf', 10),
('Export Products', 'منتجات للتصدير', 'Products for international export', 'ship', 11)
ON CONFLICT DO NOTHING;

-- Step 3: Create Profiles Table (if not exists)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  full_name VARCHAR(255),
  phone VARCHAR(50),
  location VARCHAR(255),
  avatar_url TEXT,
  user_type VARCHAR(20) CHECK (user_type IN ('farmer', 'buyer', 'both', 'admin')) DEFAULT 'farmer',
  is_verified BOOLEAN DEFAULT FALSE,
  bio TEXT,
  website VARCHAR(255),
  social_links JSONB DEFAULT '{}'
);

-- Create updated_at trigger
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

-- Create trigger to automatically create profile on user signup
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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Step 4: Create Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    message_type VARCHAR(50) DEFAULT 'general', -- general, support, feedback, other
    status VARCHAR(50) DEFAULT 'unread', -- unread, read, replied, archived
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    admin_notes TEXT,
    admin_reply TEXT,
    replied_at TIMESTAMP WITH TIME ZONE,
    replied_by UUID REFERENCES auth.users(id)
);

-- Step 5: Create Expert Applications Table
CREATE TABLE IF NOT EXISTS expert_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    specialization VARCHAR(255) NOT NULL, -- زراعة، تربية حيوانات، استشارات، etc.
    experience_years INTEGER NOT NULL,
    education VARCHAR(255),
    certifications TEXT,
    bio TEXT NOT NULL,
    services_offered TEXT,
    languages TEXT[], -- Array of languages spoken
    availability VARCHAR(100), -- full-time, part-time, consulting
    hourly_rate DECIMAL(10,2),
    portfolio_url VARCHAR(500),
    cv_file_url VARCHAR(500),
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected, under_review
    admin_notes TEXT,
    admin_reply TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES auth.users(id)
);

-- Step 6: Create Newsletter Subscriptions Table
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    preferences JSONB DEFAULT '{}', -- Store user preferences for newsletter content
    status VARCHAR(50) DEFAULT 'active', -- active, unsubscribed, bounced
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    unsubscribed_at TIMESTAMP WITH TIME ZONE,
    source VARCHAR(100) DEFAULT 'website', -- website, admin, api
    ip_address INET,
    user_agent TEXT
);

-- Step 7: Create Admin Messages Table
CREATE TABLE IF NOT EXISTS admin_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    message_type VARCHAR(50) NOT NULL, -- alert, notification, system
    priority VARCHAR(20) DEFAULT 'normal', -- low, normal, high, urgent
    target_audience VARCHAR(50) DEFAULT 'all', -- all, admins, experts, users
    is_read BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Step 8: Create Equipment Table (if not exists)
CREATE TABLE IF NOT EXISTS equipment (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  title_ar VARCHAR(255) NOT NULL,
  description TEXT,
  description_ar TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'DZD',
  category_id UUID REFERENCES categories(id) NOT NULL,
  condition VARCHAR(20) CHECK (condition IN ('new', 'excellent', 'good', 'fair', 'poor')) DEFAULT 'good',
  year INTEGER,
  brand VARCHAR(255),
  model VARCHAR(255),
  hours_used INTEGER,
  location VARCHAR(255) NOT NULL,
  coordinates JSONB,
  images TEXT[] DEFAULT '{}',
  is_available BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  views_count INTEGER DEFAULT 0,
  contact_phone VARCHAR(50),
  contact_email VARCHAR(255)
);

-- Step 9: Create Land Listings Table (if not exists)
CREATE TABLE IF NOT EXISTS land_listings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  title_ar VARCHAR(255) NOT NULL,
  description TEXT,
  description_ar TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'DZD',
  listing_type VARCHAR(10) CHECK (listing_type IN ('sale', 'rent')) DEFAULT 'sale',
  area_size DECIMAL(10,2) NOT NULL,
  area_unit VARCHAR(20) CHECK (area_unit IN ('hectare', 'acre', 'dunum')) DEFAULT 'hectare',
  location VARCHAR(255) NOT NULL,
  coordinates JSONB,
  soil_type VARCHAR(255),
  water_source VARCHAR(255),
  images TEXT[] DEFAULT '{}',
  is_available BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  views_count INTEGER DEFAULT 0,
  contact_phone VARCHAR(50),
  contact_email VARCHAR(255)
);

-- Step 10: Create Agricultural Products Table (if not exists)
CREATE TABLE IF NOT EXISTS agricultural_products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  title_ar VARCHAR(255) NOT NULL,
  description TEXT,
  description_ar TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'DZD',
  unit VARCHAR(20) DEFAULT 'kg',
  quantity DECIMAL(10,2) NOT NULL,
  category VARCHAR(50) NOT NULL,
  is_organic BOOLEAN DEFAULT FALSE,
  is_export BOOLEAN DEFAULT FALSE,
  harvest_date DATE,
  expiry_date DATE,
  location VARCHAR(255) NOT NULL,
  images TEXT[] DEFAULT '{}',
  is_available BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  views_count INTEGER DEFAULT 0,
  contact_phone VARCHAR(50),
  contact_email VARCHAR(255)
);

-- Step 11: Create Messages Table (if not exists)
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  listing_id UUID,
  listing_type VARCHAR(20) CHECK (listing_type IN ('equipment', 'land', 'product'))
);

-- Step 12: Create Favorites Table (if not exists)
CREATE TABLE IF NOT EXISTS favorites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  listing_id UUID NOT NULL,
  listing_type VARCHAR(20) CHECK (listing_type IN ('equipment', 'land', 'product')) NOT NULL,
  UNIQUE(user_id, listing_id, listing_type)
);

-- Step 13: Create Reviews Table (if not exists)
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  reviewed_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  listing_id UUID,
  listing_type VARCHAR(20) CHECK (listing_type IN ('equipment', 'land', 'product'))
);

-- Step 14: Create Export Deals Table (if not exists)
CREATE TABLE IF NOT EXISTS export_deals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title VARCHAR(255) NOT NULL,
  title_ar VARCHAR(255) NOT NULL,
  description TEXT,
  description_ar TEXT,
  product_type VARCHAR(100) NOT NULL,
  quantity VARCHAR(100) NOT NULL,
  price VARCHAR(100) NOT NULL,
  destination VARCHAR(255) NOT NULL,
  deadline DATE,
  status VARCHAR(20) CHECK (status IN ('open', 'coming', 'active', 'closed')) DEFAULT 'open',
  requirements TEXT[] DEFAULT '{}',
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  is_featured BOOLEAN DEFAULT FALSE
);

-- Step 15: Create Animal Listings Table (if not exists)
CREATE TABLE IF NOT EXISTS animal_listings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(12,2) NOT NULL CHECK (price >= 0),
  currency VARCHAR(3) DEFAULT 'DZD',
  animal_type VARCHAR(50) NOT NULL CHECK (animal_type IN ('sheep', 'cow', 'goat', 'chicken', 'camel', 'horse', 'other')),
  breed VARCHAR(100),
  age_months INTEGER CHECK (age_months >= 0),
  gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female', 'mixed')),
  quantity INTEGER NOT NULL CHECK (quantity > 0) DEFAULT 1,
  health_status TEXT,
  vaccination_status BOOLEAN DEFAULT FALSE,
  location TEXT NOT NULL,
  coordinates JSONB,
  images TEXT[] DEFAULT '{}',
  is_available BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  weight_kg DECIMAL(8,2) CHECK (weight_kg >= 0),
  price_per_head BOOLEAN DEFAULT TRUE,
  purpose VARCHAR(20) NOT NULL CHECK (purpose IN ('meat', 'dairy', 'breeding', 'work', 'pets', 'other')) DEFAULT 'meat'
);

-- Step 16: Create Expert Profiles Table (if not exists)
CREATE TABLE IF NOT EXISTS expert_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Basic Information
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  specialization VARCHAR(255) NOT NULL,
  bio TEXT NOT NULL,
  years_of_experience INTEGER NOT NULL CHECK (years_of_experience >= 0),
  
  -- Education & Credentials
  education TEXT NOT NULL,
  certifications TEXT[] DEFAULT '{}',
  
  -- Contact Information
  location VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  email VARCHAR(255),
  profile_image TEXT,
  
  -- Professional Details
  rating DECIMAL(3,2) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
  reviews_count INTEGER DEFAULT 0 CHECK (reviews_count >= 0),
  hourly_rate INTEGER CHECK (hourly_rate > 0),
  availability_status VARCHAR(20) CHECK (availability_status IN ('available', 'busy', 'unavailable')) DEFAULT 'available',
  
  -- Services & Skills
  services_offered TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{}',
  
  -- Verification & Status
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  
  CONSTRAINT unique_user_expert_profile UNIQUE(user_id)
);

-- Step 17: Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_expert_applications_status ON expert_applications(status);
CREATE INDEX IF NOT EXISTS idx_expert_applications_created_at ON expert_applications(created_at);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_email ON newsletter_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_status ON newsletter_subscriptions(status);

CREATE INDEX IF NOT EXISTS idx_equipment_user_id ON equipment(user_id);
CREATE INDEX IF NOT EXISTS idx_equipment_category_id ON equipment(category_id);
CREATE INDEX IF NOT EXISTS idx_equipment_location ON equipment(location);
CREATE INDEX IF NOT EXISTS idx_equipment_is_available ON equipment(is_available);
CREATE INDEX IF NOT EXISTS idx_equipment_is_featured ON equipment(is_featured);

CREATE INDEX IF NOT EXISTS idx_land_listings_user_id ON land_listings(user_id);
CREATE INDEX IF NOT EXISTS idx_land_listings_location ON land_listings(location);
CREATE INDEX IF NOT EXISTS idx_land_listings_listing_type ON land_listings(listing_type);
CREATE INDEX IF NOT EXISTS idx_land_listings_is_available ON land_listings(is_available);

CREATE INDEX IF NOT EXISTS idx_agricultural_products_user_id ON agricultural_products(user_id);
CREATE INDEX IF NOT EXISTS idx_agricultural_products_category ON agricultural_products(category);
CREATE INDEX IF NOT EXISTS idx_agricultural_products_location ON agricultural_products(location);
CREATE INDEX IF NOT EXISTS idx_agricultural_products_is_organic ON agricultural_products(is_organic);
CREATE INDEX IF NOT EXISTS idx_agricultural_products_is_export ON agricultural_products(is_export);

CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_listing_type ON favorites(listing_type);

CREATE INDEX IF NOT EXISTS idx_reviews_reviewed_user_id ON reviews(reviewed_user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

CREATE INDEX IF NOT EXISTS idx_export_deals_status ON export_deals(status);
CREATE INDEX IF NOT EXISTS idx_export_deals_destination ON export_deals(destination);

CREATE INDEX IF NOT EXISTS idx_animal_listings_user_id ON animal_listings(user_id);
CREATE INDEX IF NOT EXISTS idx_animal_listings_animal_type ON animal_listings(animal_type);
CREATE INDEX IF NOT EXISTS idx_animal_listings_location ON animal_listings USING gin(to_tsvector('arabic', location));
CREATE INDEX IF NOT EXISTS idx_animal_listings_title ON animal_listings USING gin(to_tsvector('arabic', title));
CREATE INDEX IF NOT EXISTS idx_animal_listings_available ON animal_listings(is_available);
CREATE INDEX IF NOT EXISTS idx_animal_listings_featured ON animal_listings(is_featured);
CREATE INDEX IF NOT EXISTS idx_animal_listings_price ON animal_listings(price);
CREATE INDEX IF NOT EXISTS idx_animal_listings_created_at ON animal_listings(created_at);

CREATE INDEX IF NOT EXISTS idx_expert_profiles_user_id ON expert_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_expert_profiles_specialization ON expert_profiles(specialization);
CREATE INDEX IF NOT EXISTS idx_expert_profiles_location ON expert_profiles(location);
CREATE INDEX IF NOT EXISTS idx_expert_profiles_rating ON expert_profiles(rating);
CREATE INDEX IF NOT EXISTS idx_expert_profiles_created_at ON expert_profiles(created_at);
CREATE INDEX IF NOT EXISTS idx_expert_profiles_active_verified ON expert_profiles(is_active, is_verified);

-- Step 18: Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE expert_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE land_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE agricultural_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE export_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE animal_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE expert_profiles ENABLE ROW LEVEL SECURITY;

-- Step 19: Create RLS Policies

-- Profiles RLS Policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Contact Messages RLS Policies
DROP POLICY IF EXISTS "Admins can view all contact messages" ON contact_messages;
CREATE POLICY "Admins can view all contact messages" ON contact_messages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.user_type = 'admin'
        )
    );

DROP POLICY IF EXISTS "Users can insert contact messages" ON contact_messages;
CREATE POLICY "Users can insert contact messages" ON contact_messages
    FOR INSERT WITH CHECK (true);

-- Expert Applications RLS Policies
DROP POLICY IF EXISTS "Users can view their own applications" ON expert_applications;
CREATE POLICY "Users can view their own applications" ON expert_applications
    FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert expert applications" ON expert_applications;
CREATE POLICY "Users can insert expert applications" ON expert_applications
    FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own applications" ON expert_applications;
CREATE POLICY "Users can update their own applications" ON expert_applications
    FOR UPDATE USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can view all expert applications" ON expert_applications;
CREATE POLICY "Admins can view all expert applications" ON expert_applications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.user_type = 'admin'
        )
    );

-- Newsletter Subscriptions RLS Policies
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON newsletter_subscriptions;
CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter_subscriptions
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view all newsletter subscriptions" ON newsletter_subscriptions;
CREATE POLICY "Admins can view all newsletter subscriptions" ON newsletter_subscriptions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.user_type = 'admin'
        )
    );

-- Admin Messages RLS Policies
DROP POLICY IF EXISTS "Admins can manage admin messages" ON admin_messages;
CREATE POLICY "Admins can manage admin messages" ON admin_messages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.user_type = 'admin'
        )
    );

-- Equipment RLS Policies
DROP POLICY IF EXISTS "Anyone can view available equipment" ON equipment;
CREATE POLICY "Anyone can view available equipment" ON equipment
  FOR SELECT USING (is_available = true);

DROP POLICY IF EXISTS "Users can view their own equipment" ON equipment;
CREATE POLICY "Users can view their own equipment" ON equipment
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own equipment" ON equipment;
CREATE POLICY "Users can insert their own equipment" ON equipment
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own equipment" ON equipment;
CREATE POLICY "Users can update their own equipment" ON equipment
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own equipment" ON equipment;
CREATE POLICY "Users can delete their own equipment" ON equipment
  FOR DELETE USING (auth.uid() = user_id);

-- Land Listings RLS Policies
DROP POLICY IF EXISTS "Anyone can view available land listings" ON land_listings;
CREATE POLICY "Anyone can view available land listings" ON land_listings
  FOR SELECT USING (is_available = true);

DROP POLICY IF EXISTS "Users can view their own land listings" ON land_listings;
CREATE POLICY "Users can view their own land listings" ON land_listings
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own land listings" ON land_listings;
CREATE POLICY "Users can insert their own land listings" ON land_listings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own land listings" ON land_listings;
CREATE POLICY "Users can update their own land listings" ON land_listings
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own land listings" ON land_listings;
CREATE POLICY "Users can delete their own land listings" ON land_listings
  FOR DELETE USING (auth.uid() = user_id);

-- Agricultural Products RLS Policies
DROP POLICY IF EXISTS "Anyone can view available agricultural products" ON agricultural_products;
CREATE POLICY "Anyone can view available agricultural products" ON agricultural_products
  FOR SELECT USING (is_available = true);

DROP POLICY IF EXISTS "Users can view their own agricultural products" ON agricultural_products;
CREATE POLICY "Users can view their own agricultural products" ON agricultural_products
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own agricultural products" ON agricultural_products;
CREATE POLICY "Users can insert their own agricultural products" ON agricultural_products
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own agricultural products" ON agricultural_products;
CREATE POLICY "Users can update their own agricultural products" ON agricultural_products
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own agricultural products" ON agricultural_products;
CREATE POLICY "Users can delete their own agricultural products" ON agricultural_products
  FOR DELETE USING (auth.uid() = user_id);

-- Messages RLS Policies
DROP POLICY IF EXISTS "Users can view messages they sent or received" ON messages;
CREATE POLICY "Users can view messages they sent or received" ON messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

DROP POLICY IF EXISTS "Users can insert messages" ON messages;
CREATE POLICY "Users can insert messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Favorites RLS Policies
DROP POLICY IF EXISTS "Users can view their own favorites" ON favorites;
CREATE POLICY "Users can view their own favorites" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own favorites" ON favorites;
CREATE POLICY "Users can insert their own favorites" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own favorites" ON favorites;
CREATE POLICY "Users can delete their own favorites" ON favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Reviews RLS Policies
DROP POLICY IF EXISTS "Anyone can view reviews" ON reviews;
CREATE POLICY "Anyone can view reviews" ON reviews
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert reviews" ON reviews;
CREATE POLICY "Users can insert reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Export Deals RLS Policies
DROP POLICY IF EXISTS "Anyone can view export deals" ON export_deals;
CREATE POLICY "Anyone can view export deals" ON export_deals
  FOR SELECT USING (true);

-- Animal Listings RLS Policies
DROP POLICY IF EXISTS "Animal listings are viewable by everyone" ON animal_listings;
CREATE POLICY "Animal listings are viewable by everyone" ON animal_listings 
FOR SELECT USING (is_available = true);

DROP POLICY IF EXISTS "Users can create their own animal listings" ON animal_listings;
CREATE POLICY "Users can create their own animal listings" ON animal_listings 
FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own animal listings" ON animal_listings;
CREATE POLICY "Users can update their own animal listings" ON animal_listings 
FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own animal listings" ON animal_listings;
CREATE POLICY "Users can delete their own animal listings" ON animal_listings 
FOR DELETE USING (auth.uid() = user_id);

-- Expert Profiles RLS Policies
DROP POLICY IF EXISTS "Expert profiles are viewable by everyone" ON expert_profiles;
CREATE POLICY "Expert profiles are viewable by everyone" ON expert_profiles 
FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Users can create their own expert profile" ON expert_profiles;
CREATE POLICY "Users can create their own expert profile" ON expert_profiles 
FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own expert profile" ON expert_profiles;
CREATE POLICY "Users can update their own expert profile" ON expert_profiles 
FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own expert profile" ON expert_profiles;
CREATE POLICY "Users can delete their own expert profile" ON expert_profiles 
FOR DELETE USING (auth.uid() = user_id);

-- Step 20: Create Triggers for updated_at
CREATE TRIGGER update_equipment_updated_at 
    BEFORE UPDATE ON equipment 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_land_listings_updated_at 
    BEFORE UPDATE ON land_listings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agricultural_products_updated_at 
    BEFORE UPDATE ON agricultural_products 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_export_deals_updated_at 
    BEFORE UPDATE ON export_deals 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE FUNCTION handle_animal_listings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER animal_listings_updated_at
  BEFORE UPDATE ON animal_listings
  FOR EACH ROW
  EXECUTE PROCEDURE handle_animal_listings_updated_at();

CREATE OR REPLACE FUNCTION handle_expert_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER expert_profiles_updated_at
  BEFORE UPDATE ON expert_profiles
  FOR EACH ROW
  EXECUTE PROCEDURE handle_expert_profiles_updated_at();

-- Step 21: Insert Sample Data
INSERT INTO export_deals (title, title_ar, description, description_ar, product_type, quantity, price, destination, deadline, status, requirements) VALUES
('High Quality Dates', 'تمور عالية الجودة', 'Request for 500 tons of high-quality dates for European market', 'طلب لـ 500 طن من تمور دقلة نور للسوق الأوروبي', 'Dates', '500 tons', '$3,200/ton', 'European Union', '2025-03-01', 'open', ARRAY['European quality certificate', 'Standard packaging', 'Recent production date', 'Laboratory analysis']),
('Pickled Olives', 'زيتون مخلل', 'Annual contract for pickled olives supply to Gulf markets', 'عقد سنوي لتوريد الزيتون المخلل للأسواق الخليجية', 'Olives', '1000 tons/year', '$1,800/ton', 'UAE', '2025-06-01', 'coming', ARRAY['Organic certificate', 'Luxury packaging', 'Gulf specifications', 'Long shelf life']),
('Argan Oil', 'زيت الأرغان', 'Monthly supply of natural argan oil to Canadian market', 'توريد شهري لزيت الأرغان الطبيعي للسوق الكندي', 'Argan Oil', '50 liters/month', '$45/liter', 'Canada', '2025-12-31', 'active', ARRAY['Canadian organic certificate', 'Glass packaging', 'Chemical analysis', 'Health certificate'])
ON CONFLICT DO NOTHING;

INSERT INTO contact_messages (name, email, subject, message, message_type) VALUES
('أحمد محمد', 'ahmed@example.com', 'استفسار عن الخدمات', 'أريد معرفة المزيد عن خدماتكم الزراعية', 'general'),
('فاطمة علي', 'fatima@example.com', 'طلب استشارة', 'أحتاج استشارة في مجال تربية الحيوانات', 'support'),
('محمد حسن', 'mohamed@example.com', 'اقتراح تحسين', 'اقتراحاتي لتحسين الموقع', 'feedback')
ON CONFLICT DO NOTHING;

INSERT INTO expert_applications (full_name, email, phone, specialization, experience_years, bio, services_offered) VALUES
('د. خالد أحمد', 'khalid@example.com', '+213123456789', 'استشارات زراعية', 15, 'خبير زراعي مع 15 سنة خبرة في مجال الزراعة العضوية', 'استشارات، دراسات جدوى، تدريب'),
('أ. سارة محمد', 'sara@example.com', '+213987654321', 'تربية الحيوانات', 8, 'متخصصة في تربية الأغنام والماعز', 'استشارات تربية، رعاية صحية، تغذية')
ON CONFLICT DO NOTHING;

INSERT INTO newsletter_subscriptions (email, full_name) VALUES
('user1@example.com', 'أحمد محمد'),
('user2@example.com', 'فاطمة علي'),
('user3@example.com', 'محمد حسن')
ON CONFLICT DO NOTHING;

-- Step 22: Create Functions for Common Operations
CREATE OR REPLACE FUNCTION get_unread_messages_count()
RETURNS TABLE(
    contact_messages_count BIGINT,
    expert_applications_count BIGINT,
    total_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM contact_messages WHERE status = 'unread')::BIGINT,
        (SELECT COUNT(*) FROM expert_applications WHERE status = 'pending')::BIGINT,
        ((SELECT COUNT(*) FROM contact_messages WHERE status = 'unread') + 
         (SELECT COUNT(*) FROM expert_applications WHERE status = 'pending'))::BIGINT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark message as read
CREATE OR REPLACE FUNCTION mark_message_as_read(message_id UUID, message_type VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
    IF message_type = 'contact' THEN
        UPDATE contact_messages 
        SET status = 'read', updated_at = NOW() 
        WHERE id = message_id;
        RETURN FOUND;
    ELSIF message_type = 'expert' THEN
        UPDATE expert_applications 
        SET status = 'under_review', updated_at = NOW() 
        WHERE id = message_id;
        RETURN FOUND;
    END IF;
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_view_count(table_name text, record_id uuid)
RETURNS void AS $$
BEGIN
  EXECUTE format('UPDATE %I SET views_count = views_count + 1 WHERE id = $1', table_name)
  USING record_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user statistics
CREATE OR REPLACE FUNCTION get_user_stats(user_uuid uuid)
RETURNS json AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'equipment_count', (SELECT COUNT(*) FROM equipment WHERE user_id = user_uuid),
    'land_listings_count', (SELECT COUNT(*) FROM land_listings WHERE user_id = user_uuid),
    'products_count', (SELECT COUNT(*) FROM agricultural_products WHERE user_id = user_uuid),
    'total_views', (
      COALESCE((SELECT SUM(views_count) FROM equipment WHERE user_id = user_uuid), 0) +
      COALESCE((SELECT SUM(views_count) FROM land_listings WHERE user_id = user_uuid), 0) +
      COALESCE((SELECT SUM(views_count) FROM agricultural_products WHERE user_id = user_uuid), 0) +
      COALESCE((SELECT SUM(view_count) FROM animal_listings WHERE user_id = user_uuid), 0)
    ),
    'favorites_count', (SELECT COUNT(*) FROM favorites WHERE user_id = user_uuid),
    'reviews_received', (SELECT COUNT(*) FROM reviews WHERE reviewed_user_id = user_uuid)
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Display confirmation
SELECT '✅ All tables created successfully! Database setup complete!' as status; 