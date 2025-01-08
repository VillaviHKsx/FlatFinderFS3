import React, { createContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebaseConfig';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [sessionTime, setSessionTime] = useState(300); // 5 minutos en segundos
  const navigate = useNavigate();
  const sessionInterval = useRef(null); // Usamos useRef para evitar duplicados en el contador

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const currentUser = userCredential.user;

      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
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
      setSessionTime(300); // Reinicia el tiempo de sesión
      startSessionCountdown();

      // Usa un setTimeout para evitar conflictos de navegación
      setTimeout(() => navigate('/home'), 0);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  };

  const logout = () => {
    if (sessionInterval.current) clearInterval(sessionInterval.current);
    auth.signOut();
    setIsLoggedIn(false);
    setUser(null);
    setSessionTime(0);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('loginTime');
    navigate('/'); // Redirige al login
  };

  const startSessionCountdown = () => {
    if (sessionInterval.current) clearInterval(sessionInterval.current); // Asegurar que no existan duplicados
    sessionInterval.current = setInterval(() => {
      setSessionTime((prevTime) => {
        if (prevTime <= 1) {
          console.log('Tiempo de sesión agotado. Requiriendo nuevo login.');
          clearInterval(sessionInterval.current);
          logout(); // Finaliza la sesión si el tiempo llega a 0
        }
        console.log(`Tiempo restante de sesión: ${prevTime - 1}s`);
        return prevTime - 1;
      });
    }, 1000);
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

        setSessionTime(300); // Reinicia el tiempo de sesión
        startSessionCountdown();
      } else {
        setIsLoggedIn(false);
        setUser(null);
        if (sessionInterval.current) clearInterval(sessionInterval.current);
      }
    });

    return () => {
      unsubscribe();
      if (sessionInterval.current) clearInterval(sessionInterval.current);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, sessionTime }}>
      {children}
    </AuthContext.Provider>
  );
};