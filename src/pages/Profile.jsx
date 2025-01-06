import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import '../styles/login.css'; // Reutilizamos login.css para estilos

function Profile() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        navigate('/'); // Redirigir al login si no hay usuario autenticado
        return;
      }

      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        setUser(userDoc.data());
        setIsAdmin(userDoc.data().role === 'admin'); // Asumimos que hay un campo `role` en la base de datos
      } else {
        console.error('El documento del usuario no existe.');
      }
    };

    fetchUserData();
  }, [auth, navigate]);

  if (!user) {
    return <p>Cargando...</p>;
  }

  const handleEdit = () => {
    navigate('/update'); // Redirigir a la página de actualización del perfil
  };

  return (
    <div className="profile-container">
      <h1>Perfil de Usuario</h1>
      <div className="profile-details">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Nombre:</strong> {user.firstName}</p>
        <p><strong>Apellido:</strong> {user.lastName}</p>
        <p><strong>Fecha de nacimiento:</strong> {user.birthDate}</p>
      </div>
      {(auth.currentUser.uid === user.uid || isAdmin) && (
        <button className="edit-button" onClick={handleEdit}>
          Editar Perfil
        </button>
      )}
    </div>
  );
}

export default Profile;