import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database"; // Realtime Database er jonno

const firebaseConfig = {
  apiKey: "AIzaSyDtHCRPOxdMk-HZ86ThD2SNI3jYS2lNGnE",
  authDomain: "e-commerce-fb419.firebaseapp.com",
  databaseURL: "https://e-commerce-fb419-default-rtdb.firebaseio.com",
  projectId: "e-commerce-fb419",
  storageBucket: "e-commerce-fb419.firebasestorage.app",
  messagingSenderId: "1082288136535",
  appId: "1:1082288136535:web:bb47d050b3866541335e12",
  measurementId: "G-SCJSWCFP8Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services export
export const auth = getAuth(app); 
export const db = getDatabase(app); // Eita oboshshoi getDatabase hote hobe

export default app;