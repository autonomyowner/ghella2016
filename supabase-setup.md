# Firebase Database Setup for Elghella Marketplace

## Prerequisites
1. Go to your Firebase dashboard: https://Firebase.com/dashboard
2. Select your project: `fyfgsvuenljeiicpwtjg`
3. Go to **SQL Editor** in the left sidebar

## Step 1: Enable Required Extensions
Run this first:

```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

## Step 2: Create Categories Table
```sql
-- Create categories table
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
('Storage', 'تخزين', 'Storage solutions and containers', 'package', 8);
```

## Step 3: Create Profiles Table
```sql
-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  full_name VARCHAR(255),
  phone VARCHAR(50),
  location VARCHAR(255),
  avatar_url TEXT,
  user_type VARCHAR(20) CHECK (user_type IN ('farmer', 'buyer', 'both')) DEFAULT 'farmer',
  is_verified BOOLEAN DEFAULT FALSE
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
```

## Step 4: Create Equipment Table
```sql
-- Create equipment table
CREATE TABLE IF NOT EXISTS equipment (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'DZD',
  category_id UUID REFERENCES categories(id) NOT NULL,
  condition VARCHAR(20) CHECK (condition IN ('new', 'excellent', 'good', 'fair', 'poor')) DEFAULT 'good',
  year INTEGER,
  brand VARCHAR(255),
  model VARCHAR(255),
  hours_used INTEGER,
  location VARCHAR(255) NOT NULL,
  images TEXT[] DEFAULT '{}',
  is_available BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE
);

-- Create updated_at trigger for equipment
CREATE TRIGGER update_equipment_updated_at 
    BEFORE UPDATE ON equipment 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

## Step 5: Create Land Listings Table
```sql
-- Create land_listings table
CREATE TABLE IF NOT EXISTS land_listings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
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
  is_featured BOOLEAN DEFAULT FALSE
);

-- Create updated_at trigger for land_listings
CREATE TRIGGER update_land_listings_updated_at 
    BEFORE UPDATE ON land_listings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

## Step 6: Create Messages Table
```sql
-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  listing_id UUID,
  listing_type VARCHAR(20) CHECK (listing_type IN ('equipment', 'land'))
);
```

## Step 7: Create Favorites Table
```sql
-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  listing_id UUID NOT NULL,
  listing_type VARCHAR(20) CHECK (listing_type IN ('equipment', 'land')) NOT NULL,
  UNIQUE(user_id, listing_id, listing_type)
);
```

## Step 8: Create Reviews Table
```sql
-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  reviewed_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  listing_id UUID,
  listing_type VARCHAR(20) CHECK (listing_type IN ('equipment', 'land'))
);
```

## Step 9: Create Indexes for Performance
```sql
-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_equipment_user_id ON equipment(user_id);
CREATE INDEX IF NOT EXISTS idx_equipment_category_id ON equipment(category_id);
CREATE INDEX IF NOT EXISTS idx_equipment_location ON equipment(location);
CREATE INDEX IF NOT EXISTS idx_equipment_is_available ON equipment(is_available);
CREATE INDEX IF NOT EXISTS idx_equipment_is_featured ON equipment(is_featured);

CREATE INDEX IF NOT EXISTS idx_land_listings_user_id ON land_listings(user_id);
CREATE INDEX IF NOT EXISTS idx_land_listings_location ON land_listings(location);
CREATE INDEX IF NOT EXISTS idx_land_listings_is_available ON land_listings(is_available);
CREATE INDEX IF NOT EXISTS idx_land_listings_is_featured ON land_listings(is_featured);

CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_listing ON favorites(listing_id, listing_type);

CREATE INDEX IF NOT EXISTS idx_reviews_reviewed_user_id ON reviews(reviewed_user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer_id ON reviews(reviewer_id);
```

## Step 10: Enable Row Level Security (RLS)
```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE land_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
```

## Step 11: Create RLS Policies
```sql
-- Profiles policies
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Equipment policies
CREATE POLICY "Anyone can view available equipment" ON equipment FOR SELECT USING (is_available = true);
CREATE POLICY "Users can view own equipment" ON equipment FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own equipment" ON equipment FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own equipment" ON equipment FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own equipment" ON equipment FOR DELETE USING (auth.uid() = user_id);

-- Land listings policies
CREATE POLICY "Anyone can view available land" ON land_listings FOR SELECT USING (is_available = true);
CREATE POLICY "Users can view own land listings" ON land_listings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own land listings" ON land_listings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own land listings" ON land_listings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own land listings" ON land_listings FOR DELETE USING (auth.uid() = user_id);

-- Messages policies
CREATE POLICY "Users can view messages they sent or received" ON messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can insert messages" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update messages they sent" ON messages FOR UPDATE USING (auth.uid() = sender_id);

-- Favorites policies
CREATE POLICY "Users can view own favorites" ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own favorites" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own favorites" ON favorites FOR DELETE USING (auth.uid() = user_id);

-- Reviews policies
CREATE POLICY "Anyone can view reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users can insert reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);
CREATE POLICY "Users can update own reviews" ON reviews FOR UPDATE USING (auth.uid() = reviewer_id);
CREATE POLICY "Users can delete own reviews" ON reviews FOR DELETE USING (auth.uid() = reviewer_id);
```

## Step 12: Create Storage Buckets
```sql
-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public) VALUES 
('equipment-images', 'equipment-images', true),
('avatars', 'avatars', true),
('documents', 'documents', false);

-- Storage policies for equipment images
CREATE POLICY "Anyone can view equipment images" ON storage.objects FOR SELECT USING (bucket_id = 'equipment-images');
CREATE POLICY "Authenticated users can upload equipment images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'equipment-images' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update own equipment images" ON storage.objects FOR UPDATE USING (bucket_id = 'equipment-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete own equipment images" ON storage.objects FOR DELETE USING (bucket_id = 'equipment-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for avatars
CREATE POLICY "Anyone can view avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users can upload own avatar" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update own avatar" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete own avatar" ON storage.objects FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## Step 13: Verify Setup
```sql
-- Check if tables were created successfully
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'equipment', 'land_listings', 'categories', 'messages', 'favorites', 'reviews');

-- Check if categories were inserted
SELECT * FROM categories ORDER BY sort_order;
```

## Instructions to Run:
1. Copy each SQL block
2. Paste it into the Firebase SQL Editor
3. Click "Run" for each block
4. Run them in order (1-13)
5. After completion, your signup should work!

## Troubleshooting:
- If you get errors about tables already existing, that's fine - just continue
- If you get permission errors, make sure you're using the correct Firebase project
- After running all scripts, try signing up again - it should work now! 
