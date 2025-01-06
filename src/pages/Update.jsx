import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import Swal from 'sweetalert2';
import '../styles/login.css'; // Reutilizamos login.css para estilos

function ProfileUpdate() {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    birthDate: '',
    password: '',
    confirmPassword: '',
  });
  const [userId, setUserId] = useState(null);
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
        setFormData({
          email: userDoc.data().email,
          firstName: userDoc.data().firstName,
          lastName: userDoc.data().lastName,
          birthDate: userDoc.data().birthDate,
          password: '', // No mostramos la contraseña
          confirmPassword: '',
        });
        setUserId(currentUser.uid);
      } else {
        console.error('El documento del usuario no existe.');
      }
    };

    fetchUserData();
  }, [auth, navigate]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas no coinciden.',
      });
      return;
    }

    try {
      const updatedData = {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        birthDate: formData.birthDate,
      };

      if (formData.password) {
        updatedData.password = formData.password; // Solo actualizamos la contraseña si está presente
      }

      await updateDoc(doc(db, 'users', userId), updatedData);

      Swal.fire({
        icon: 'success',
        title: 'Actualización exitosa',
        text: 'El perfil ha sido actualizado correctamente.',
      });

      if (auth.currentUser.uid === userId) {
        navigate('/home'); // Redirigir al home si el usuario actualizó su propio perfil
      } else {
        navigate('/all-users'); // Redirigir a All Users si el admin actualizó otro perfil
      }
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el perfil. Inténtalo de nuevo.',
      });
    }
  };

  return (
    <div className="profile-update-container">
      <h1>Actualizar Perfil</h1>
      <form onSubmit={handleUpdate} className="profile-update-form">
        <div className="field">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="field">
          <label>Nombre</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="field">
          <label>Apellido</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="field">
          <label>Fecha de Nacimiento</label>
          <input
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="field">
          <label>Contraseña</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>
        <div className="field">
          <label>Confirmar Contraseña</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" className="update-button">
          Actualizar
        </button>
      </form>
    </div>
  );
}

export default ProfileUpdate;