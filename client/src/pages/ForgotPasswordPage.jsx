import React, { useState } from 'react';
import axios from 'axios';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');

  const handleRequestOtp = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      alert('✅ OTP sent to your email');
      setStep(2);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error sending OTP');
    }
  };

  const handleResetPassword = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/reset-password', {
        email,
        otp,
        newPassword,
      });
      alert('✅ Password reset successfully!');
      window.location.href = '/';
    } catch (err) {
      setError(err.response?.data?.message || 'Error resetting password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white dark:from-zinc-900 dark:to-zinc-800 transition-all duration-300">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-2xl border dark:border-zinc-700">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6 font-inter">
           Forgot Your Password?
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter your registered email"
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition mb-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              onClick={handleRequestOtp}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-xl shadow-md transition"
            >
              Send OTP
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition mb-4"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition mb-4"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button
              onClick={handleResetPassword}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-xl shadow-md transition"
            >
              Reset Password
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
