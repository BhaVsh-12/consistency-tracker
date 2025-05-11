import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useNotifications } from '../context/NotificationContext';
import Api from '../../Api'; // Import your API module

const signupSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { showNotification } = useNotifications();

const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      signupSchema.parse({ name, email, password, confirmPassword });

      const response = await Api.post('/user/api/auth/signup', { name, email, password });

      if (response.status >= 200 && response.status < 300) {
        localStorage.setItem('isAuthenticated', 'true');
        showNotification(response.data.message || 'Account created successfully!', 'success');
        navigate('/');
      } else {
        // Handle backend validation errors or other server-side issues
        showNotification(response.data.message || 'Signup failed', 'error');
        if (response.data.errors) {
          const newErrors = {};
          response.data.errors.forEach((error) => {
            newErrors[error.path] = error.message;
          });
          setErrors(newErrors);
        } else if (response.data.message) {
          setErrors({ general: response.data.message });
        } else {
          setErrors({ general: 'An unexpected error occurred.' });
        }
      }
    } catch (error) {
      console.error('Signup error:', error);
      if (error instanceof z.ZodError) {
        // Handle frontend validation errors (Zod)
        const newErrors = {};
        error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
        showNotification('Please correct the form errors.', 'warning');
      } else if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Signup error - Server responded:', error.response.data);
        showNotification(error.response.data.message || 'Signup failed', 'error');
        if (error.response.data.errors) {
          const newErrors = {};
          error.response.data.errors.forEach((err) => {
            newErrors[err.path] = err.message;
          });
          setErrors(newErrors);
        } else if (error.response.data.message) {
          setErrors({ general: error.response.data.message });
        } else {
          setErrors({ general: 'Signup failed due to server error.' });
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Signup error - No response from server:', error.request);
        showNotification('Failed to connect to the server.', 'error');
        setErrors({ general: 'Failed to connect to the server.' });
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Signup error - Request setup error:', error.message);
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
            <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
            <p className="text-gray-600 mt-2">Start tracking your daily goals</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && <p className="mt-2 text-sm text-red-600">{errors.general}</p>}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

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
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
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
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              Create Account
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;