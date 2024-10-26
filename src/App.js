import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { AuthProvider, useAuth } from './Componets/authContext';
import Register from './Componets/Registration';
import Login from './Componets/Login';
import Home from './Componets/Home';
import Profile from './Componets/Profile';
import ProtectedRoute from './Componets/ProtectedRoute';
import './App.css';

const Navigation = () => {
  const { isAuthenticated } = useAuth();

  return (
    <nav>
      <ul>
        {!isAuthenticated ? (
          <li className='Links'>
            <NavLink to="/register" className={({ isActive }) => (isActive ? 'active' : '')}>Register</NavLink>
            <NavLink to="/login" className={({ isActive }) => (isActive ? 'active' : '')}>Login</NavLink>
          </li>
        ) : (
          <li className='Links'>
            <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>Home</NavLink>
            <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : '')}>Profile</NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navigation />
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;