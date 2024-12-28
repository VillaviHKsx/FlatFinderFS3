import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';


function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [age, setAge] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

  const validateInputs = () => {
    if (!firstName || firstName.length < 2) {
      return 'El primer nombre debe tener al menos 2 caracteres.';
    }
    if (!lastName || lastName.length < 2) {
      return 'El apellido debe tener al menos 2 caracteres.';
    }
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return 'El email no es válido.';
    }
    const numericAge = parseInt(age, 10);
    if (!age || isNaN(numericAge) || numericAge < 18 || numericAge > 120) {
      return 'La edad debe estar entre 18 y 120 años.';
    }
    if (!password || password.length < 6 || !/[a-zA-Z]/.test(password) || !/\d/.test(password) || !/[^a-zA-Z\d]/.test(password)) {
      return 'La contraseña debe tener al menos 6 caracteres, incluyendo letras, números y un carácter especial.';
    }
    if (password !== confirmPassword) {
      return 'Las contraseñas no coinciden.';
    }
    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Guardar datos del usuario en Firestore
      await setDoc(doc(db, 'users', user.uid), {
        firstName,
        lastName,
        email,
        age: parseInt(age, 10),
      });

      console.log('Usuario registrado exitosamente');
      navigate('/home');
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      setError('No se pudo registrar al usuario. Inténtalo de nuevo.');
    }
  };

  return (
    <div>
      <h1>Registrar Usuario</h1>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Nombre"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Apellido"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="number"
          placeholder="Edad"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirmar Contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
}

export default Register;