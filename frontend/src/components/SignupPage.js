import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../utils/axios';
import { useNavigate } from 'react-router-dom';

export default function SignupPage() {
  let navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const signup = async (userData) => {
    try {
      const response = await axiosClient.post('/signup-user', userData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  const validatePwds = () => {
    return pwd === confirmPwd;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validatePwds()) {
      setError(`Passwords didn't match.`);
      return;
    }

    try {
      setError(''); // Clear previous errors
      setLoading(true); // Start loading
      
      const userData = {
        username,
        email,
        password: pwd
      };

      await signup(userData);
      // After successful signup
      navigate('/login', { state: { success: true } });
    } catch (error) {
      setError(error.message || 'An error occurred during signup.');
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
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
          <h3>Sign Up</h3>
          <div className="mb-3">
            <label>Username</label>
            <input
              type="text"
              className="form-control"
              placeholder="Please enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label>Email address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label>Confirm Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password again"
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
            />
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Sign Up
            </button>
          </div>
          <p className="text-center">
            Existing User? <Link to={'/login'}>Login Instead</Link>
          </p>
          </>
        )}
        </form>
      </div>
    </div>
  );
};
