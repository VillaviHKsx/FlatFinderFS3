import React, { createContext, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebaseConfig';
import { signInWithEmailAndPassword, signOut, deleteUser } from 'firebase/auth';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [setSessionTime] = useState(300); // 5 minutos en segundos
  const navigate = useNavigate();
  //const sessionInterval = useRef(null); // Usamos useRef para evitar duplicados en el contador

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
      //startSessionCountdown();

      // Usa un setTimeout para evitar conflictos de navegación
      setTimeout(() => navigate('/home'), 0);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  };

  const handleDeleteAccount = async () => {
    const currentUser = auth.currentUser;

    if (currentUser) {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            // Eliminar el documento del usuario en Firestore
            await deleteDoc(doc(db, 'users', currentUser.uid));

            // Eliminar el usuario en Firebase Authentication
            await deleteUser(currentUser);

            // Cerrar sesión
            await signOut(auth);
            setIsLoggedIn(false);
            setUser(null);
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('loginTime');

            Swal.fire({
              icon: 'success',
              title: 'Account Deleted',
              text: 'Your account has been deleted successfully.',
            });

            navigate('/');
          } catch (error) {
            console.error('Error deleting account:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'There was an error deleting your account. Please try again later.',
            });
          }
        }
      });
    }
  };

  const onLogout = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
      setUser(null);
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('loginTime');
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'There was an error logging out. Please try again later.',
      });
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, handleDeleteAccount, onLogout }}>
      {children}
    </AuthContext.Provider>
  );
};