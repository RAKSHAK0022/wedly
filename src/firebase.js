import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAiz9gWTZiYO3rHL2ozJOPj4zCYpuivhis",
  authDomain: "wedly-725cf.firebaseapp.com",
  projectId: "wedly-725cf",
  storageBucket: "wedly-725cf.appspot.com",
  messagingSenderId: "581222936902",
  appId: "1:581222936902:web:ff472afb1742c29b473547"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // ✅ important