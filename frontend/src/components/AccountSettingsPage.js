import React, { useState } from 'react';
import axiosClient from '../utils/axios';

export default function AccountSettingsPage() {
  // State hooks for each form field
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function changePassword(userData) {
    try {
      const response = await axiosClient.post('/change-password', userData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
  
  function handleChange(event) {
    const { name, value } = event.target;
    switch (name) {
      case 'oldPassword':
        setOldPassword(value);
        break;
      case 'newPassword':
        setNewPassword(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
      default:
        break;
    }
  }
  
  function validatePasswords() {
    return newPassword === confirmPassword;
  }
  
  async function handleSubmit(event) {
    event.preventDefault();
    if (!validatePasswords()) {
      setError('New passwords do not match.');
      return;
    }
  
    try {
      setError('');
      setLoading(true);
  
      const requestBody = {
        old_password: oldPassword,
        new_password: newPassword
      };
  
      await changePassword(requestBody);
      setSuccess(true);
    } catch (error) {
      setError(error.message || 'Old password is incorrect.');
    } finally {
      setLoading(false);
    }
  }
  

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
            {success && <div className="alert alert-success">Password Updated Successfully</div>}
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            <h3>Account Settings</h3>
            <div className="mb-3">
              <label>Enter Old Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter current password"
                name="oldPassword"
                value={oldPassword}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label>Enter New Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                name="newPassword"
                value={newPassword}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label>Enter New Password Again</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleChange}
              />
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                Change Password
              </button>
            </div>
        </>
        )}
        </form>
      </div>
    </div>
  );
};