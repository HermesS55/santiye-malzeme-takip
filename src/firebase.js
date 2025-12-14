import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA85Iutnv1TrxF43nwzeuQ5oDHj4f25BdM",
  authDomain: "malzeme-takip-2.firebaseapp.com",
  projectId: "malzeme-takip-2",
  storageBucket: "malzeme-takip-2.firebasestorage.app",
  messagingSenderId: "275808105363",
  appId: "1:275808105363:web:873fd447e024b2309a2e66"
};

// Uygulamayı başlat
const app = initializeApp(firebaseConfig);


// Auth ve Firestore'u hazırla
export const auth = getAuth(app);
export const db = getFirestore(app);
