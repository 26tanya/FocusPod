import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const CreateRoomPage = () => {
  const [duration, setDuration] = useState(25);
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    const code = uuidv4().slice(0, 6);
    navigate(`/room/${code}?duration=${duration}&creator=true`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-100 dark:from-zinc-900 dark:to-zinc-800 transition-colors duration-300">
      <div className="w-full max-w-md p-8 bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border dark:border-zinc-700 text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 font-inter">
           Create Group Focus Room
        </h2>

        <div className="text-left mb-6">
          <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
            Select Session Duration
          </label>
          <select
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
          >
            <option value={15}>15 Minutes</option>
            <option value={25}>25 Minutes</option>
            <option value={45}>45 Minutes</option>
            <option value={60}>60 Minutes</option>
          </select>
        </div>

        <button
          onClick={handleCreateRoom}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
           Create Room
        </button>
      </div>
    </div>
  );
};

export default CreateRoomPage;
