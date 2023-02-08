// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";
import "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDioVDR6uuK5w-FOeqguLRT1XzORcSwB8I",
  authDomain: "note-app-c3ee7.firebaseapp.com",
  projectId: "note-app-c3ee7",
  storageBucket: "note-app-c3ee7.appspot.com",
  messagingSenderId: "467224743325",
  appId: "1:467224743325:web:9db26e956a5eed2e577374",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth();
auth.languageCode = "es";
const provider = new GoogleAuthProvider();

const db = getFirestore(app);

export { auth, provider, db };
