// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAYss9qGYLIVbKH749UIqmgkGVT9aqwK0s",
  authDomain: "csc-2053-find-a-friend.firebaseapp.com",
  projectId: "csc-2053-find-a-friend",
  storageBucket: "csc-2053-find-a-friend.firebasestorage.app",
  messagingSenderId: "894407990666",
  appId: "1:894407990666:web:af9985872f3ce135c1bc73"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);     //  Firestore
export const auth = getAuth(app);        //  Authetication