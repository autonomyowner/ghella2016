# Storage Setup Guide for Elghella Marketplace

## Step 1: Create Storage Buckets Manually

1. **Go to**: https://supabase.com/dashboard/project/puvmqdnvofbtmqpcjmia
2. **Click**: "Storage" in the left sidebar
3. **Click**: "New bucket" button

### Create these 4 buckets:

#### 1. Avatars Bucket
- **Name**: `avatars`
- **Public bucket**: ✅ Checked
- **File size limit**: `5 MB`
- **Allowed MIME types**: `image/jpeg, image/png, image/webp`

#### 2. Equipment Images Bucket
- **Name**: `equipment-images`
- **Public bucket**: ✅ Checked
- **File size limit**: `10 MB`
- **Allowed MIME types**: `image/jpeg, image/png, image/webp`

#### 3. Land Images Bucket
- **Name**: `land-images`
- **Public bucket**: ✅ Checked
- **File size limit**: `10 MB`
- **Allowed MIME types**: `image/jpeg, image/png, image/webp`

#### 4. Animal Images Bucket
- **Name**: `animal-images`
- **Public bucket**: ✅ Checked
- **File size limit**: `10 MB`
- **Allowed MIME types**: `image/jpeg, image/png, image/webp`

## Step 2: Configure Storage Policies

For each bucket, click on it and go to the "Policies" tab, then add these policies:

### For All Buckets:

#### 1. Public Read Access
- **Policy Name**: `Public read access`
- **Operation**: `SELECT`
- **Target roles**: `public`
- **Policy definition**: `true`

#### 2. Authenticated Upload
- **Policy Name**: `Authenticated users can upload`
- **Operation**: `INSERT`
- **Target roles**: `authenticated`
- **Policy definition**: `auth.uid()::text = (storage.foldername(name))[1]`

#### 3. User Update Own Files
- **Policy Name**: `Users can update own files`
- **Operation**: `UPDATE`
- **Target roles**: `authenticated`
- **Policy definition**: `auth.uid()::text = (storage.foldername(name))[1]`

#### 4. User Delete Own Files
- **Policy Name**: `Users can delete own files`
- **Operation**: `DELETE`
- **Target roles**: `authenticated`
- **Policy definition**: `auth.uid()::text = (storage.foldername(name))[1]`

## Step 3: Test the Setup

After creating all buckets and policies:

1. **Go to**: "Storage" → "avatars" bucket
2. **Click**: "Upload file" to test upload functionality
3. **Try uploading** a small image file
4. **Check if it appears** in the bucket

## Troubleshooting

### If you get permission errors:
- Make sure you're logged in as the project owner
- Check that RLS is enabled on storage.objects
- Verify the policy definitions are correct

### If uploads fail:
- Check the file size is within limits
- Verify the file type is allowed
- Make sure the user is authenticated

## Next Steps

Once storage is set up:
1. Test user registration again
2. Try uploading profile pictures
3. Test equipment/land image uploads

The 500 error should be resolved once the database and storage are properly configured! 