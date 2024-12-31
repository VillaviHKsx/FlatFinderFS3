import React, { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext'; // Importar el contexto
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig'; // Importar configuración de Firebase
import LoginForm from '../components/LoginForm';
import LoginButtons from '../components/LoginButtons';
import Swal from 'sweetalert2'; // Importar SweetAlert2

function Login() {
  const { login } = useContext(AuthContext); // Usar el método login del contexto
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Autenticar al usuario con Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Verificar si el usuario existe en Firestore
      const userDocRef = doc(db, 'users', user.uid); // 'users' es la colección donde están los usuarios
      const userDoc = await getDoc(userDocRef);
  
      if (userDoc.exists()) {
        console.log('Usuario encontrado en Firestore:', userDoc.data());
        login(email, password); // Usar método login del contexto para redirigir
      } else {
        console.error('Usuario no registrado en Firestore.');
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'El usuario no está registrado en el sistema.',
        });
      }
    } catch (err) {
      console.error('Error al iniciar sesión:', err.message);
  
      // Mostrar alerta dependiendo del código de error de Firebase Auth
      let errorMessage;
  
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'Usuario no encontrado. Por favor verifica tus credenciales.';
      } else if (err.code === 'auth/invalid-credential') {
        errorMessage = 'Contraseña incorrecta. Inténtalo nuevamente.';
      } else if (err.code === 'auth/missing-password  ') {
        errorMessage = 'Contraseña en blanco. Inténtalo nuevamente.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'El correo electrónico proporcionado no es válido.';
      } else {
        errorMessage = 'Ocurrió un error al iniciar sesión. Por favor intenta de nuevo.';
      }
  
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

export default Login;