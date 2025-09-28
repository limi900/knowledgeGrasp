// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDMh2vPISuVzBGZd6IB4ufOdTucOovjr9s",
  authDomain: "knowledgegrasp-63244.firebaseapp.com",
  projectId: "knowledgegrasp-63244",
  storageBucket: "knowledgegrasp-63244.firebasestorage.app",
  messagingSenderId: "278617136113",
  appId: "1:278617136113:web:c42d44f88483feaf9c8250",
  measurementId: "G-RRSLZB0JLE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// Export the app, analytics, and auth for use in other parts of your application
export { app, analytics, auth };
