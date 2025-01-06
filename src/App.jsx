import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Update from './pages/Update';
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
          <Route path="profile" element={<Profile />} />
          <Route path="update" element={<Update />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;