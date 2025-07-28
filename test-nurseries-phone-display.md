# Nurseries Phone Display Test Guide

## 🔍 TESTING STEPS:

### 1. Check Nurseries Form
- ✅ Go to `/nurseries/new`
- ✅ Verify phone number field exists
- ✅ Create new nursery with phone number
- ✅ Submit the form

### 2. Check Nurseries Cards
- ✅ Go to `/nurseries` page
- ✅ Look for phone number on nursery cards
- ✅ Check if new nursery shows phone number
- ✅ Compare with existing nurseries

### 3. Check Database
- ✅ Verify `contact_phone` column exists in `nurseries` table
- ✅ Check if new nursery has phone number saved

## 🚨 POSSIBLE ISSUES:

### Issue 1: Database Column Missing
- **Check:** Run SQL query to verify column exists
- **Solution:** Add `contact_phone` column if missing

### Issue 2: Existing Records
- **Problem:** Old nursery records don't have phone numbers
- **Solution:** Create new listings or update existing ones

### Issue 3: TypeScript Types
- **Problem:** Nursery type doesn't include contact_phone
- **Solution:** Update database types

## 🧪 QUICK TESTS:

1. **Database Test:**
   ```sql
   SELECT id, contact_phone FROM nurseries LIMIT 5;
   ```

2. **New Nursery Test:**
   - Create new nursery with phone
   - Check if phone appears on cards

3. **Console Debug:**
   - Check nursery data structure
   - Verify contact_phone field exists

## 🔧 EXPECTED BEHAVIOR:
- ✅ New nurseries should show phone numbers
- ✅ Phone numbers should appear on nursery cards
- ✅ Form should save contact_phone field 