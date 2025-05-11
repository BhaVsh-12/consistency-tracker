import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext({
  authToken: null,
  setAuthToken: () => {},
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  // Add any other auth-related values or functions here
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!authToken);

  useEffect(() => {
    if (authToken) {
      localStorage.setItem('authToken', authToken);
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('authToken');
      setIsAuthenticated(false);
    }
  }, [authToken]);

  // You might also want to include functions for login and logout here
  const login = (token) => {
    setAuthToken(token);
  };

  const logout = () => {
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ authToken, setAuthToken, isAuthenticated, setIsAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};