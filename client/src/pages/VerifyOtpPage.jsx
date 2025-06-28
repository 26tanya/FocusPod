// src/pages/VerifyOtpPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const VerifyOtpPage = () => {
  const { login } = useAuth();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const search = new URLSearchParams(useLocation().search);
  const email = search.get('email');

  const handleVerify = async (e) => {
  e.preventDefault();
  setError('');
  try {
    const res = await axios.post('http://localhost:5000/api/auth/verify-otp', {
      email,
      otp,
    });
    
    alert('✅ OTP Verified! Logging you in...');
    login(res.data);  // Auto-login via context
    navigate('/dashboard');  // Redirect to dashboard
  } catch (err) {
    console.error(err);
    setError(err.response?.data?.message || 'OTP verification failed');
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-xl shadow max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">🔐 Verify OTP</h2>
        <p className="text-sm text-gray-600 mb-4 text-center">
          We’ve sent an OTP to <strong>{email}</strong>. Please enter it below to verify.
        </p>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <form className="space-y-4" onSubmit={handleVerify}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
