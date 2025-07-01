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
      login(res.data.user);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'OTP verification failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white dark:from-zinc-900 dark:to-zinc-800 transition-all duration-300 px-4">
      <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-2xl border dark:border-zinc-700 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-4 font-inter">
           Verify OTP
        </h2>
        <p className="text-sm text-gray-600 dark:text-zinc-300 text-center mb-4">
          An OTP has been sent to <strong>{email}</strong>. Please enter it to verify your email.
        </p>
        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}
        <form className="space-y-4" onSubmit={handleVerify}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            required
          />
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-xl shadow-md transition"
          >
            Verify and Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
