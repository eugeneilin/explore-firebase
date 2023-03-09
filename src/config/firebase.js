import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDciYa1u2aU3OWmenmGvnOj2WlJ_G8cf2Y',
  authDomain: 'explore-firebase-fc67b.firebaseapp.com',
  projectId: 'explore-firebase-fc67b',
  storageBucket: 'explore-firebase-fc67b.appspot.com',
  messagingSenderId: '819176441874',
  appId: '1:819176441874:web:15cabef897f65e74d570cb',
  measurementId: 'G-E6VJMG39Y4',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const storage = getStorage(app);
