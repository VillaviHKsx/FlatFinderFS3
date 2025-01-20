import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = useContext(AuthContext);

  if (!isLoggedIn) {
    // Si el usuario no está autenticado, redirige al login
    return <Navigate to="/" />;
  }

  // Si el usuario está autenticado, renderiza el componente hijo
  return children;
};

export default PrivateRoute;