import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useNotifications } from '../context/NotificationContext';
import Api from '../../Api'; // Import your API module
import { useAuth } from '../context/AuthContext';
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const LoginPage = () => {
  const {setAuthToken,setIsAuthenticated}=useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { showNotification } = useNotifications();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      loginSchema.parse({ email, password });

      const response = await Api.post('/user/api/auth/login', { email, password });

      if (response.status >= 200 && response.status < 300) {
        localStorage.setItem('isAuthenticated', 'true');
        const token = response.data.token;
        const user = response.data.user; // Assuming your backend sends a token
        setAuthToken(token);
        setIsAuthenticated(true);
        localStorage.setItem('authToken', token); // Store the token
        localStorage.setItem('user', JSON.stringify(user));
        showNotification('Successfully logged in!', 'success');
        navigate('/');
      } else {
        showNotification(response.data.message || 'Login failed', 'error');
        if (response.data.errors) {
          const newErrors = {};
          response.data.errors.forEach((error) => {
            newErrors[error.path] = error.message;
          });
          setErrors(newErrors);
        } else if (response.data.message) {
          setErrors({ general: response.data.message });
        } else {
          setErrors({ general: 'Invalid login credentials.' });
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof z.ZodError) {
        const newErrors = {};
        error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
        showNotification('Please correct the form errors.', 'warning');
      } else if (error.response) {
        console.error('Login error - Server responded:', error.response.data);
        showNotification(error.response.data.message || 'Login failed', 'error');
        setErrors({ general: error.response.data.message || 'Login failed due to server error.' });
      } else if (error.request) {
        showNotification('Failed to connect to the server.', 'error');
        setErrors({ general: 'Failed to connect to the server.' });
      } else {
        showNotification('An unexpected client-side error occurred.', 'error');
        setErrors({ general: 'An unexpected client-side error occurred.' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
            <p className="text-gray-600 mt-2">Track your daily goals and build better habits</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && <p className="mt-2 text-sm text-red-600">{errors.general}</p>}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;