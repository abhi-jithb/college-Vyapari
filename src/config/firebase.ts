import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
// Replace these with your actual Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyCkhkllvFJ0Uw6wErb8XdU4FFir2Vzdws8",
    authDomain: "collegevyapari.firebaseapp.com",
    projectId: "collegevyapari",
    storageBucket: "collegevyapari.firebasestorage.app",
    messagingSenderId: "321846951816",
    appId: "1:321846951816:web:e338f4a95da1d0a86f443d",
    measurementId: "G-7WF2Z3WC4C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
