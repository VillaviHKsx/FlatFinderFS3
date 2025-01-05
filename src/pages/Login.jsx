/*import React, { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import LoginForm from '../components/LoginForm';
import LoginButtons from '../components/LoginButtons';
import Swal from 'sweetalert2';

function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Verificar si el correo existe en Firestore
      const usersCollection = collection(db, 'users'); // 'users' es la colección
      const q = query(usersCollection, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // Si la consulta no devuelve resultados, el usuario no existe
        Swal.fire({
          icon: 'error',
          title: 'Usuario no encontrado',
          text: 'El correo ingresado no está registrado en el sistema.',
        });
        return;
      }

      // Si existe el usuario, intentamos autenticarnos con Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Usuario autenticado:', userCredential.user);

      // Iniciar sesión y redirigir a Home
      login(email, password);
    } catch (err) {
      console.error('Error al iniciar sesión:', err);

      // Manejar errores de Firebase Auth
      let errorMessage;

      switch (err.code) {
        case 'auth/user-not-found':
          errorMessage = 'Usuario no encontrado. Por favor verifica tus credenciales.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Contraseña incorrecta. Inténtalo nuevamente.';
          break;
        case 'auth/missing-password':
          errorMessage = 'Contraseña en blanco. Inténtalo nuevamente.';
          break;
        case 'auth/invalid-credential':
          errorMessage = 'Contraseña incorrecta. Inténtalo nuevamente.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'El correo electrónico proporcionado no es válido.';
          break;
        default:
          errorMessage = 'Ocurrió un error al iniciar sesión. Por favor intenta de nuevo.';
          break;
      }

      // Mostrar error con SweetAlert2
      Swal.fire({
        icon: 'error',
        title: 'Inicio de Sesión Fallido',
        text: errorMessage,
      });
    }
  };

  return (
    <div>
      <h1>Iniciar Sesión</h1>
      <form onSubmit={handleSubmit}>
        <LoginForm email={email} setEmail={setEmail} password={password} setPassword={setPassword} />
        <LoginButtons />
      </form>
    </div>
  );
}

export default Login; */

import React, { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import LoginForm from '../components/LoginForm';
import LoginButtons from '../components/LoginButtons';
import Swal from 'sweetalert2';
import '../styles/login.css'; // Importamos el archivo CSS

function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Verificar si el correo existe en Firestore
      const usersCollection = collection(db, 'users'); // 'users' es la colección
      const q = query(usersCollection, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // Si la consulta no devuelve resultados, el usuario no existe
        Swal.fire({
          icon: 'error',
          title: 'Usuario no encontrado',
          text: 'El correo ingresado no está registrado en el sistema.',
        });
        return;
      }

      // Si existe el usuario, intentamos autenticarnos con Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Usuario autenticado:', userCredential.user);

      // Iniciar sesión y redirigir a Home
      login(email, password);
    } catch (err) {
      console.error('Error al iniciar sesión:', err);

      // Manejar errores de Firebase Auth
      let errorMessage;

      switch (err.code) {
        case 'auth/user-not-found':
          errorMessage = 'Usuario no encontrado. Por favor verifica tus credenciales.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Contraseña incorrecta. Inténtalo nuevamente.';
          break;
        case 'auth/missing-password':
          errorMessage = 'Contraseña en blanco. Inténtalo nuevamente.';
          break;
        case 'auth/invalid-credential':
          errorMessage = 'Contraseña incorrecta. Inténtalo nuevamente.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'El correo electrónico proporcionado no es válido.';
          break;
        default:
          errorMessage = 'Ocurrió un error al iniciar sesión. Por favor intenta de nuevo.';
          break;
      }

      // Mostrar error con SweetAlert2
      Swal.fire({
        icon: 'error',
        title: 'Inicio de Sesión Fallido',
        text: errorMessage,
      });
    }
  };

  return (
    <div className="login-container">
      <h1>Iniciar Sesión</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <LoginForm email={email} setEmail={setEmail} password={password} setPassword={setPassword} />
        <LoginButtons />
      </form>
    </div>
  );
}

export default Login;