import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Notification from './components/Notification';
import { GoalProvider } from './context/GoalContext';
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider } from './context/AuthContext';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');
  const expiry = localStorage.getItem('tokenExpiry');

  const isTokenValid = () => {
    if (!token || !expiry) return false;
    return new Date().getTime() < Number(expiry);
  };

  return isTokenValid() ? children : <Navigate to="/login" />;
};

function App() {




  return (
    <BrowserRouter future={{ v7_startTransition: true }}>
      <NotificationProvider>
        <AuthProvider>
          <GoalProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <HomePage />
                  </PrivateRoute>
                }
              />
            </Routes>
            <Notification />
          </GoalProvider>
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
}

export default App;
