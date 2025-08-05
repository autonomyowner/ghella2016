#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const SUPABASE_URL = 'https://puvmqdnvofbtmqpcjmia.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1dm1xZG52b2ZidG1xcGNqbWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5ODc2MDcsImV4cCI6MjA2ODU2MzYwN30.9rLsQz3vi8rU46OqTYHCInVMSGdj5xgZTYZvq7ZBfjY';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Available tables
const TABLES = {
  profiles: 'profiles',
  equipment: 'equipment', 
  vegetables: 'vegetables'
};

// MCP-like functions
async function getAllUsers() {
  try {
    console.log('🔍 Querying all users from profiles table...\n');
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching users:', error);
      return;
    }

    if (!data || data.length === 0) {
      console.log('📭 No users found in the database.');
      return;
    }

    console.log(`✅ Found ${data.length} user(s) in the database:\n`);
    
    data.forEach((user, index) => {
      console.log(`👤 User ${index + 1}:`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Name: ${user.full_name || 'N/A'}`);
      console.log(`   Phone: ${user.phone || 'N/A'}`);
      console.log(`   Location: ${user.location || 'N/A'}`);
      console.log(`   User Type: ${user.user_type || 'N/A'}`);
      console.log(`   Role: ${user.role || 'N/A'}`);
      console.log(`   Is Admin: ${user.is_admin ? 'Yes' : 'No'}`);
      console.log(`   Is Verified: ${user.is_verified ? 'Yes' : 'No'}`);
      console.log(`   Created: ${user.created_at || 'N/A'}`);
      console.log('');
    });

    // Summary
    console.log('📊 Summary:');
    const userTypeCounts = data.reduce((acc, user) => {
      acc[user.user_type] = (acc[user.user_type] || 0) + 1;
      return acc;
    }, {});
    
    Object.entries(userTypeCounts).forEach(([userType, count]) => {
      console.log(`   ${userType || 'Unknown'}: ${count} user(s)`);
    });

    const adminCount = data.filter(u => u.is_admin).length;
    const verifiedCount = data.filter(u => u.is_verified).length;
    
    console.log(`   Admin users: ${adminCount}`);
    console.log(`   Verified users: ${verifiedCount}`);

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

async function generateDatabaseSchema() {
  console.log('📋 Generating database schema...\n');
  
  const schema = `-- Postgres Schema for Elghella Agritech Platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types
CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE user_type AS ENUM ('farmer', 'buyer');
CREATE TYPE item_category AS ENUM ('animals', 'equipment', 'land', 'vegetables', 'services');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled');

-- Profiles table (already exists)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255),
    phone VARCHAR(20),
    location TEXT,
    user_type user_type DEFAULT 'farmer',
    role user_role DEFAULT 'user',
    is_admin BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    bio TEXT,
    website TEXT,
    avatar_url TEXT,
    social_links JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Farms table
CREATE TABLE IF NOT EXISTS farms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    location TEXT,
    size DECIMAL(10,2), -- in acres
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Marketplace items table
CREATE TABLE IF NOT EXISTS marketplace_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category item_category NOT NULL,
    quantity INTEGER DEFAULT 1,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    item_id UUID REFERENCES marketplace_items(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    status order_status DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Field logs table
CREATE TABLE IF NOT EXISTS field_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
    satellite_image_url TEXT,
    weather_summary TEXT,
    soil_moisture DECIMAL(5,2), -- percentage
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_farms_owner_id ON farms(owner_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_items_seller_id ON marketplace_items(seller_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_items_category ON marketplace_items(category);
CREATE INDEX IF NOT EXISTS idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_item_id ON orders(item_id);
CREATE INDEX IF NOT EXISTS idx_field_logs_farm_id ON field_logs(farm_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_farms_updated_at BEFORE UPDATE ON farms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_marketplace_items_updated_at BEFORE UPDATE ON marketplace_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();`;

  console.log(schema);
}

async function generateAPIEndpoints() {
  console.log('🌐 Generating API endpoints...\n');
  
  const api = `# REST API Endpoints

## Base URL: /api/v1

### Profiles (Users)
- GET /profiles - List all user profiles
- GET /profiles/:id - Get profile by ID
- GET /profiles/type/:userType - Get profiles by user type (farmer/buyer)
- POST /profiles - Create new profile
- PUT /profiles/:id - Update profile
- DELETE /profiles/:id - Delete profile

### Farms
- GET /farms - List all farms
- GET /farms/:id - Get farm by ID
- GET /farms/owner/:ownerId - Get farms by owner
- POST /farms - Create new farm
- PUT /farms/:id - Update farm
- DELETE /farms/:id - Delete farm

### Marketplace Items
- GET /marketplace-items - List all items
- GET /marketplace-items/:id - Get item by ID
- GET /marketplace-items/category/:category - Get items by category
- GET /marketplace-items/seller/:sellerId - Get items by seller
- POST /marketplace-items - Create new item
- PUT /marketplace-items/:id - Update item
- DELETE /marketplace-items/:id - Delete item

### Orders
- GET /orders - List all orders
- GET /orders/:id - Get order by ID
- GET /orders/buyer/:buyerId - Get orders by buyer
- POST /orders - Create new order
- PUT /orders/:id - Update order status
- DELETE /orders/:id - Cancel order

### Field Logs
- GET /field-logs - List all field logs
- GET /field-logs/:id - Get field log by ID
- GET /field-logs/farm/:farmId - Get logs by farm
- POST /field-logs - Create new field log
- PUT /field-logs/:id - Update field log
- DELETE /field-logs/:id - Delete field log`;

  console.log(api);
}

// Main function to handle different commands
async function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'users':
      await getAllUsers();
      break;
    case 'schema':
      await generateDatabaseSchema();
      break;
    case 'api':
      await generateAPIEndpoints();
      break;
    default:
      console.log('🚀 MCP Simple Server - Available Commands:');
      console.log('  node mcp-simple.js users    - Show all users');
      console.log('  node mcp-simple.js schema   - Generate database schema');
      console.log('  node mcp-simple.js api      - Generate API endpoints');
      break;
  }
}

// Run the main function
main().catch(console.error); 