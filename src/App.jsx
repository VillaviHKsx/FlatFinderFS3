import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import NewFlat from './pages/NewFlat';
import AllFlats from './pages/AllFlats';
import UpdateProfile from './pages/UpdateProfile';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="home" element={<Home />} />
          <Route path='newflat' element={<NewFlat />} />
          <Route path="allflats" element={<AllFlats />} />
          <Route path="updateprofile" element={<UpdateProfile />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;