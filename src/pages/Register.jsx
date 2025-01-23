/*import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import AWS from 'aws-sdk';
import Swal from 'sweetalert2';
import { auth, db } from '../firebaseConfig';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import '../styles/register.css'; // Importamos los estilos

// Configurar AWS S3
AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  region: process.env.REACT_APP_AWS_REGION,
});

const s3 = new AWS.S3();

function Register() {
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
    if (!firstName || firstName.length < 2) return 'El primer nombre debe tener al menos 2 caracteres.';
    if (!lastName || lastName.length < 2) return 'El apellido debe tener al menos 2 caracteres.';
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return 'El email no es válido.';
    const numericAge = parseInt(age, 10);
    if (!age || isNaN(numericAge) || numericAge < 18 || numericAge > 120) return 'La edad debe estar entre 18 y 120 años.';
    if (!birthDate) return 'La fecha de nacimiento es obligatoria.';
    const today = new Date();
    const enteredDate = new Date(birthDate);
    if (enteredDate > today) return 'La fecha de nacimiento no puede ser en el futuro.';
    if (!password || password.length < 6 || !/[a-zA-Z]/.test(password) || !/\d/.test(password) || !/[^a-zA-Z\d]/.test(password)) {
      return 'La contraseña debe tener al menos 6 caracteres, incluyendo letras, números y un carácter especial.';
    }
    if (password !== confirmPassword) return 'Las contraseñas no coinciden.';
    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validateInputs();
    if (validationError) {
      Swal.fire({
        icon: 'error',
        title: 'Error de validación',
        text: validationError,
      });
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      let avatarUrl = '';
      if (avatarFile) {
        const params = {
          Bucket: process.env.REACT_APP_S3_BUCKET_NAME,
          Key: `avatars/${user.uid}`,
          Body: avatarFile,
          ContentType: avatarFile.type,
        };

        const uploadResult = await s3.upload(params).promise();
        avatarUrl = uploadResult.Location;
      }

      await setDoc(doc(db, 'users', user.uid), {
        firstName,
        lastName,
        email,
        age: parseInt(age, 10),
        birthDate, // Guardar Birth Date en Firestore
        password, // Guardar Password en Firestore
        avatarUrl // Guardar la URL del avatar
      });

      Swal.fire({
        icon: 'success',
        title: 'Registro exitoso',
        text: 'Usuario registrado correctamente.',
        confirmButtonText: 'Ir a inicio',
      }).then(() => {
        navigate('/home');
      });
    } catch (error) {
      let errorMessage = 'No se pudo registrar al usuario. Inténtalo de nuevo.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'El correo electrónico ya está en uso. Por favor, utiliza otro.';
      }

      Swal.fire({
        icon: 'error',
        title: 'Error al registrar',
        text: errorMessage,
      });

      console.error('Error al registrar el usuario:', error);
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
      <h1>Registrar Usuario</h1>
      <form onSubmit={handleRegister} className="register-form">
        <div className="field">
          <span className="p-float-label">
            <InputText id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <label htmlFor="firstName">Nombre</label>
          </span>
        </div>
        <div className="field">
          <span className="p-float-label">
            <InputText id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            <label htmlFor="lastName">Apellido</label>
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
            <label htmlFor="age">Edad</label>
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
            <label htmlFor="password">Contraseña</label>
          </span>
        </div>
        <div className="field">
          <span className="p-float-label">
            <InputText id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
          </span>
        </div>
        <div className="field">
          <label htmlFor="avatar">Avatar</label>
          <FileUpload name="avatar" accept="image/*" maxFileSize={1000000} customUpload uploadHandler={handleAvatarUpload} auto chooseLabel="Selecciona un Avatar" />
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className="button-group">
          <Button type="submit" label="Registrar" className="p-button-rounded p-button-success" />
          <Button type="button" label="Cancelar" className="p-button-rounded p-button-secondary" onClick={handleCancel} />
        </div>
      </form>
    </div>
  );
}

export default Register; */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import AWS from 'aws-sdk';
import Swal from 'sweetalert2';
import { auth, db } from '../firebaseConfig';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import '../styles/register.css'; // Importamos los estilos

// Configurar AWS S3
AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  region: process.env.REACT_APP_AWS_REGION,
});

const s3 = new AWS.S3();

function Register() {
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
        const params = {
          Bucket: process.env.REACT_APP_S3_BUCKET_NAME,
          Key: `avatars/${user.uid}`,
          Body: avatarFile,
          ContentType: avatarFile.type,
        };

        const uploadResult = await s3.upload(params).promise();
        avatarUrl = uploadResult.Location;
      }

      await setDoc(doc(db, 'users', user.uid), {
        firstName,
        lastName,
        email,
        age: parseInt(age, 10),
        birthDate, // Guardar Birth Date en Firestore
        password, // Guardar Password en Firestore
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