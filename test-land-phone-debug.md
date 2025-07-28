# Land Phone Debug Guide

## 🔍 DEBUGGING STEPS:

### 1. Check Console Logs
- ✅ Open browser console on `/land` page
- ✅ Look for these debug logs:
  - "Fetched land data:"
  - "Sample land record:"
  - "Contact phone fields:"

### 2. Check Database Connection
- ✅ Verify if using Supabase or localStorage fallback
- ✅ Check if `contact_phone` column exists in database
- ✅ Run the SQL script if not already done

### 3. Test with New Land Listing
- ✅ Create a new land listing with phone number
- ✅ Check if new listing shows phone number
- ✅ Compare with existing listings

### 4. Clear Cache
- ✅ Clear browser localStorage
- ✅ Refresh page
- ✅ Check if phone numbers appear

## 🚨 POSSIBLE ISSUES:

### Issue 1: Database Column Missing
- **Solution:** Run `fix-land-contact-phone.sql` script
- **Check:** Verify column exists in Supabase

### Issue 2: localStorage Fallback
- **Problem:** System using cached data without phone field
- **Solution:** Clear localStorage and refresh

### Issue 3: Existing Records
- **Problem:** Old land records don't have phone numbers
- **Solution:** Create new listings or update existing ones

### Issue 4: TypeScript Types
- **Problem:** Types not updated
- **Solution:** Restart development server

## 🧪 QUICK TESTS:

1. **Database Test:**
   ```sql
   SELECT id, contact_phone FROM land_listings LIMIT 5;
   ```

2. **New Listing Test:**
   - Create new land listing with phone
   - Check if phone appears on cards

3. **Console Debug:**
   - Check console logs for data structure
   - Verify contact_phone field exists

## 🔧 EXPECTED BEHAVIOR:
- ✅ New land listings should show phone numbers
- ✅ Console should show contact_phone field in data
- ✅ Phone numbers should appear on land cards 