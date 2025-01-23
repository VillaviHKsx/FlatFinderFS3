// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuración obtenida de Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyBAN-QXy8emHlf_O-EivhLCO2GELQ8e4vM",
    authDomain: "flatfinderfs3.firebaseapp.com",
    projectId: "flatfinderfs3",
    cstorageBucket: "flatfinderfs3.firebasestorage.app",
    messagingSenderId: "42913690676",
    appId: "1:42913690676:web:c6ba9d9b0928a46c390661",
    measurementId: "G-G299SSG593"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);