import React from 'react';

function LoginButtons() {
  return (
    <div>
      <button type="submit">Iniciar Sesión</button>
      <button type="button" onClick={() => window.location.href = '/register'}>Registrarse</button>
    </div>
  );
}

export default LoginButtons;