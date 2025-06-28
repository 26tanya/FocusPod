import React, { useState } from 'react';
import axios from 'axios';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleRequestOtp = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      alert('OTP sent to your email');
      setStep(2);
    } catch (err) {
      alert(err.response?.data?.message || 'Error sending OTP');
    }
  };

  const handleResetPassword = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/reset-password', { email, otp, newPassword });
      alert('Password reset successfully!');
      window.location.href = '/';
    } catch (err) {
      alert(err.response?.data?.message || 'Error resetting password');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>

      {step === 1 && (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-2 mb-3 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            onClick={handleRequestOtp}
            className="bg-blue-600 text-white w-full py-2 rounded"
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
            className="w-full p-2 mb-3 border rounded"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter new password"
            className="w-full p-2 mb-3 border rounded"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button
            onClick={handleResetPassword}
            className="bg-green-600 text-white w-full py-2 rounded"
          >
            Reset Password
          </button>
        </>
      )}
    </div>
  );
};

export default ForgotPasswordPage;
