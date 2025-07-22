-- =====================================================
-- Elghella Agricultural Marketplace Database Setup
-- =====================================================

-- Step 1: Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Step 2: Create Categories Table
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
('Export Products', 'منتجات للتصدير', 'Products for international export', 'ship', 11);

-- Step 3: Create Profiles Table
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

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Step 4: Create Equipment Table
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

-- Create updated_at trigger for equipment
CREATE TRIGGER update_equipment_updated_at 
    BEFORE UPDATE ON equipment 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Step 5: Create Land Listings Table
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

-- Create updated_at trigger for land_listings
CREATE TRIGGER update_land_listings_updated_at 
    BEFORE UPDATE ON land_listings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Step 6: Create Agricultural Products Table
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

-- Create updated_at trigger for agricultural_products
CREATE TRIGGER update_agricultural_products_updated_at 
    BEFORE UPDATE ON agricultural_products 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Step 7: Create Messages Table
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

-- Step 8: Create Favorites Table
CREATE TABLE IF NOT EXISTS favorites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  listing_id UUID NOT NULL,
  listing_type VARCHAR(20) CHECK (listing_type IN ('equipment', 'land', 'product')) NOT NULL,
  UNIQUE(user_id, listing_id, listing_type)
);

-- Step 9: Create Reviews Table
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

-- Step 10: Create Export Deals Table
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

-- Create updated_at trigger for export_deals
CREATE TRIGGER update_export_deals_updated_at 
    BEFORE UPDATE ON export_deals 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Step 11: Create Indexes for Performance
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

-- Step 12: Insert Sample Data

-- Sample Export Deals
INSERT INTO export_deals (title, title_ar, description, description_ar, product_type, quantity, price, destination, deadline, status, requirements) VALUES
('High Quality Dates', 'تمور عالية الجودة', 'Request for 500 tons of high-quality dates for European market', 'طلب لـ 500 طن من تمور دقلة نور للسوق الأوروبي', 'Dates', '500 tons', '$3,200/ton', 'European Union', '2025-03-01', 'open', ARRAY['European quality certificate', 'Standard packaging', 'Recent production date', 'Laboratory analysis']),
('Pickled Olives', 'زيتون مخلل', 'Annual contract for pickled olives supply to Gulf markets', 'عقد سنوي لتوريد الزيتون المخلل للأسواق الخليجية', 'Olives', '1000 tons/year', '$1,800/ton', 'UAE', '2025-06-01', 'coming', ARRAY['Organic certificate', 'Luxury packaging', 'Gulf specifications', 'Long shelf life']),
('Argan Oil', 'زيت الأرغان', 'Monthly supply of natural argan oil to Canadian market', 'توريد شهري لزيت الأرغان الطبيعي للسوق الكندي', 'Argan Oil', '50 liters/month', '$45/liter', 'Canada', '2025-12-31', 'active', ARRAY['Canadian organic certificate', 'Glass packaging', 'Chemical analysis', 'Health certificate']);

-- Step 13: Set up Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE land_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE agricultural_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE export_deals ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Equipment RLS Policies
CREATE POLICY "Anyone can view available equipment" ON equipment
  FOR SELECT USING (is_available = true);

CREATE POLICY "Users can view their own equipment" ON equipment
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own equipment" ON equipment
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own equipment" ON equipment
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own equipment" ON equipment
  FOR DELETE USING (auth.uid() = user_id);

-- Land Listings RLS Policies
CREATE POLICY "Anyone can view available land listings" ON land_listings
  FOR SELECT USING (is_available = true);

CREATE POLICY "Users can view their own land listings" ON land_listings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own land listings" ON land_listings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own land listings" ON land_listings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own land listings" ON land_listings
  FOR DELETE USING (auth.uid() = user_id);

-- Agricultural Products RLS Policies
CREATE POLICY "Anyone can view available agricultural products" ON agricultural_products
  FOR SELECT USING (is_available = true);

CREATE POLICY "Users can view their own agricultural products" ON agricultural_products
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own agricultural products" ON agricultural_products
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own agricultural products" ON agricultural_products
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own agricultural products" ON agricultural_products
  FOR DELETE USING (auth.uid() = user_id);

-- Messages RLS Policies
CREATE POLICY "Users can view messages they sent or received" ON messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can insert messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Favorites RLS Policies
CREATE POLICY "Users can view their own favorites" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" ON favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Reviews RLS Policies
CREATE POLICY "Anyone can view reviews" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can insert reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Export Deals RLS Policies
CREATE POLICY "Anyone can view export deals" ON export_deals
  FOR SELECT USING (true);

-- Step 14: Create Functions for Common Operations

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

-- Step 13: Create Animal Listings Table
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

-- Create indexes for animal_listings
CREATE INDEX IF NOT EXISTS idx_animal_listings_user_id ON animal_listings(user_id);
CREATE INDEX IF NOT EXISTS idx_animal_listings_animal_type ON animal_listings(animal_type);
CREATE INDEX IF NOT EXISTS idx_animal_listings_location ON animal_listings USING gin(to_tsvector('arabic', location));
CREATE INDEX IF NOT EXISTS idx_animal_listings_title ON animal_listings USING gin(to_tsvector('arabic', title));
CREATE INDEX IF NOT EXISTS idx_animal_listings_available ON animal_listings(is_available);
CREATE INDEX IF NOT EXISTS idx_animal_listings_featured ON animal_listings(is_featured);
CREATE INDEX IF NOT EXISTS idx_animal_listings_price ON animal_listings(price);
CREATE INDEX IF NOT EXISTS idx_animal_listings_created_at ON animal_listings(created_at);

-- Enable RLS for animal_listings
ALTER TABLE animal_listings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for animal_listings
CREATE POLICY "Animal listings are viewable by everyone" ON animal_listings 
FOR SELECT USING (is_available = true);

CREATE POLICY "Users can create their own animal listings" ON animal_listings 
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own animal listings" ON animal_listings 
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own animal listings" ON animal_listings 
FOR DELETE USING (auth.uid() = user_id);

-- Create trigger for updated_at
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

-- =====================================================
-- Expert Profiles Table for Agricultural Consultants
-- =====================================================

-- Create expert_profiles table
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_expert_profiles_user_id ON expert_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_expert_profiles_specialization ON expert_profiles(specialization);
CREATE INDEX IF NOT EXISTS idx_expert_profiles_location ON expert_profiles(location);
CREATE INDEX IF NOT EXISTS idx_expert_profiles_rating ON expert_profiles(rating);
CREATE INDEX IF NOT EXISTS idx_expert_profiles_created_at ON expert_profiles(created_at);
CREATE INDEX IF NOT EXISTS idx_expert_profiles_active_verified ON expert_profiles(is_active, is_verified);

-- Enable RLS for expert_profiles
ALTER TABLE expert_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for expert_profiles
CREATE POLICY "Expert profiles are viewable by everyone" ON expert_profiles 
FOR SELECT USING (is_active = true);

CREATE POLICY "Users can create their own expert profile" ON expert_profiles 
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own expert profile" ON expert_profiles 
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own expert profile" ON expert_profiles 
FOR DELETE USING (auth.uid() = user_id);

-- Create trigger for updated_at
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

-- Success message
SELECT 'Database setup completed successfully! 🎉 Animal marketplace and Expert profiles added!' as message; 
