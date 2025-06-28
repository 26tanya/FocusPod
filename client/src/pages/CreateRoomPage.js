// src/pages/CreateRoomPage.js (or in your dashboard component)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const CreateRoomPage = () => {
  const [duration, setDuration] = useState(25); // default to 25 minutes
  const [roomCode, setRoomCode] = useState('');
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    const code = uuidv4().slice(0, 6); // generate short room code
    setRoomCode(code);

    // Send this info to backend via socket later
    navigate(`/room/${code}?duration=${duration}&creator=true`);
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Create Group Room</h2>

      <label className="block mb-2 text-sm font-medium text-gray-700">
        Select Session Duration
      </label>
      <select
        value={duration}
        onChange={(e) => setDuration(parseInt(e.target.value))}
        className="w-full p-2 mb-4 border rounded"
      >
        <option value={15}>15 Minutes</option>
        <option value={25}>25 Minutes</option>
        <option value={45}>45 Minutes</option>
        <option value={60}>60 Minutes</option>
      </select>

      <button
        onClick={handleCreateRoom}
        className="w-full bg-blue-600 text-white py-2 rounded"
      >
        Create Room
      </button>
    </div>
  );
};

export default CreateRoomPage;
