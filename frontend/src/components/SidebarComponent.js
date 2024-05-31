import React from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { FaHome, FaBox, FaUserCog, FaSignOutAlt, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import { useAuth } from '../utils/authUtils';
import { useNavigate, useLocation } from 'react-router-dom';

export default function SidebarComponent() {
  const { isLoggedIn, signout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (link) => {
    if (link === '/signout') {
      signout();
      navigate('/');
    } else {
      navigate(link);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const activeStyle = {
    backgroundColor: '#007bff',
    color: '#fff',
  };

  return (
    <Sidebar>
      <div className="sidebar-header">
        <h3>WEB SHOP</h3>
      </div>
      <Menu iconShape="circle">
        <MenuItem icon={<FaHome />} style={isActive('/') ? activeStyle : {}} onClick={() => handleNavigate('/')}>Home</MenuItem>
        {isLoggedIn ? (
          <>
            <MenuItem icon={<FaBox />} style={isActive('/myitems') ? activeStyle : {}} onClick={() => handleNavigate('/myitems')}>My Items</MenuItem>
            <MenuItem icon={<FaUserCog />} style={isActive('/account') ? activeStyle : {}} onClick={() => handleNavigate('/account')}>Account Settings</MenuItem>
            <MenuItem icon={<FaSignOutAlt />} onClick={() => handleNavigate('/signout')}>Signout</MenuItem>
          </>
        ) : (
          <>
            <MenuItem icon={<FaSignInAlt />} style={isActive('/login') ? activeStyle : {}} onClick={() => handleNavigate('/login')}>Login</MenuItem>
            <MenuItem icon={<FaUserPlus />} style={isActive('/signup') ? activeStyle : {}} onClick={() => handleNavigate('/signup')}>Sign Up</MenuItem>
          </>
        )}
      </Menu>
    </Sidebar>
  );
};