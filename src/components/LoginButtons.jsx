/*import React from 'react';

function LoginButtons() {
  return (
    <div>
      <button type="submit">Iniciar Sesión</button>
      <button type="button" onClick={() => window.location.href = '/register'}>Registrarse</button>
    </div>
  );
}

export default LoginButtons; */

import React from 'react';
import { Button } from 'primereact/button';

function LoginButtons() {
  return (
    <div className="button-group">
      <Button type="submit" label="Iniciar Sesión" className="p-button-rounded p-button-success" />
      <Button
        type="button"
        label="Registrarse"
        className="p-button-rounded p-button-outlined"
        onClick={() => window.location.href = '/register'}
      />
    </div>
  );
}

export default LoginButtons;