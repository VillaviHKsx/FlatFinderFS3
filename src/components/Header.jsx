import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menubar } from 'primereact/menubar';
import { AuthContext } from '../contexts/AuthContext';
import '../styles/header.css';
import logo from '../images/logo.png'; // Importa el logo

const Header = ({ onLogout }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const items = [
    { label: 'Home', icon: 'pi pi-fw pi-home', command: () => navigate('/home') },
    { label: 'My Profile', icon: 'pi pi-fw pi-user', command: () => navigate(`/profile/${user.uid}`) },
    { label: 'My Flats', icon: 'pi pi-fw pi-building', command: () => navigate('/my-flats') },
    { label: 'Favourites', icon: 'pi pi-fw pi-star', command: () => navigate('/favourites') },
    ...(user?.role === 'admin' ? [{ label: 'All Users', icon: 'pi pi-fw pi-users', command: () => navigate('/all-users') }] : []),
    { label: 'Delete Account', icon: 'pi pi-fw pi-trash', command: () => {/* handle delete account */} },
    { label: 'Logout', icon: 'pi pi-fw pi-sign-out', command: onLogout }
  ];

  return (
    <div className="header-container">
      <div className="header-top">
        <img src={logo} alt="Company Logo" className="company-logo" />
        <p>Hello, {user?.fullName || 'User'}</p>
        {user?.avatarUrl && <img src={user.avatarUrl} alt="User Avatar" className="user-avatar" />}
      </div>
      <Menubar model={items} className="custom-menubar" />
    </div>
  );
};

export default Header;