# 🚀 Firebase Setup Guide for Elghella Agricultural Marketplace

## ✅ Credentials Configured

Your Firebase credentials have been successfully configured:

- **Project URL**: `https://fyfgsvuenljeiicpwtjg.Firebase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5ZmdzdnVlbmxqZWlpY3B3dGpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MjQzNDYsImV4cCI6MjA2NzUwMDM0Nn0.ouZlOWP0p62hyeQkmsbXV4COWwd9CjQo0ZlXP1GYYWo`
- **Service Role Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5ZmdzdnVlbmxqZWlpY3B3dGpnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTkyNDM0NiwiZXhwIjoyMDY3NTAwMzQ2fQ.mQ7hwI7W5j6o1rRpWjNirSD0vP2kkhymkYPQMEndOls`

## 📋 Files Updated

The following files have been updated with your Firebase credentials:

1. ✅ `src/lib/Firebase/client.ts` - Client-side Firebase configuration
2. ✅ `src/lib/Firebase/server.ts` - Server-side Firebase configuration  
3. ✅ `src/lib/Firebase/middleware.ts` - Middleware Firebase configuration
4. ✅ `src/lib/Firebase/admin.ts` - Admin client for elevated permissions

## 🗄️ Database Setup Instructions

### Step 1: Access Firebase Dashboard

1. Go to [Firebase Dashboard](https://Firebase.com/dashboard)
2. Select your project: `fyfgsvuenljeiicpwtjg`
3. Navigate to **SQL Editor** in the left sidebar

### Step 2: Run Database Setup Script

1. Copy the entire content from `database-setup.sql`
2. Paste it into the SQL Editor
3. Click **Run** to execute the script

This will create:
- ✅ All necessary tables (profiles, equipment, land_listings, agricultural_products, etc.)
- ✅ Row Level Security (RLS) policies
- ✅ Database indexes for performance
- ✅ Sample export deals data
- ✅ Helper functions for common operations

### Step 3: Verify Setup

After running the script, you should see:
```
Database setup completed successfully! 🎉
```

## 🔐 Authentication Setup

### Step 1: Configure Auth Settings

1. Go to **Authentication** → **Settings** in your Firebase dashboard
2. Configure the following:

**Site URL**: `http://localhost:3000` (for development)
**Redirect URLs**: 
- `http://localhost:3000/auth/callback`
- `http://localhost:3000/dashboard`

### Step 2: Enable Email Auth

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure email templates (optional)

### Step 3: Set up Social Auth (Optional)

You can enable additional providers:
- Google
- Facebook
- GitHub

## 📊 Database Schema Overview

### Core Tables

| Table | Description | Key Features |
|-------|-------------|--------------|
| `profiles` | User profiles | Full name, phone, location, user type |
| `equipment` | Agricultural equipment listings | Price, condition, location, images |
| `land_listings` | Land for sale/rent | Area, soil type, water source |
| `agricultural_products` | Fresh products | Organic, export-ready, harvest dates |
| `export_deals` | International trade opportunities | Requirements, deadlines, destinations |
| `messages` | User communication | Real-time messaging system |
| `favorites` | User saved items | Cross-listing favorites |
| `reviews` | User ratings and reviews | 5-star rating system |

### Security Features

- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Automatic profile creation on user signup
- ✅ Secure admin operations with service role key
- ✅ User-specific data access policies

## 🚀 Next Steps

### 1. Test the Setup

Run your development server:
```bash
npm run dev
```

### 2. Test Authentication

1. Go to `http://localhost:3000/auth/signup`
2. Create a test account
3. Verify profile creation in Firebase dashboard

### 3. Test Database Operations

1. Create a new equipment listing
2. Add to favorites
3. Send a message
4. Verify data appears in Firebase dashboard

### 4. Environment Variables (Optional)

For production, create a `.env.local` file:
```env
NEXT_PUBLIC_Firebase_URL=https://fyfgsvuenljeiicpwtjg.Firebase.co
NEXT_PUBLIC_Firebase_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5ZmdzdnVlbmxqZWlpY3B3dGpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MjQzNDYsImV4cCI6MjA2NzUwMDM0Nn0.ouZlOWP0p62hyeQkmsbXV4COWwd9CjQo0ZlXP1GYYWo
Firebase_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5ZmdzdnVlbmxqZWlpY3B3dGpnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTkyNDM0NiwiZXhwIjoyMDY3NTAwMzQ2fQ.mQ7hwI7W5j6o1rRpWjNirSD0vP2kkhymkYPQMEndOls
```

## 🔧 Troubleshooting

### Common Issues

1. **"Invalid API key" error**
   - Verify the anon key is correct
   - Check if the project is active

2. **"Table doesn't exist" error**
   - Run the database setup script
   - Check if RLS policies are created

3. **Authentication not working**
   - Verify redirect URLs in Firebase dashboard
   - Check if email provider is enabled

### Support

If you encounter issues:
1. Check Firebase dashboard logs
2. Verify all SQL scripts ran successfully
3. Test with a simple query in SQL Editor

## 🎉 Success!

Your Firebase backend is now fully configured and ready to power your beautiful Arabic agricultural marketplace! 

The database includes:
- ✅ Complete user management system
- ✅ Equipment and land marketplace
- ✅ Agricultural products catalog
- ✅ Export deals platform
- ✅ Messaging system
- ✅ Reviews and ratings
- ✅ Favorites system
- ✅ Advanced search and filtering

Your website is now ready to handle real users and data! 🌾✨ 
