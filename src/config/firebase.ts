import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB0OriPkmhEtxnMIZBVF5-h-HcZjf2wev8",
  authDomain: "who-owes-who-6eb28.firebaseapp.com",
  projectId: "who-owes-who-6eb28",
  storageBucket: "who-owes-who-6eb28.firebasestorage.app",
  messagingSenderId: "392955532450",
  appId: "1:392955532450:web:56809150d897da6fa3b3fb"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);