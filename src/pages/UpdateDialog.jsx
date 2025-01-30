import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import Swal from 'sweetalert2';
import '../styles/login.css';

const UpdateDialog = ({ visible, onHide, onUpdate }) => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    birthDate: '',
    password: '',
    confirmPassword: ''
  });
  const [storedPassword, setStoredPassword] = useState('');
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
          setStoredPassword(data.password || '');
        } else {
          console.error('User not found');
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'User not found',
            backdrop: true,
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error fetching user data',
          backdrop: true,
        });
      }
    };

    fetchUserData();
  }, [userId, user.uid]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== storedPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Incorrect password',
        backdrop: true,
      });
      return;
    }

    try {
      const updatedUser = {
        ...user,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        birthDate: formData.birthDate,
        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
      };

      await onUpdate(updatedUser);

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Profile updated successfully',
        backdrop: true,
      });
      onHide();
      navigate(`/profile/${userId || user.uid}`);
    } catch (error) {
      console.error('Error updating profile:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error updating profile',
        backdrop: true,
      });
    }
  };

  return (
    <Dialog header="Update Profile" visible={visible} style={{ width: '50vw' }} onHide={onHide}>
      <form onSubmit={handleSubmit}>
        <div className="p-field">
          <label htmlFor="firstName">First Name: </label>
          <InputText id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} />
        </div>
        <div className="p-field">
          <label htmlFor="lastName">Last Name: </label>
          <InputText id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} />
        </div>
        <div className="p-field">
          <label htmlFor="email">Email: </label>
          <InputText id="email" name="email" value={formData.email} onChange={handleChange} disabled />
        </div>
        <div className="p-field">
          <label htmlFor="birthDate">Birth Date: </label>
          <InputText id="birthDate" name="birthDate" value={formData.birthDate} onChange={handleChange} />
        </div>
        <div className="p-field">
          <label htmlFor="password">Password: </label>
          <Password id="password" name="password" value={formData.password} onChange={handleChange} disabled />
        </div>
        <div className="p-field">
          <label htmlFor="confirmPassword">Confirm Password: </label>
          <Password id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
        </div>
        <Button label="Update" icon="pi pi-check" type="submit" />
      </form>
    </Dialog>
  );
};

export default UpdateDialog;