# 🔥 Firebase Setup Guide - Fix Configuration Error

## ❌ Current Issue
You're getting "Firebase: Error (auth/configuration-not-found)" because the Firebase project "gheella" doesn't exist or isn't properly configured.

## ✅ Solution: Create New Firebase Project

### Step 1: Create Firebase Project

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Click "Create a project"** or "Add project"
3. **Enter project name**: `elghella-marketplace` (or any name you prefer)
4. **Enable Google Analytics** (optional): Choose "Enable" or "Don't enable"
5. **Click "Create project"**

### Step 2: Get Firebase Configuration

1. **In your new project dashboard**, click the gear icon ⚙️ next to "Project Overview"
2. **Select "Project settings"**
3. **Scroll down to "Your apps"** section
4. **Click the web icon** (</>) to add a web app
5. **Enter app nickname**: `elghella-web`
6. **Click "Register app"**
7. **Copy the configuration object** that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

### Step 3: Update Environment Variables

Replace your `.env.local` file with the new configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Step 4: Enable Authentication

1. **In Firebase Console**, go to "Authentication" in the left sidebar
2. **Click "Get started"**
3. **Go to "Sign-in method"** tab
4. **Click "Email/Password"**
5. **Enable it** and click "Save"

### Step 5: Create Firestore Database

1. **In Firebase Console**, go to "Firestore Database" in the left sidebar
2. **Click "Create database"**
3. **Choose "Start in test mode"** (we'll add security rules later)
4. **Select a location** (choose closest to your users)
5. **Click "Done"**

### Step 6: Set Up Storage

1. **In Firebase Console**, go to "Storage" in the left sidebar
2. **Click "Get started"**
3. **Choose "Start in test mode"**
4. **Select a location** (same as Firestore)
5. **Click "Done"**

## 🔧 Alternative: Use Firebase CLI (Recommended)

### Install Firebase CLI
```bash
npm install -g firebase-tools
```

### Login to Firebase
```bash
firebase login
```

### Initialize Firebase in your project
```bash
firebase init
```

Select:
- Firestore
- Authentication
- Storage
- Hosting (optional)

This will automatically configure your project with the correct settings.

## 🧪 Test Your Setup

### 1. Restart Development Server
```bash
npm run dev
```

### 2. Test Authentication
Visit: `http://localhost:3000/auth/signup`

### 3. Check Browser Console
Open browser dev tools and look for any Firebase errors.

## 🔐 Security Rules Setup

### Firestore Rules
Go to Firestore Database → Rules and add:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Profiles - users can read/write their own profile
    match /profiles/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Equipment - users can read all, write their own
    match /equipment/{equipmentId} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.auth.uid == resource.data.user_id;
    }
    
    // Land listings - users can read all, write their own
    match /land_listings/{landId} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.auth.uid == resource.data.user_id;
    }
    
    // Categories - read only
    match /categories/{categoryId} {
      allow read: if true;
    }
  }
}
```

### Storage Rules
Go to Storage → Rules and add:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 🐛 Troubleshooting

### Common Issues:

1. **"Configuration not found"**
   - Check that your `.env.local` file has the correct values
   - Make sure the Firebase project exists
   - Restart your development server

2. **"Permission denied"**
   - Set up security rules in Firebase Console
   - Make sure Authentication is enabled

3. **"Project not found"**
   - Verify the project ID in your environment variables
   - Check that you're using the correct Firebase project

### Debug Commands:
```javascript
// Add this to any page to test Firebase connection
import { firestore } from '@/lib/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const testFirebase = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestore, 'test'));
    console.log('✅ Firebase connected successfully!');
  } catch (error) {
    console.error('❌ Firebase error:', error);
  }
};

testFirebase();
```

## 🎉 Success!

Once you've completed these steps, your Firebase configuration should work properly and you'll be able to create accounts and use all the features of your Elghella marketplace!

**Next Steps:**
1. Create the Firebase project
2. Update your `.env.local` file
3. Enable Authentication and Firestore
4. Test the signup functionality
5. Add sample data to your collections 