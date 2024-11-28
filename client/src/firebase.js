// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { useEffect } from "react";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,

  
  authDomain: "webblog-e7132.firebaseapp.com",
  projectId: "webblog-e7132",
  storageBucket: "webblog-e7132.firebasestorage.app",
  messagingSenderId: "55499937470",
  appId: "1:55499937470:web:d8d76dbab5ecc33576f0ef"
};




// Initialize Firebase
export const app = initializeApp(firebaseConfig);
