import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Swal from 'sweetalert2';
import { auth, db } from '../firebaseConfig';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import '../styles/register.css'; // Importamos los estilos

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [age, setAge] = useState('');
  const [birthDate, setBirthDate] = useState(''); // Nuevo estado para Birth Date
  const [error, setError] = useState('');
  const [avatarFile, setAvatarFile] = useState(null); // Nuevo estado para el archivo de avatar

  const navigate = useNavigate();

  const validateInputs = () => {
    if (!firstName || firstName.length < 2) return 'First name must be at least 2 characters long.';
    if (!lastName || lastName.length < 2) return 'Last name must be at least 2 characters long.';
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return 'Invalid email address.';
    const numericAge = parseInt(age, 10);
    if (!age || isNaN(numericAge) || numericAge < 18 || numericAge > 120) return 'Age must be between 18 and 120 years.';
    if (!birthDate) return 'Birth date is required.';
    const today = new Date();
    const enteredDate = new Date(birthDate);
    if (enteredDate > today) return 'Birth date cannot be in the future.';
    if (!password || password.length < 6 || !/[a-zA-Z]/.test(password) || !/\d/.test(password) || !/[^a-zA-Z\d]/.test(password)) {
      return 'Password must be at least 6 characters long, including letters, numbers, and a special character.';
    }
    if (password !== confirmPassword) return 'Passwords do not match.';
    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validateInputs();
    if (validationError) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: validationError,
      });
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      let avatarUrl = '';
      if (avatarFile) {
        const storage = getStorage();
        const storageRef = ref(storage, `avatars/${user.uid}`);
        await uploadBytes(storageRef, avatarFile);
        avatarUrl = await getDownloadURL(storageRef);
      }

      await setDoc(doc(db, 'users', user.uid), {
        firstName,
        lastName,
        email,
        age: parseInt(age, 10),
        birthDate, // Guardar Birth Date en Firestore
        avatarUrl // Guardar la URL del avatar
      });

      Swal.fire({
        icon: 'success',
        title: 'Registration Successful',
        text: 'User registered successfully.',
        confirmButtonText: 'Go to Home',
      }).then(() => {
        navigate('/home');
      });
    } catch (error) {
      let errorMessage = 'Could not register user. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'The email address is already in use. Please use another one.';
      }

      Swal.fire({
        icon: 'error',
        title: 'Registration Error',
        text: errorMessage,
      });

      console.error('Error registering user:', error);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  const handleAvatarUpload = (e) => {
    setAvatarFile(e.files[0]);
  };

  return (
    <div className="register-container">
      <h1>Register User</h1>
      <form onSubmit={handleRegister} className="register-form">
        <div className="field">
          <span className="p-float-label">
            <InputText id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <label htmlFor="firstName">First Name</label>
          </span>
        </div>
        <div className="field">
          <span className="p-float-label">
            <InputText id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            <label htmlFor="lastName">Last Name</label>
          </span>
        </div>
        <div className="field">
          <span className="p-float-label">
            <InputText id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <label htmlFor="email">Email</label>
          </span>
        </div>
        <div className="field">
          <span className="p-float-label">
            <InputText id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} />
            <label htmlFor="age">Age</label>
          </span>
        </div>
        <div className="field">
          <span className="p-float-label">
            <InputText
              id="birthDate"
              type="date" // Tipo Date para seleccionar fecha
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </span>
        </div>
        <div className="field">
          <span className="p-float-label">
            <InputText id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <label htmlFor="password">Password</label>
          </span>
        </div>
        <div className="field">
          <span className="p-float-label">
            <InputText id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            <label htmlFor="confirmPassword">Confirm Password</label>
          </span>
        </div>
        <div className="field">
          <label htmlFor="avatar">Avatar</label>
          <FileUpload name="avatar" accept="image/*" maxFileSize={1000000} customUpload uploadHandler={handleAvatarUpload} auto chooseLabel="Select an Avatar" />
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className="button-group">
          <Button type="submit" label="Register" className="p-button-rounded p-button-success" />
          <Button type="button" label="Cancel" className="p-button-rounded p-button-secondary" onClick={handleCancel} />
        </div>
      </form>
    </div>
  );
}

export default Register;