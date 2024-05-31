import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    // State initialization
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Initial check
        const accessToken = localStorage.getItem('access_token');
        setIsLoggedIn(!!accessToken);
    }, []);

    const login = (user_id, access_token) => {
        localStorage.setItem('user_id', user_id);
        localStorage.setItem('access_token', access_token);
        setIsLoggedIn(true);
    };

    const signout = () => {
        localStorage.removeItem('user_id');
        localStorage.removeItem('access_token');
        setIsLoggedIn(false);
    };

    const value = useMemo(() => ({
        isLoggedIn,
        login,
        signout
    }), [isLoggedIn]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};