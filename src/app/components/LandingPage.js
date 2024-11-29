'use client';

import React, { useEffect } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import auth from '../firebase/firebase.js';
import { useAuth } from '../context/AuthContext.js';
import { useRouter } from 'next/navigation';

const provider = new GoogleAuthProvider();
const LandingPage = () => {
  const { user, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('firebaseToken');
    const userName = localStorage.getItem('userName');
    if (token && userName && user) {
      router.push('/home');
    }
  }, [user, router]);

  const handleSignInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      if (user) {
        const idToken = await user.getIdToken();
        login({ name: user.displayName, token: idToken });
      }
    } catch (error) {
      console.error('Error during sign-in:', error);
    }
  };

  if (user) {
    return null;
  }

  return (
    <div className="landing-page">
      <div className="grid-background"></div>
      <div className="grid-overlay"></div>
      <nav className="navbar">
        <div className="logo">SecondBrain</div>
        <button className="login-button" onClick={handleSignInWithGoogle}>
          Login with Google
        </button>
      </nav>
      <div className="hero-section">
        <h1 className="hero-heading">
          Transform Your Digital Knowledge Management
        </h1>
        <p className="hero-paragraph">
          Unlock the power of organized thinking with SecondBrain.
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
