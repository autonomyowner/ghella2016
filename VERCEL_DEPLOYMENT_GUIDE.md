# Vercel Deployment Guide - Environment Variables

## Required Environment Variables

To fix the Firebase API key error and other issues, you need to set up the following environment variables in your Vercel project:

### Firebase Configuration
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Supabase Configuration (Optional - if using Supabase)
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## How to Set Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add each variable with the correct name and value
5. Make sure to select the correct environment (Production, Preview, Development)
6. Redeploy your application

## Getting Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings (gear icon)
4. Scroll down to "Your apps" section
5. Click on the web app or create a new one
6. Copy the configuration values

## Testing the Fix

After setting up the environment variables:

1. Redeploy your application in Vercel
2. Check the browser console for any remaining errors
3. Verify that the Firebase error is resolved
4. Test the functionality of your application

## Common Issues and Solutions

### Firebase API Key Error
- **Cause**: Missing or incorrect Firebase environment variables
- **Solution**: Ensure all Firebase environment variables are set correctly in Vercel

### Multiple GoTrueClient Instances
- **Cause**: Multiple Supabase client initializations
- **Solution**: Fixed with singleton pattern in supabaseClient.ts

### 404 Errors for /terms, /privacy, /help
- **Cause**: Missing pages
- **Solution**: Created the missing pages in the app directory

### Performance Issues (CLS, LCP)
- **Cause**: Heavy preloading and layout shifts
- **Solution**: Optimized preload links and improved layout structure

## Performance Optimizations Applied

1. **Reduced Preload Links**: Removed unnecessary preload links that were causing performance issues
2. **Fixed MIME Types**: Added proper Content-Type headers for CSS files
3. **Singleton Pattern**: Implemented for Supabase client to prevent multiple instances
4. **Firebase Validation**: Added proper validation for Firebase configuration
5. **Error Handling**: Added graceful fallbacks for when services are unavailable

## Monitoring

After deployment, monitor:
- Browser console for any remaining errors
- Performance metrics (LCP, CLS, FID)
- User feedback and reported issues
- Firebase and Supabase usage statistics 