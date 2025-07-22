import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// Validate environment variables
const validateFirebaseConfig = () => {
  const requiredVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn('Missing Firebase environment variables:', missingVars);
    return false;
  }
  
  return true;
};

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || '',
};

// Only initialize Firebase if we have valid configuration
let app: any = null;
let auth: any = null;
let firestore: any = null;
let storage: any = null;

if (validateFirebaseConfig() && firebaseConfig.apiKey) {
  try {
    // Initialize Firebase
    app = initializeApp(firebaseConfig);
    
    // Initialize Firebase services
    auth = getAuth(app);
    firestore = getFirestore(app);
    storage = getStorage(app);

    // Connect to emulators in development (optional - helps with free plan limits)
    if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_EMULATOR === 'true') {
      try {
        connectFirestoreEmulator(firestore, 'localhost', 8080);
        connectStorageEmulator(storage, 'localhost', 9199);
      } catch (error) {
        console.log('Emulators already connected or not available');
      }
    }
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
  }
} else {
  console.warn('Firebase not initialized due to missing configuration');
}

// Export the app instance for other uses
export default app;

// Export services with null checks
export { auth, firestore, storage };

// Free plan optimization helpers
export const FREE_PLAN_LIMITS = {
  FIRESTORE_READS_PER_DAY: 50000,
  FIRESTORE_WRITES_PER_DAY: 20000,
  STORAGE_DOWNLOADS_PER_DAY: 1024 * 1024 * 1024, // 1GB
  STORAGE_TOTAL: 5 * 1024 * 1024 * 1024, // 5GB
};

// Cache management for free plan
export const createOptimizedFirestore = () => {
  const cache = new Map();
  const readCount = { count: 0, lastReset: Date.now() };
  const writeCount = { count: 0, lastReset: Date.now() };

  // Reset counters daily
  const resetCounters = () => {
    const now = Date.now();
    const dayInMs = 24 * 60 * 60 * 1000;
    
    if (now - readCount.lastReset > dayInMs) {
      readCount.count = 0;
      readCount.lastReset = now;
    }
    
    if (now - writeCount.lastReset > dayInMs) {
      writeCount.count = 0;
      writeCount.lastReset = now;
    }
  };

  return {
    firestore,
    cache,
    readCount,
    writeCount,
    resetCounters,
    isWithinLimits: () => {
      resetCounters();
      return readCount.count < FREE_PLAN_LIMITS.FIRESTORE_READS_PER_DAY && 
             writeCount.count < FREE_PLAN_LIMITS.FIRESTORE_WRITES_PER_DAY;
    }
  };
};

// Helper function to check if Firebase is available
export const isFirebaseAvailable = () => {
  return app !== null && auth !== null && firestore !== null && storage !== null;
};
