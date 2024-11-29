// src/app/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import auth from '../firebase/firebase.js';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check for user token in local storage on mount
    const token = localStorage.getItem('firebaseToken');
    const userName = localStorage.getItem('userName');
    if (token && userName) {
      setUser({ name: userName, token: token });
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('firebaseToken', userData.token);
    localStorage.setItem('userName', userData.name);
  };

  const logout = async () => {
    try {
      console.log("AuthContext: Starting logout"); // Debug log
      await signOut(auth); // Sign out from Firebase
      console.log("AuthContext: Firebase signOut complete"); // Debug log
      setUser(null);
      localStorage.removeItem('firebaseToken');
      localStorage.removeItem('userName');
      console.log("AuthContext: Local storage cleared"); // Debug log
      router.push('/');
      console.log("AuthContext: Navigation complete"); // Debug log
      return Promise.resolve();
    } catch (error) {
      console.error('Error during logout:', error);
      return Promise.reject(error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};