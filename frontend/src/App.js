import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import SignUpPage from './components/SignupPage';
import LoginPage from './components/LoginPage';
import InventoryPage from './components/InventoryPage';
import AccountSettingsPage from './components/AccountSettingsPage';
import SidebarComponent from './components/SidebarComponent';
import { ProSidebarProvider } from 'react-pro-sidebar';

export default function App() {
  return (
    <ProSidebarProvider>
      <div style={{ display: 'flex' }}>
        <SidebarComponent />
        <div style={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/myitems" element={<InventoryPage />} />
            <Route path="/account" element={<AccountSettingsPage />} />
          </Routes>
        </div>
      </div>
    </ProSidebarProvider>
  );
}