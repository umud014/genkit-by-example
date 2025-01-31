// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAnalytics,
  logEvent as analyticsLogEvent,
  Analytics,
  setUserId,
} from "firebase/analytics";
import {
  indexedDBLocalPersistence,
  initializeAuth,
  onAuthStateChanged,
  signInAnonymously,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBHg4Y_CEMBU7aaxrO19Y1NsvUXiVeiGfo",
  authDomain: "genkit-by-example.firebaseapp.com",
  projectId: "genkit-by-example",
  storageBucket: "genkit-by-example.firebasestorage.app",
  messagingSenderId: "515443902134",
  appId: "1:515443902134:web:ce23c3419ffbc81b240817",
  measurementId: "G-PVQ062HLN2",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

let analytics: Analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}
export function logEvent(name: string, props: Record<string, any>) {
  if (!analytics) analytics = getAnalytics(app);
  analyticsLogEvent(analytics, name, props);
}
export function setCurrentScreen(name: string) {
  if (!analytics) analytics = getAnalytics(app);
}

export const auth = initializeAuth(app, {
  persistence: [indexedDBLocalPersistence],
});
export const db = getFirestore();

onAuthStateChanged(auth, (user) => {
  if (!user) return signInAnonymously(auth);

  if (typeof window !== "undefined") {
    setUserId(getAnalytics(app), user.uid);
  }
});
