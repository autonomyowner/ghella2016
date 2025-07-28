# Land Phone Field Replacement - Test Guide

## ✅ CHANGES APPLIED:

### 1. Updated Form State
- **Before:** `soil_type: ''` (Soil Type)
- **After:** `contact_phone: ''` (Contact Phone)

### 2. Updated Form Field
- **Before:** "نوع التربة" (Soil Type) with text input
- **After:** "رقم الهاتف" (Phone Number) with tel input

### 3. Field Changes
- **Label:** Changed from "نوع التربة" to "رقم الهاتف"
- **Input Type:** Changed from `type="text"` to `type="tel"`
- **Name:** Changed from `name="soil_type"` to `name="contact_phone"`
- **Value:** Changed from `formData.soil_type` to `formData.contact_phone`
- **Placeholder:** Changed from "مثال: تربة طينية خصبة" to "مثال: 0770123456"

### 4. Updated Submit Function
- **Before:** `soil_type: formData.soil_type || null`
- **After:** `contact_phone: formData.contact_phone || null`

## 🧪 TEST STEPS:

1. **Go to Land Form** (`/land/new`)
2. **Check Phone Field:**
   - ✅ Should show "رقم الهاتف" label
   - ✅ Should have tel input type
   - ✅ Should have placeholder "مثال: 0770123456"
   - ✅ Should NOT show "نوع التربة" anymore

3. **Test Phone Input:**
   - ✅ Enter a phone number (e.g., 0770123456)
   - ✅ Should accept phone number format
   - ✅ Should work with form submission

4. **Test Form Submission:**
   - ✅ Fill out the form including phone number
   - ✅ Submit the form
   - ✅ Should work without errors

## 🚨 EXPECTED BEHAVIOR:
- ✅ Phone field replaces soil type field
- ✅ Phone input has proper tel type
- ✅ Form submission includes phone number
- ✅ No TypeScript errors
- ✅ Mobile keyboards show number pad for phone field

## 🔧 TECHNICAL DETAILS:
- **Field Type:** `tel` input for better mobile experience
- **Database:** Phone number will be stored as `contact_phone`
- **Validation:** Basic phone number input (no strict validation)
- **Placeholder:** Algerian phone number format example
- **Position:** Replaces the soil type field in the form 