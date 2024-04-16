import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDomXSwwidQ9GHgIgpG2txIglCBpsvMyn0",
  authDomain: "remedber.firebaseapp.com",
  projectId: "remedber",
  storageBucket: "remedber.appspot.com",
  messagingSenderId: "1034156103991",
  appId: "1:1034156103991:web:d845aa61ecbc94af4c22b2"
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);