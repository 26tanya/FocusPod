import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { nanoid } from 'nanoid';
import Navbar from '../components/Navbar';
import StudyCalendar from '../components/StudyCalendar';
const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [joinCode, setJoinCode] = useState('');

  const handleCreateRoom = () => {
    const roomCode = nanoid(6);
    navigate(`/create-room`);
  };

  const handleJoinRoom = () => {
    if (joinCode.trim()) {
      navigate(`/room/${joinCode.trim()}`);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-[#f8cdda] via-[#e2c0f9] to-[#fceabb]">
      <Navbar />
      <div className="px-6 max-w-4xl mx-auto">

        <div className="grid sm:grid-cols-2 gap-6 mt-6">
          {/* Solo Session */}
          <div className="bg-white/90 p-6 rounded-xl shadow-md hover:shadow-lg transition text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Start a Solo Session</h2>
            <button
              onClick={() => navigate('/start-solo')}
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
            >
              Start Solo Timer
            </button>
          </div>

          {/* Create Room */}
          <div className="bg-white/90 p-6 rounded-xl shadow-md hover:shadow-lg transition text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Create a Group Room</h2>
            <button
              onClick={handleCreateRoom}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
            >
              Create Room
            </button>
          </div>

          {/* Join Room */}
          <div className="bg-white/90 p-6 rounded-xl shadow-md hover:shadow-lg transition col-span-2 text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Join a Room</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Enter Room Code"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button
                onClick={handleJoinRoom}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
              >
                Join
              </button>
            </div>
          </div>

          {/* Track Progress */}
          <div className="bg-white/90 p-6 rounded-xl shadow-md hover:shadow-lg transition text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Track Progress</h2>
            <button
              onClick={() => navigate('/progress')}
              className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
            >
              View Progress
            </button>
          </div>

          {/* About */}
          <div className="bg-white/90 p-6 rounded-xl shadow-md hover:shadow-lg transition text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">About / Help</h2>
            <button
              onClick={() => navigate('/about')}
              className="w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600 transition"
            >
              Learn More
            </button>
            
          </div>
        </div>
         <div className="flex justify-center mb-10">
            <StudyCalendar />
          </div>
      </div>
    </div>
  );
};

export default Dashboard;
