# Land Database Fix - Test Guide

## ✅ PROBLEM IDENTIFIED:

### Error Message:
```
خطأ في إضافة الأرض: Error creating land_listings record: Failed to create land_listings: Could not find the 'contact_phone' column of 'land_listings' in the schema cache
```

### Root Cause:
- The `contact_phone` column doesn't exist in the `land_listings` table
- The form was updated to use `contact_phone` but the database schema wasn't updated

## 🔧 SOLUTION APPLIED:

### SQL Script Created: `fix-land-contact-phone.sql`
- **Action:** Adds `contact_phone` column to `land_listings` table
- **Column Type:** `VARCHAR(50)` - suitable for phone numbers
- **Safety:** Uses `IF NOT EXISTS` to prevent errors if column already exists

## 🧪 TEST STEPS:

1. **Run the SQL Script:**
   - ✅ Execute `fix-land-contact-phone.sql` in your Supabase SQL editor
   - ✅ Should add the `contact_phone` column successfully

2. **Verify Database Change:**
   - ✅ Check that `contact_phone` column exists in `land_listings` table
   - ✅ Column should be `VARCHAR(50)` and nullable

3. **Test Land Form:**
   - ✅ Go to `/land/new`
   - ✅ Fill out the form including phone number
   - ✅ Submit the form
   - ✅ Should work without database errors

## 🚨 EXPECTED BEHAVIOR:
- ✅ Database schema matches form requirements
- ✅ Land form submission works correctly
- ✅ Phone number is stored in database
- ✅ No more "Could not find the 'contact_phone' column" errors

## 🔧 TECHNICAL DETAILS:
- **Table:** `public.land_listings`
- **New Column:** `contact_phone VARCHAR(50)`
- **Form Field:** Phone number input
- **Database Sync:** Schema now matches form data structure 