// src/components/GoogleLoginButton.js
import React from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase/config';
import axios from 'axios';
const GoogleLoginButton = () => {
    const handleGoogleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userData = {
      name: user.displayName,
      email: user.email
    };

    // Send user data to backend
    await axios.post('http://localhost:5000/api/auth/google-login', userData);

    // Save to localStorage
    localStorage.setItem('user', JSON.stringify(userData));

    // Redirect to dashboard
    window.location.href = '/dashboard';
  } catch (error) {
    console.error('Google login error:', error);
  }
};
  

  return (
    <button
      onClick={handleGoogleLogin}
      className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-md shadow hover:shadow-md flex items-center gap-2"
    >
      <img
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        alt="Google"
        className="w-5 h-5"
      />
      Sign in with Google
    </button>
  );
};

export default GoogleLoginButton;
