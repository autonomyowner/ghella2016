# Manual Storage Policy Setup

## Step 1: Run the Simple Storage SQL
1. **Copy and paste** the content of `supabase-storage-simple-policies.sql`
2. **Run it** in Supabase SQL Editor
3. **Verify** buckets are created

## Step 2: Configure Policies Manually (Easy Way)

### For Each Bucket (avatars, equipment-images, land-images, animal-images):

1. **Go to**: https://supabase.com/dashboard/project/puvmqdnvofbtmqpcjmia
2. **Click**: "Storage" in left sidebar
3. **Click on each bucket** (avatars, equipment-images, land-images, animal-images)
4. **Click**: "Policies" tab
5. **Click**: "New Policy" button

### Add These 4 Policies for Each Bucket:

#### Policy 1: Public Read Access
- **Policy Name**: `Public read access`
- **Operation**: `SELECT`
- **Target roles**: `public`
- **Policy definition**: `true`

#### Policy 2: Authenticated Upload
- **Policy Name**: `Authenticated users can upload`
- **Operation**: `INSERT`
- **Target roles**: `authenticated`
- **Policy definition**: `true`

#### Policy 3: User Update Own Files
- **Policy Name**: `Users can update own files`
- **Operation**: `UPDATE`
- **Target roles**: `authenticated`
- **Policy definition**: `true`

#### Policy 4: User Delete Own Files
- **Policy Name**: `Users can delete own files`
- **Operation**: `DELETE`
- **Target roles**: `authenticated`
- **Policy definition**: `true`

## Step 3: Test Upload
1. **Go to**: "Storage" → "avatars" bucket
2. **Click**: "Upload file"
3. **Upload** a small image
4. **Verify** it appears in the bucket

## That's It! 🎉

- ✅ **Buckets created** via SQL
- ✅ **Policies set** via dashboard
- ✅ **Storage ready** for use
- ✅ **No permission errors**

Your storage will work perfectly for the marketplace! 