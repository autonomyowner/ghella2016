# Nurseries Form Simplified - Test Guide

## ✅ CHANGES APPLIED:

### 1. Removed Fields from Form
- **Removed:** "اسم النبات" (Plant Name)
- **Removed:** "الحجم" (Size) 
- **Removed:** "العمر (بالأشهر)" (Age in Months)
- **Removed:** "الموسم" (Season)
- **Removed:** "الحالة الصحية" (Health Status)
- **Removed:** "تعليمات العناية" (Care Instructions)

### 2. Updated Form State
- **Removed from formData:**
  - `plant_name: ''`
  - `age_months: ''`
  - `size: 'medium'`
  - `health_status: ''`
  - `care_instructions: ''`
  - `seasonality: 'all_year'`

### 3. Updated Submit Function
- **Removed from nurseryData:**
  - `age_months: formData.age_months ? parseInt(formData.age_months) : null`

## 🧪 TEST STEPS:

1. **Go to Nurseries Form** (`/nurseries/new`)
2. **Check Form Fields:**
   - ✅ Should show: title, plant_type, price, currency, quantity, location, pot_size, description, images
   - ✅ Should NOT show: plant_name, size, age_months, season, health_status, care_instructions

3. **Test Form Submission:**
   - ✅ Fill out the simplified form
   - ✅ Submit the form
   - ✅ Should work without errors
   - ✅ Should show success message and redirect

## 🚨 EXPECTED BEHAVIOR:
- ✅ Form is much simpler and cleaner
- ✅ No technical specification fields visible
- ✅ Form submission works correctly
- ✅ Success message and navigation work
- ✅ No TypeScript errors

## 🔧 TECHNICAL DETAILS:
- **Removed Fields:** Plant Name, Size, Age, Season, Health Status, Care Instructions
- **Form Flow:** Title → Plant Type → Price → Currency → Quantity → Location → Pot Size → Description → Images
- **Database:** Nursery data sent without removed fields
- **Simplified Form:** Focuses on essential information only 