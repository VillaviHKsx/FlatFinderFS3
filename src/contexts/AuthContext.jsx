import React, { createContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebaseConfig';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
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

  const logout = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
      setUser(null);
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('loginTime');
      clearInterval(sessionInterval.current);
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const startSessionCountdown = () => {
    clearInterval(sessionInterval.current);
    sessionInterval.current = setInterval(() => {
      setSessionTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(sessionInterval.current);
          logout();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const updateUser = (updatedUser) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...updatedUser,
    }));
  };

  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn');
    const loginTime = localStorage.getItem('loginTime');

    if (storedIsLoggedIn && loginTime) {
      const elapsedTime = (Date.now() - loginTime) / 1000;
      if (elapsedTime < 300) {
        setIsLoggedIn(true);
        setSessionTime(300 - elapsedTime);
        startSessionCountdown();
      } else {
        logout();
      }
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const fetchUserData = async () => {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          const userData = userDoc.exists() ? userDoc.data() : {};
          setUser({
            fullName: `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
            email: currentUser.email,
            uid: currentUser.uid,
            ...userData,
          });
        };
        fetchUserData();
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, sessionTime, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};