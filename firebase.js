import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
    apiKey: "AIzaSyBzZJWduh-3JL1ocRqjwkyHFegIhLXGyMs",
    authDomain: "pantryproject-fc5e8.firebaseapp.com",
    projectId: "pantryproject-fc5e8",
    storageBucket: "pantryproject-fc5e8.appspot.com",
    messagingSenderId: "555160869224",
    appId: "1:555160869224:web:5222b4af3a2580c3945edd",
    measurementId: "G-GKXHDSY21F"
  };
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { firestore };