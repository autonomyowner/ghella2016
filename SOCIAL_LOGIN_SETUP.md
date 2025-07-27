# Social Login Setup Guide

This guide will help you configure Google and Facebook OAuth authentication in your Supabase project.

## Prerequisites

- A Supabase project
- Google Cloud Console account
- Facebook Developer account

## 1. Google OAuth Setup

### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     ```
     https://your-project.supabase.co/auth/v1/callback
     http://localhost:3000/auth/callback (for development)
     ```
5. Copy the Client ID and Client Secret

### Step 2: Configure Supabase

1. Go to your Supabase project dashboard
2. Navigate to "Authentication" > "Providers"
3. Find "Google" and click "Edit"
4. Enable Google provider
5. Enter your Google Client ID and Client Secret
6. Save the configuration

## 2. Facebook OAuth Setup

### Step 1: Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "Create App"
3. Choose "Consumer" app type
4. Fill in the app details
5. Add Facebook Login product to your app

### Step 2: Configure Facebook Login

1. In your Facebook app dashboard, go to "Facebook Login" > "Settings"
2. Add Valid OAuth Redirect URIs:
   ```
   https://your-project.supabase.co/auth/v1/callback
   http://localhost:3000/auth/callback (for development)
   ```
3. Copy the App ID and App Secret

### Step 3: Configure Supabase

1. Go to your Supabase project dashboard
2. Navigate to "Authentication" > "Providers"
3. Find "Facebook" and click "Edit"
4. Enable Facebook provider
5. Enter your Facebook App ID and App Secret
6. Save the configuration

## 3. Environment Variables

Add these to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 4. Testing

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Go to `/auth/login` or `/auth/signup`
3. Click on Google or Facebook buttons
4. Complete the OAuth flow
5. You should be redirected to `/auth/callback` and then to `/dashboard`

## 5. Troubleshooting

### Common Issues:

1. **"Invalid redirect URI" error**:
   - Make sure the redirect URI in your OAuth provider matches exactly
   - Check that you're using the correct Supabase project URL

2. **"App not configured" error**:
   - Ensure your Facebook app is in "Live" mode
   - Add your domain to the allowed domains in Facebook app settings

3. **"Client ID not found" error**:
   - Verify your Google Client ID is correct
   - Make sure the Google+ API is enabled

4. **Callback not working**:
   - Check that the `/auth/callback` route exists
   - Verify the redirect URL in Supabase matches your callback URL

### Debug Steps:

1. Check browser console for errors
2. Verify Supabase logs in the dashboard
3. Test with a simple OAuth flow first
4. Ensure all environment variables are set correctly

## 6. Production Deployment

For production deployment:

1. Update redirect URIs in both Google and Facebook apps to use your production domain
2. Update Supabase site URL in Authentication settings
3. Test the complete flow in production environment

## 7. Security Considerations

1. Never commit OAuth secrets to version control
2. Use environment variables for all sensitive data
3. Regularly rotate OAuth credentials
4. Monitor OAuth usage and logs
5. Implement proper error handling

## 8. Additional Features

You can enhance the social login experience by:

1. Adding profile picture and name from social providers
2. Implementing account linking
3. Adding social login to existing accounts
4. Customizing the OAuth flow with additional scopes

## Support

If you encounter issues:

1. Check Supabase documentation: https://supabase.com/docs/guides/auth/social-login
2. Review Google OAuth documentation: https://developers.google.com/identity/protocols/oauth2
3. Review Facebook OAuth documentation: https://developers.facebook.com/docs/facebook-login
4. Check Supabase community forums for similar issues 