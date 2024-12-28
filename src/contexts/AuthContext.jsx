import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const login = (email, password) => {
    console.log('Iniciando sesión con:', email, password);
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', true);
    localStorage.setItem('loginTime', Date.now());
    navigate('/home');
  };

  const logout = () => {
    console.log('Cerrando sesión...');
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('loginTime');
    navigate('/login');
  };

  useEffect(() => {
    const checkSession = () => {
      const loginTime = localStorage.getItem('loginTime');
      if (loginTime) {
        const currentTime = Date.now();
        const diff = currentTime - parseInt(loginTime, 10);
        if (diff > 3600000) { // 60 minutos
          console.log('Sesión expirada. Cerrando sesión.');
          logout();
        } else {
          console.log('Sesión activa.');
          setIsLoggedIn(true);
        }
      }
    };

    checkSession();
    const interval = setInterval(checkSession, 1000);
    return () => clearInterval(interval);
  }, []); // Aquí no hay dependencias problemáticas

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};