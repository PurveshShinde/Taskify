import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSy_DEV_PLACEHOLDER_KEY",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "taskify.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "taskify",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "taskify.appspot.com",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1234567890:web:dummy"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
