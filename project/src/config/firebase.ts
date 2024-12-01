import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCM3Bijs_e0Ve5EkayspnR0zDg3FkBKT6I",
  authDomain: "legalpredictiq.firebaseapp.com",
  projectId: "legalpredictiq",
  storageBucket: "legalpredictiq.firebasestorage.app",
  messagingSenderId: "631428451853",
  appId: "1:631428451853:web:96bc17d64741bf54d3cf44",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);