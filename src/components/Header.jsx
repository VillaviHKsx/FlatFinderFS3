import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menubar } from 'primereact/menubar';
import { AuthContext } from '../contexts/AuthContext';
import { Menu } from 'primereact/menu'; // Para el menú hamburguesa
import '../styles/header.css';
import logo from '../images/logo.png'; // Importa el logo

const Header = ({ onLogout }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [visibleMenu, setVisibleMenu] = useState(false); // Estado para controlar la visibilidad del menú en mobile

  const items = [
    { label: 'Home', icon: 'pi pi-fw pi-home', command: () => navigate('/home') },
    { label: 'My Profile', icon: 'pi pi-fw pi-user', command: () => navigate(`/profile/${user.uid}`) },
    { label: 'My Flats', icon: 'pi pi-fw pi-building', command: () => navigate('/my-flats') },
    { label: 'Favourites', icon: 'pi pi-fw pi-star', command: () => navigate('/favourites') },
    ...(user?.role === 'admin' ? [{ label: 'All Users', icon: 'pi pi-fw pi-users', command: () => navigate('/all-users') }] : []),
    { label: 'Delete Account', icon: 'pi pi-fw pi-trash', command: () => {/* handle delete account */} },
    { label: 'Logout', icon: 'pi pi-fw pi-sign-out', command: onLogout }
  ];

  const toggleMenu = () => setVisibleMenu(!visibleMenu);

  return (
    <div className="header-container">
      <div className="header-top">
        <img src={logo} alt="Company Logo" className="company-logo" />
        <p>Hello, {user?.fullName || 'User'}</p>
        {/* Icono hamburguesa solo en pantallas pequeñas */}
        <button className="hamburger-icon" onClick={toggleMenu}>
          <i className="pi pi-bars"></i>
        </button>
      </div>
      
      {/* Menú Hamburguesa (solo en pantallas pequeñas) */}
      <Menu model={items} visible={visibleMenu} onHide={() => setVisibleMenu(false)} className="mobile-menu" />
      
      {/* Menubar normal (pantallas grandes) */}
      <Menubar model={items} className="custom-menubar" />
    </div>
  );
};

export default Header;
