import React, { useState } from 'react';
import GoogleLoginButton from '../components/GoogleLoginButton';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import loginImage from '../Photos/bg1.jpg';
import FeatureCarousel from '../components/FeatureCarousel';
import VerticalSteps from '../components/VerticalSteps';
import TimeGreeting from '../components/TimeGreeting';
import MoodPicker from '../components/MoodPicker';
const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      login(res.data.user);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex h-screen overflow-hidden font-inter">
      {/* Left: Login Form */}
      <div className="w-full md:w-1/3 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 px-6">
        <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
            Focus. Achieve. Repeat.
          </h1>
          <p className="text-center text-gray-800 text-xl mb-6">
            Welcome to FocusPod!
          </p>

          <div className="w-full flex justify-center mb-4">
  <GoogleLoginButton />
</div>

          <div className="my-6 border-t border-gray-300 relative text-center">
            <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white px-2 text-gray-500 text-sm">
              or login with email
            </span>
          </div>

          {error && <p className="text-red-500 text-sm mb-2 text-center">{error}</p>}

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold shadow-md transition duration-200"
            >
              Sign In
            </button>
          </form>

          <div className="text-sm text-center mt-3">
            <a href="/forgot-password" className="text-blue-500 hover:underline">
              Forgot Password?
            </a>
          </div>

          <p className="mt-6 text-sm text-center text-gray-600">
            Don’t have an account?{' '}
            <a href="/register" className="text-blue-600 font-semibold hover:underline">
              Join FocusPod
            </a>
          </p>
        </div>
      </div>

      {/* Right: Background + Overlay Content */}
      {/* Right: Background + Overlay Content */}
<div className="relative hidden md:block w-2/3 h-screen">
  {/* Background Image */}
  <img
    src={loginImage}
    alt="Motivational study"
    className="w-full h-full object-cover"
  />

  {/* Dark Overlay */}
  <div className="absolute inset-0 bg-black/40 z-0" />

  {/* Foreground Content */}
  <div className="absolute inset-0 z-10 flex flex-col items-center justify-start p-6 pt-10 gap-8">
    {/* Greeting at Top */}
    <div className="w-full max-w-xl text-center">
      <TimeGreeting />
    </div>

    {/* Steps + Mood Picker Row */}
    <div className="w-full max-w-5xl flex flex-col md:flex-row justify-center gap-8">
      <VerticalSteps />
      <MoodPicker />
    </div>

    {/* Carousel at Bottom Center */}
    <div className="w-full max-w-2xl flex justify-center">
      <FeatureCarousel />
    </div>
  </div>
</div>


    </div>
  );
};

export default Login;
