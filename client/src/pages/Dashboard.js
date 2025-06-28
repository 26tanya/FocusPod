// src/pages/Dashboard.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { nanoid } from 'nanoid';

const Dashboard = () => {
const { user, logout } = useAuth();
const navigate = useNavigate();

const [joinCode, setJoinCode] = useState('');

const handleCreateRoom = () => {
const roomCode = nanoid(6); // generate 6-character room ID
navigate(`/room/${roomCode}`);
};

const handleJoinRoom = () => {
if (joinCode.trim()) {
navigate(`/room/${joinCode.trim()}`);
}
};
//hello

if (!user) return null;
console.log("User from context:", user);

return (
  
<div className="min-h-screen bg-gray-100 p-6">
<div className="flex justify-between items-center mb-6">
<div>
<h1 className="text-3xl font-bold">Hello, {user.name} 👋</h1>
<p className="text-gray-600">{user.email}</p>
</div>
<button className="bg-red-500 text-white px-4 py-2 rounded-lg shadow" onClick={logout} >
Logout
</button>
</div>


  <div className="grid gap-6 max-w-md mx-auto">
    {/* 🧘 Solo Session */}
    <div className="bg-white p-6 rounded-xl shadow-xl text-center">
      <h2 className="text-xl font-semibold mb-4">🧘 Start a Solo Session</h2>
      <button
        className="bg-indigo-600 text-white px-6 py-2 rounded shadow"
        onClick={() => navigate('/solo')}
      >
        Start Solo Timer
      </button>
    </div>

    {/* 👥 Create Room */}
    <div className="bg-white p-6 rounded-xl shadow-xl text-center">
      <h2 className="text-xl font-semibold mb-4">👥 Create a Group Room</h2>
      <button
        className="bg-green-600 text-white px-6 py-2 rounded shadow"
        onClick={handleCreateRoom}
      >
        Create Room
      </button>
    </div>

    {/* 🔑 Join Room */}
    <div className="bg-white p-6 rounded-xl shadow-xl text-center">
      <h2 className="text-xl font-semibold mb-4">🔑 Join a Room</h2>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          placeholder="Enter Room Code"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
          className="border rounded p-2 flex-1"
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleJoinRoom}
        >
          Join
        </button>
      </div>
    </div>
  </div>
</div>
);
};
export default Dashboard