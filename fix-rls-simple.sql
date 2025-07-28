-- Simple RLS Fix - Run this in Supabase SQL Editor

-- Enable RLS on all tables
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE land_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE vegetables ENABLE ROW LEVEL SECURITY;
ALTER TABLE animal_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE nurseries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON equipment;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON equipment;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON equipment;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON equipment;

DROP POLICY IF EXISTS "Enable read access for all users" ON land_listings;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON land_listings;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON land_listings;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON land_listings;

DROP POLICY IF EXISTS "Enable read access for all users" ON vegetables;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON vegetables;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON vegetables;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON vegetables;

DROP POLICY IF EXISTS "Enable read access for all users" ON animal_listings;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON animal_listings;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON animal_listings;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON animal_listings;

DROP POLICY IF EXISTS "Enable read access for all users" ON nurseries;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON nurseries;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON nurseries;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON nurseries;

-- Create new policies for equipment
CREATE POLICY "Enable read access for all users" ON equipment FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON equipment FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Enable update for users based on user_id" ON equipment FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Enable delete for users based on user_id" ON equipment FOR DELETE USING (auth.uid() = user_id);

-- Create new policies for land_listings
CREATE POLICY "Enable read access for all users" ON land_listings FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON land_listings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Enable update for users based on user_id" ON land_listings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Enable delete for users based on user_id" ON land_listings FOR DELETE USING (auth.uid() = user_id);

-- Create new policies for vegetables
CREATE POLICY "Enable read access for all users" ON vegetables FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON vegetables FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Enable update for users based on user_id" ON vegetables FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Enable delete for users based on user_id" ON vegetables FOR DELETE USING (auth.uid() = user_id);

-- Create new policies for animal_listings
CREATE POLICY "Enable read access for all users" ON animal_listings FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON animal_listings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Enable update for users based on user_id" ON animal_listings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Enable delete for users based on user_id" ON animal_listings FOR DELETE USING (auth.uid() = user_id);

-- Create new policies for nurseries
CREATE POLICY "Enable read access for all users" ON nurseries FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON nurseries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Enable update for users based on user_id" ON nurseries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Enable delete for users based on user_id" ON nurseries FOR DELETE USING (auth.uid() = user_id);

SELECT 'RLS policies created successfully!' as status; 