import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHome, FaInfoCircle, FaUser, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="w-full bg-white/80 backdrop-blur-md shadow-md fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-extrabold text-purple-700 tracking-tight">
          FocusPod
        </Link>
        <span className="text-2xl text-gray-600 font-serif">
                Hello, <span className="font-semibold text-purple-700">{user.name}!</span>
              </span>
        {/* Links */}
        <div className="hidden md:flex space-x-6 items-center font-medium text-gray-700">
          <Link to="/" className="hover:text-purple-600 flex items-center gap-1">
            <FaHome /> Home
          </Link>
          <Link to="/about" className="hover:text-purple-600 flex items-center gap-1">
            <FaInfoCircle /> About
          </Link>
          <Link to="/profile" className="hover:text-purple-600 flex items-center gap-1">
            <FaUser /> Profile
          </Link>
          {user ? (
            <button
              onClick={handleLogout}
              className="text-red-500 hover:text-red-700 flex items-center gap-1"
            >
              <FaSignOutAlt /> Logout
            </button>
          ) : (
            <Link to="/login" className="hover:text-purple-600">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
