import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBXcvGIFyxcoayZ2UicOr08faCB4fTeLuA",
  authDomain: "whosetreat-bc6eb.firebaseapp.com",
  projectId: "whosetreat-bc6eb",
  storageBucket: "whosetreat-bc6eb.firebasestorage.app",
  messagingSenderId: "178391216090",
  appId: "1:178391216090:web:bde9050fb52774c576dae3"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);