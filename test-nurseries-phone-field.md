# Nurseries Phone Field Replacement - Test Guide

## ✅ CHANGES APPLIED:

### 1. Updated Form State
- **Before:** `pot_size: ''` (Pot Size)
- **After:** `contact_phone: ''` (Contact Phone)

### 2. Updated Form Field
- **Before:** "حجم الوعاء" (Pot Size) with text input
- **After:** "رقم الهاتف" (Phone Number) with tel input

### 3. Field Changes
- **Label:** Changed from "حجم الوعاء" to "رقم الهاتف"
- **Input Type:** Changed from `type="text"` to `type="tel"`
- **Name:** Changed from `name="pot_size"` to `name="contact_phone"`
- **Value:** Changed from `formData.pot_size` to `formData.contact_phone`
- **Placeholder:** Changed from "مثال: 20 سم" to "مثال: 0770123456"

## 🧪 TEST STEPS:

1. **Go to Nurseries Form** (`/nurseries/new`)
2. **Check Phone Field:**
   - ✅ Should show "رقم الهاتف" label
   - ✅ Should have tel input type
   - ✅ Should have placeholder "مثال: 0770123456"
   - ✅ Should NOT show "حجم الوعاء" anymore

3. **Test Phone Input:**
   - ✅ Enter a phone number (e.g., 0770123456)
   - ✅ Should accept phone number format
   - ✅ Should work with form submission

4. **Test Form Submission:**
   - ✅ Fill out the form including phone number
   - ✅ Submit the form
   - ✅ Should work without errors

## 🚨 EXPECTED BEHAVIOR:
- ✅ Phone field replaces pot size field
- ✅ Phone input has proper tel type
- ✅ Form submission includes phone number
- ✅ No TypeScript errors
- ✅ Mobile keyboards show number pad for phone field

## 🔧 TECHNICAL DETAILS:
- **Field Type:** `tel` input for better mobile experience
- **Database:** Phone number will be stored as `contact_phone`
- **Validation:** Basic phone number input (no strict validation)
- **Placeholder:** Algerian phone number format example 