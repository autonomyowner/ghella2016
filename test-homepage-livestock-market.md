# Homepage Livestock Market Bubble Update - Test Guide

## ✅ CHANGES APPLIED:

### 1. Updated Bubble 10
- **Before:** "السوق" with store icon (🏪) linking to `/marketplace`
- **After:** "سوق المواشي" with cow icon (🐄) linking to `/animals`

### 2. Visual Changes
- **Icon:** Changed from store emoji (🏪) to cow emoji (🐄)
- **Text:** Changed from "السوق" to "سوق المواشي"
- **Link:** Changed from `/marketplace` to `/animals`
- **Color:** Maintained red gradient styling

## 🧪 TEST STEPS:

1. **Go to Homepage** (`/`)
2. **Find Bubble 10** - Should be the last bubble in the grid
3. **Check Visual Changes:**
   - ✅ Should show cow icon (🐄) instead of store icon (🏪)
   - ✅ Should display "سوق المواشي" text
   - ✅ Should have red gradient background

4. **Test Navigation:**
   - ✅ Click the bubble - should navigate to `/animals`
   - ✅ Should take you to the animals/livestock marketplace

## 🚨 EXPECTED BEHAVIOR:
- ✅ Bubble shows cow icon and "سوق المواشي" text
- ✅ Clicking takes you to the animals marketplace
- ✅ Maintains hover effects and styling
- ✅ Fits well with other marketplace bubbles

## 🔧 TECHNICAL DETAILS:
- **Icon:** 🐄 (cow emoji) - represents livestock
- **Link Target:** `/animals` (animals marketplace)
- **Styling:** Red gradient background maintained
- **Position:** Last bubble in the homepage grid 