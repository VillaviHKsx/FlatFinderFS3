import React, { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext'; // Importar el contexto
import LoginForm from '../components/LoginForm';
import LoginButtons from '../components/LoginButtons';

function Login() {
  const { login } = useContext(AuthContext); // Usar el método login del contexto
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password); // Llamar al método login del contexto
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