# Vegetables Phone Display Test Guide

## 🔍 TESTING STEPS:

### 1. Check Vegetables Form
- ✅ Go to `/VAR/marketplace/new`
- ✅ Verify phone number field exists
- ✅ Create new vegetable with phone number
- ✅ Submit the form

### 2. Check Vegetables Cards
- ✅ Go to `/VAR/marketplace` page
- ✅ Look for phone number on vegetable cards
- ✅ Check if new vegetable shows phone number
- ✅ Compare with existing vegetables

### 3. Check Database
- ✅ Verify `contact_phone` column exists in `vegetables` table
- ✅ Check if new vegetable has phone number saved

## 🚨 POSSIBLE ISSUES:

### Issue 1: Database Column Missing
- **Check:** Run SQL query to verify column exists
- **Solution:** Add `contact_phone` column if missing

### Issue 2: Existing Records
- **Problem:** Old vegetable records don't have phone numbers
- **Solution:** Create new listings or update existing ones

### Issue 3: TypeScript Types
- **Problem:** Vegetable type doesn't include contact_phone
- **Solution:** Update database types

## 🧪 QUICK TESTS:

1. **Database Test:**
   ```sql
   SELECT id, contact_phone FROM vegetables LIMIT 5;
   ```

2. **New Vegetable Test:**
   - Create new vegetable with phone
   - Check if phone appears on cards

3. **Console Debug:**
   - Check vegetable data structure
   - Verify contact_phone field exists

## 🔧 EXPECTED BEHAVIOR:
- ✅ New vegetables should show phone numbers
- ✅ Phone numbers should appear on vegetable cards
- ✅ Form should save contact_phone field 