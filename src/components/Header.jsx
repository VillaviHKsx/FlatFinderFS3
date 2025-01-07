import React from 'react';
import { Button } from 'primereact/button';

const Header = ({ user, onLogout }) => {
  return (
    <div className="login-container">
      <h1>Welcome to FlatFinder</h1>
      <div className="login-form">
        <p>Hello, {user?.fullName || 'User'}</p>
        <div className="button-group">
          <Button label="Home" className="p-button-rounded p-button-outlined" />
          <Button label="My Profile" className="p-button-rounded p-button-outlined" />
          <Button label="My Flats" className="p-button-rounded p-button-outlined" />
          <Button label="Favourites" className="p-button-rounded p-button-outlined" />
          {user?.isAdmin && <Button label="All Users" className="p-button-rounded p-button-outlined" />}
          <Button label="Delete Account" className="p-button-rounded p-button-danger" />
          <Button label="Logout" onClick={onLogout} className="p-button-rounded p-button-danger" />
        </div>
      </div>
    </div>
  );
};

export default Header;