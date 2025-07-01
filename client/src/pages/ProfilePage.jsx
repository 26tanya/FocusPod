import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, login } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await axios.put(`http://localhost:5000/api/auth/profile/${user._id}`, {
        name,
      });
      login(res.data.user); // update context
      setSuccess('✅ Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.put(`http://localhost:5000/api/auth/change-password`, {
        userId: user._id,
        currentPassword,
        newPassword,
      });
      setSuccess('🔒 Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Password change failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-6 rounded-2xl shadow-xl max-w-lg w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">👤 Your Profile</h2>

        {success && <p className="text-green-600 text-sm mb-3 text-center">{success}</p>}
        {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}

        {/* Update Name */}
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded shadow"
          >
            Update Name
          </button>
        </form>

        {/* Divider */}
        <hr className="my-6 border-t" />

        {/* Change Password */}
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded shadow"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
