# Equipment Phone Display Test Guide

## 🔍 TESTING STEPS:

### 1. Check Equipment Form
- ✅ Go to `/equipment/new`
- ✅ Verify phone number field exists
- ✅ Create new equipment with phone number
- ✅ Submit the form

### 2. Check Equipment Cards
- ✅ Go to `/equipment` page
- ✅ Look for phone number on equipment cards
- ✅ Check if new equipment shows phone number
- ✅ Compare with existing equipment

### 3. Check Database
- ✅ Verify `contact_phone` column exists in `equipment` table
- ✅ Check if new equipment has phone number saved

## 🚨 POSSIBLE ISSUES:

### Issue 1: Database Column Missing
- **Check:** Run SQL query to verify column exists
- **Solution:** Add `contact_phone` column if missing

### Issue 2: Existing Records
- **Problem:** Old equipment records don't have phone numbers
- **Solution:** Create new listings or update existing ones

### Issue 3: TypeScript Types
- **Problem:** Equipment type doesn't include contact_phone
- **Solution:** Update database types

## 🧪 QUICK TESTS:

1. **Database Test:**
   ```sql
   SELECT id, contact_phone FROM equipment LIMIT 5;
   ```

2. **New Equipment Test:**
   - Create new equipment with phone
   - Check if phone appears on cards

3. **Console Debug:**
   - Check equipment data structure
   - Verify contact_phone field exists

## 🔧 EXPECTED BEHAVIOR:
- ✅ New equipment should show phone numbers
- ✅ Phone numbers should appear on equipment cards
- ✅ Form should save contact_phone field 