import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getDatabase, Database } from 'firebase/database';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Official SK Pizza Point Firebase Project Configuration
export const firebaseConfig = {
  apiKey: "AIzaSyCCYR2QyIICr9wbS-P5X1m9860TSmmnHco",
  authDomain: "sk-pizza-point.firebaseapp.com",
  databaseURL: "https://sk-pizza-point-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "sk-pizza-point",
  storageBucket: "sk-pizza-point.firebasestorage.app",
  messagingSenderId: "336176195310",
  appId: "1:336176195310:web:07deae497aa7772e7535ff",
  measurementId: "G-2PCKS90TDV"
};

// Intended Administrator UID & Email for SK Pizza Point
export const AUTHORIZED_ADMIN_UID = "vxIlz4pYZgM646mXmp2BQuXtYz32";
export const AUTHORIZED_ADMIN_EMAIL = "skpizzapoint1@gmail.com";

// Initialize Firebase once
export const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Services
export const auth: Auth = getAuth(app);
export const rtdb: Database = getDatabase(app);
export const storage: FirebaseStorage = getStorage(app);

// Helper to check if a user is verified administrator
export const isUserAdmin = (uid?: string | null, email?: string | null): boolean => {
  // 1. Check if session passcode / admin override is unlocked
  if (typeof window !== 'undefined') {
    const sessionAuth = sessionStorage.getItem('skp_admin_authenticated');
    if (sessionAuth === 'true') return true;
  }
  
  // 2. Check UID match
  if (uid && uid.trim() === AUTHORIZED_ADMIN_UID.trim()) {
    return true;
  }
  
  // 3. Check official admin email match
  if (email && email.trim().toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
    return true;
  }

  // 4. Check if email is custom admin
  if (email && (email.toLowerCase().startsWith('admin@') || email.toLowerCase().includes('skpizzapoint'))) {
    return true;
  }

  return false;
};
