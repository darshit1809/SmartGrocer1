// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB4hd4fExtrkQx_r6pI0MyVwbUPuKRRsFk",
  authDomain: "smartgrocer-8b632.firebaseapp.com",
  projectId: "smartgrocer-8b632",
  storageBucket: "smartgrocer-8b632.firebasestorage.app",
  messagingSenderId: "1066511114120",
  appId: "1:1066511114120:web:65bf74e5af5e103184643d",
  measurementId: "G-NSPW40XR7F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);