import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState('');

  const login = (username, password) => {
    if (username === 'user' && password === 'password') {
      setAuthenticated(true);
      setError('');
    } else {
      setAuthenticated(false);
      setError('Invalid credentials');
    }
  };

  const value = {
    authenticated,
    error,
    login
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
