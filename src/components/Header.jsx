import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menubar } from 'primereact/menubar';
import { Sidebar } from 'primereact/sidebar';
import { AuthContext } from '../contexts/AuthContext';
import '../styles/header.css';
import logo from '../images/logo.png'; // Importa el logo

const Header = () => {
  const { user, handleDeleteAccount, onLogout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  const items = [
    { label: 'Home', icon: 'pi pi-fw pi-home', command: () => navigate('/home') },
    { label: 'My Profile', icon: 'pi pi-fw pi-user', command: () => navigate(`/profile/${user.uid}`) },
    { label: 'My Flats', icon: 'pi pi-fw pi-building', command: () => navigate('/my-flats') },
    { label: 'Favourites', icon: 'pi pi-fw pi-star', command: () => navigate('/favourites') },
    ...(user?.role === 'admin' ? [{ label: 'All Users', icon: 'pi pi-fw pi-users', command: () => navigate('/all-users') }] : []),
    { label: 'Delete Account', icon: 'pi pi-fw pi-trash', command: handleDeleteAccount },
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

      <Sidebar visible={visible} onHide={() => setVisible(false)}>
        <ul className="sidebar-menu">
          {items.map((item, index) => (
            <li key={index} onClick={item.command}>
              <i className={item.icon}></i>
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </Sidebar>
    </div>
  );
};

export default Header;