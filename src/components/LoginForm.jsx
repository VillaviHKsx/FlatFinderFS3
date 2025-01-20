import React from 'react';
import { InputText } from 'primereact/inputtext';

function LoginForm({ email, setEmail, password, setPassword }) {
  return (
    <div className="p-fluid">
      <div className="field">
        <span className="p-float-label">
          <InputText
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="email">Email</label>
        </span>
      </div>
      <div className="field">
        <span className="p-float-label">
          <InputText
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="password">Password</label>
        </span>
      </div>
    </div>
  );
}

export default LoginForm;