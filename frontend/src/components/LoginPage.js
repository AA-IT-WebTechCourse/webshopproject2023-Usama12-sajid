import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../utils/axios';
import { useAuth } from '../utils/authUtils';
import { useLocation, useNavigate } from 'react-router-dom';

export default function LoginPage() {
  // State hooks for each form field
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const authContext = useAuth();
  const location = useLocation();
  const loginContext = authContext.login;
  const success = location.state && location.state.success;
  
  const login = async (userData) => {
    try {
      const response = await axiosClient.post('/login-user', userData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case 'username':
        setUsername(value);
        break;
      case 'password':
        setPassword(value);
        break;
      default:
        break;
    }
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // Reset error message
    setLoading(true); // Start loading

    try {
      const response = await login({ username, password });
      // Assuming response contains id
      loginContext(response.user_id, response.access_token);
      navigate('/', { state: { success: false } });
    } catch (error) {
      setError(error.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false); // Stop loading regardless of outcome
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <form onSubmit={handleSubmit}>
          {loading ? (
            <div className="d-flex justify-content-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
            {success && <div className="alert alert-success">Signup successful. Please log in.</div>}
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            <h3>Login</h3>
            <div className="mb-3">
              <label>Username</label>
              <input
                type="username"
                className="form-control"
                placeholder="Enter username"
                name="username"
                value={username}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                name="password"
                value={password}
                onChange={handleChange}
              />
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                Login
              </button>
            </div>
            <p className="text-center">
              New User? <Link to={'/signup'}>Signup Instead</Link>
            </p>
        </>
        )}
        </form>
      </div>
    </div>
  );
};