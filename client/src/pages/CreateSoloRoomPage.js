import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateSoloRoomPage = () => {
  const [mode, setMode] = useState('custom');
  const [duration, setDuration] = useState(25);
  const navigate = useNavigate();

  const handleStart = () => {
    navigate(`/solo?mode=${mode}&duration=${duration}`);
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-xl rounded-2xl mt-10 text-center">
      <h2 className="text-xl font-bold mb-4">🎧 Start Solo Focus Session</h2>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Select Mode:</label>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="border rounded px-3 py-1 w-full"
        >
          <option value="pomodoro">Pomodoro</option>
          <option value="custom">Custom Duration</option>
        </select>
      </div>

      {mode === 'custom' && (
        <div className="mb-4">
          <label className="block mb-1 font-medium">Select Duration:</label>
          <select
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            className="border rounded px-3 py-1 w-full"
          >
            <option value={1}>1 minutes</option>
            <option value={25}>25 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={45}>45 minutes</option>
            <option value={60}>1 hour</option>
          </select>
        </div>
      )}

      <button
        onClick={handleStart}
        className="bg-blue-600 text-white px-6 py-2 rounded-xl shadow mt-4"
      >
        Start Session
      </button>
    </div>
  );
};

export default CreateSoloRoomPage;
