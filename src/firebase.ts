import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAhDj_OTd2S5m-EE9Lbo3I5BC5_iV_h_AQ",
  authDomain: "app-caseirinho-da-de.firebaseapp.com",
  projectId: "app-caseirinho-da-de",
  storageBucket: "app-caseirinho-da-de.firebasestorage.app",
  messagingSenderId: "559520513190",
  appId: "1:559520513190:web:0d3c984b2fb681ad2fc867",
  measurementId: "G-MF3YXV5J24"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export let analytics: any = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      try {
        analytics = getAnalytics(app);
      } catch (e) {
        console.warn("Analytics not initialized:", e);
      }
    }
  }).catch(() => {});
}

