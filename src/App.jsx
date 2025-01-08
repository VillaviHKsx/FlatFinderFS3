import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import Home from './pages/Home';
import Register from './pages/Register';
import Profile from './pages/Profile';
import UpdateDialog from './pages/UpdateDialog';
import AllUsers from './pages/AllUsers';
import Newflat from './pages/Newflat';
import PrivateRoute from './components/PrivateRoute';

import 'primereact/resources/themes/lara-light-indigo/theme.css';  // Tema
import 'primereact/resources/primereact.min.css';                // Componentes
import 'primeicons/primeicons.css';                             // Iconos

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="home" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="profile" element={<Profile />} />
          <Route path="update" element={<UpdateDialog />} />
          <Route path="all-users" element={<AllUsers />} />
          <Route path="newflat" element={<PrivateRoute><Newflat /></PrivateRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;