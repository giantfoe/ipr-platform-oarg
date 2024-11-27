import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: "AIzaSyCPZcir96csJZ86HmViItNG_exJqPVgCao",
  authDomain: "ipr-launch.firebaseapp.com",
  projectId: "ipr-launch",
  storageBucket: "ipr-launch.firebasestorage.app",
  messagingSenderId: "217634677518",
  appId: "1:217634677518:web:e13e4d2e768a2b310dad5f",
  measurementId: "G-GZWKCE9B2D"
}

// Initialize Firebase
let analytics;
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Only initialize analytics on the client side
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

const db = getFirestore(app)
const storage = getStorage(app)

export { app, db, storage, analytics } 