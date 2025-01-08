import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import Header from '../components/Header';
import '../styles/login.css';

const Update = () => {
  const { user, logout } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    birthDate: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', userId || user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setFormData({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            birthDate: data.birthDate || '',
            password: '',
            confirmPassword: ''
          });
        } else {
          console.error('User not found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId, user.uid]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const userDoc = doc(db, 'users', userId || user.uid);
      await updateDoc(userDoc, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        birthDate: formData.birthDate,
        password: formData.password // Asegúrate de manejar la encriptación de la contraseña en tu backend
      });
      alert('Profile updated successfully');
      navigate('/home');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  };

  return (
    <div>
      <Header user={user} onLogout={logout} />
      <div className="update-container">
        <h2>Update Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="p-field">
            <label htmlFor="firstName">First Name</label>
            <InputText id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} />
          </div>
          <div className="p-field">
            <label htmlFor="lastName">Last Name</label>
            <InputText id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} />
          </div>
          <div className="p-field">
            <label htmlFor="email">Email</label>
            <InputText id="email" name="email" value={formData.email} onChange={handleChange} />
          </div>
          <div className="p-field">
            <label htmlFor="birthDate">Birth Date</label>
            <InputText id="birthDate" name="birthDate" value={formData.birthDate} onChange={handleChange} />
          </div>
          <div className="p-field">
            <label htmlFor="password">Password</label>
            <Password id="password" name="password" value={formData.password} onChange={handleChange} />
          </div>
          <div className="p-field">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <Password id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
          </div>
          <Button label="Update" icon="pi pi-check" type="submit" />
        </form>
      </div>
    </div>
  );
};

export default Update;