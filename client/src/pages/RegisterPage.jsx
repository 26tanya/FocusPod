import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password,
      });
      console.log('✅ Registered:', res.data);
      alert('✅ OTP has been sent to your email. Please verify.');
      navigate(`/verify-otp?email=${email}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white dark:from-zinc-900 dark:to-zinc-800 transition-all duration-300">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-2xl border dark:border-zinc-700">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6 font-inter">
           Create Your Account
        </h2>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            required
          />
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-xl shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            Register
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-4">
          Already have an account? <a href="/login" className="text-purple-600 hover:underline">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
