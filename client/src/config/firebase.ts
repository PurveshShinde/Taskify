import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD6tAl9khwabDHAYGEivH_36eqSJu9iKAY",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "taskify-c8e0a.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "taskify-c8e0a",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "taskify-c8e0a.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "113253747090",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:113253747090:web:e36f6bb80f669a3e7b994b"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
