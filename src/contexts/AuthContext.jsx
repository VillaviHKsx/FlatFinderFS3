import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebaseConfig'; // Configuración de Firebase
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const currentUser = userCredential.user;

      // Obtener datos adicionales del usuario desde Firestore
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid)); // 'users' es la colección
      const userData = userDoc.exists() ? userDoc.data() : {};

      setIsLoggedIn(true);
      setUser({
        fullName: `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
        email: currentUser.email,
        uid: currentUser.uid,
        ...userData,
      });

      localStorage.setItem('isLoggedIn', true);
      localStorage.setItem('loginTime', Date.now());
      navigate('/home'); // Redirigir a la página deseada
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error; // Manejo de errores en el componente Login
    }
  };

  const logout = () => {
    auth.signOut();
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('loginTime');
    navigate('/'); // Redirigir al login después del logout
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        const userData = userDoc.exists() ? userDoc.data() : {};
        setIsLoggedIn(true);
        setUser({
          fullName: `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
          email: currentUser.email,
          uid: currentUser.uid,
          ...userData,
        });
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};