import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Attempt to initialize with service account if variables exist, 
// otherwise fall back to applicationDefault (useful for cloud hosting like GCP/Render if set up correctly)
try {
    if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            }),
        });
        console.log('Firebase Admin initialized with Service Account');
    } else {
        admin.initializeApp({
            credential: admin.credential.applicationDefault(),
            projectId: process.env.FIREBASE_PROJECT_ID
        });
        console.log('Firebase Admin initialized with Application Default Credentials');
    }
} catch (error) {
    console.error('Firebase Admin initialization error', error);
}

export default admin;
