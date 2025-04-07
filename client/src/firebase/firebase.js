import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD7bbCysr17KxWBxXUE_PRiOZkOYfaQvoI",
  authDomain: "library-e9c99.firebaseapp.com",
  projectId: "library-e9c99",
  storageBucket: "library-e9c99.appspot.com", // ← виправлено!
  messagingSenderId: "606902163540",
  appId: "1:606902163540:web:41db73af561ee6f9c4b5c1",
  measurementId: "G-DXR47ZY34C"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);