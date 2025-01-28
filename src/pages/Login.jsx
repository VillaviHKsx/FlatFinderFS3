import React, { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import LoginForm from '../components/LoginForm';
import LoginButtons from '../components/LoginButtons';
import Swal from 'sweetalert2';
import '../styles/login.css'; // Importamos el archivo CSS
import ImageLogin from '../images/ImageLogin.jpg';

function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const usersCollection = collection(db, 'users'); // 'users' es la colección
      const q = query(usersCollection, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Swal.fire({
          icon: 'error',
          title: 'Usuario no encontrado',
          text: 'El correo ingresado no está registrado en el sistema.',
        });
        return;
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Usuario autenticado:', userCredential.user);

      login(email, password);
    } catch (err) {
      console.error('Error al iniciar sesión:', err);

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

      Swal.fire({
        icon: 'error',
        title: 'Inicio de Sesión Fallido',
        text: errorMessage,
      });
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        {/* Imagen al lado del formulario */}
        <div className="login-image">
          <img src={ImageLogin} alt="Login Illustration" />
        </div>
        
        {/* Formulario de inicio de sesión */}
        <div className="login-form-container">
          <h1>FlatFinder FS3</h1>
          <form onSubmit={handleSubmit} className="login-form">
            <LoginForm email={email} setEmail={setEmail} password={password} setPassword={setPassword} />
            <LoginButtons />
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
