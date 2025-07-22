import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);

// Connect to emulators in development (optional - helps with free plan limits)
if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_EMULATOR === 'true') {
  try {
    connectFirestoreEmulator(firestore, 'localhost', 8080);
    connectStorageEmulator(storage, 'localhost', 9199);
  } catch (error) {
    console.log('Emulators already connected or not available');
  }
}

// Export the app instance for other uses
export default app;

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
