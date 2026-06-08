import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAVfCIkS9YSR8QbpBog4AyM-CnqTm26ZUY",
  authDomain: "jesus-finance-app.firebaseapp.com",
  projectId: "jesus-finance-app",
  storageBucket: "jesus-finance-app.firebasestorage.app",
  messagingSenderId: "106046434937",
  appId: "1:106046434937:web:3446b006d0cf66f1292ea8"
};

const app      = initializeApp(firebaseConfig);
export const auth     = getAuth(app);
export const db       = getFirestore(app);
export const provider = new GoogleAuthProvider();

// Persistencia offline — guarda datos localmente cuando no hay internet
// Al volver la conexión sincroniza automáticamente con Firebase
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Persistencia offline no disponible: múltiples pestañas abiertas');
  } else if (err.code === 'unimplemented') {
    console.warn('Este navegador no soporta persistencia offline');
  }
});
