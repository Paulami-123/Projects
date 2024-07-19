// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "blog-project-ad235.firebaseapp.com",
  projectId: "blog-project-ad235",
  storageBucket: "blog-project-ad235.appspot.com",
  messagingSenderId: "280385270925",
  appId: "1:280385270925:web:9625751b5443fbed3b5ec4"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);