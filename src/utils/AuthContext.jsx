import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { auth } from '../config/firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser({
                    uid: currentUser.uid,
                    email: currentUser.email,
                    name: currentUser.displayName || 'Farmer'
                });
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Helper for demo purposes: We'll register an anonymous-like email if they just provide a name,
    // or actually do email/pass if built out. For your demo, if they input "Farmer Jo", 
    // we'll abstract a Firebase login so it functions properly across devices.
    const login = async (name) => {
        const email = `${name.toLowerCase().replace(/\s/g, '')}@agriu.demo`;
        const password = 'password123'; // Demo fallback

        try {
            // Try to login
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            setUser({ uid: userCredential.user.uid, email, name });
        } catch (error) {
            // If doesn't exist, create it on the fly for the pristine demo UX
            if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
                const newCred = await createUserWithEmailAndPassword(auth, email, password);
                await updateProfile(newCred.user, { displayName: name });
                setUser({ uid: newCred.user.uid, email, name });
            } else {
                console.error("Firebase Auth Error:", error);
            }
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
        } catch (error) {
            console.error('Logout error', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
