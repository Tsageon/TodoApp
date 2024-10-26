import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('token');
    return token !== null; 
  });

  const login = (token) => {
    setIsAuthenticated(true);
    localStorage.setItem('token', token); 
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('token'); 
  };

  const isTokenExpired = (token) => {
    if (!token) return true;
    const payload = JSON.parse(atob(token.split('.')[1])); 
    return payload.exp * 1000 < Date.now();
  };

  useEffect(() => {
   
    const token = localStorage.getItem('token');
    if (isTokenExpired(token)) {
      logout();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
