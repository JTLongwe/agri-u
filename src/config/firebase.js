import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyB7nCKM8h5EAv9oHXK9ja_YqnmBSsuJ7x8",
    authDomain: "agri-u.firebaseapp.com",
    projectId: "agri-u",
    storageBucket: "agri-u.firebasestorage.app",
    messagingSenderId: "207554586827",
    appId: "1:207554586827:web:948736872ea70fbe92934e",
    measurementId: "G-DV6BJ8875K"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
        console.warn('Multiple tabs open, offline persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
        console.warn('The current browser does not support all of the features required to enable offline persistence.');
    }
});

export default app;
