import React from 'react';
import { Button } from 'primereact/button';

function LoginButtons() {
  return (
    <div className="button-group">
      <Button type="submit" label="Login" className="p-button-rounded p-button-success" />
      <Button
        type="button"
        label="Register"
        className="p-button-rounded p-button-outlined"
        onClick={() => window.location.href = '/register'}
      />
    </div>
  );
}

export default LoginButtons;